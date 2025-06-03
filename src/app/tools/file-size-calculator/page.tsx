
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HardDrive } from 'lucide-react';
import { FILE_SIZE_UNITS, type FileSizeUnit, formatDisplayValue } from '@/lib/file-size-units';
import { useToast } from '@/hooks/use-toast';

interface CalculatedSize {
  unit: FileSizeUnit;
  value: string;
}

export default function FileSizeCalculatorPage() {
  const [inputValue, setInputValue] = useState<string>('1');
  const [selectedUnitSymbol, setSelectedUnitSymbol] = useState<FileSizeUnit['symbol']>('MB');
  const [calculatedSizes, setCalculatedSizes] = useState<CalculatedSize[]>([]);
  const { toast } = useToast();

  const selectedUnit = useMemo(() => {
    return FILE_SIZE_UNITS.find(u => u.symbol === selectedUnitSymbol) || FILE_SIZE_UNITS[0];
  }, [selectedUnitSymbol]);

  useEffect(() => {
    const numInputValue = parseFloat(inputValue);

    if (isNaN(numInputValue) || numInputValue < 0) {
      if (inputValue.trim() !== '' && inputValue !== '-') { // Allow empty or just negative sign momentarily
        toast({
          variant: 'destructive',
          title: 'Invalid Input',
          description: 'Please enter a valid positive number.',
        });
      }
      setCalculatedSizes([]);
      return;
    }

    const valueInBytes = numInputValue * selectedUnit.bytes;

    const newCalculatedSizes = FILE_SIZE_UNITS.map(unit => {
      const convertedValue = valueInBytes / unit.bytes;
      return {
        unit,
        value: formatDisplayValue(convertedValue, unit.symbol === 'B' ? 0 : 4), // More precision for smaller units if needed
      };
    });
    setCalculatedSizes(newCalculatedSizes);

  }, [inputValue, selectedUnit, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, numbers, and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
       setInputValue(value);
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <HardDrive className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">File Size Calculator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Convert file sizes between various units (e.g., KB, MB, GB).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-end">
            <div>
              <Label htmlFor="inputValue" className="font-medium">Value</Label>
              <Input
                id="inputValue"
                type="text" // Use text to allow more flexible input, validation handles non-numeric
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter file size"
                className="mt-1 text-lg"
              />
            </div>
            <div>
              <Label htmlFor="unitSelect" className="font-medium">Unit</Label>
              <Select
                value={selectedUnitSymbol}
                onValueChange={(value) => setSelectedUnitSymbol(value as FileSizeUnit['symbol'])}
              >
                <SelectTrigger id="unitSelect" className="mt-1 text-lg">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {FILE_SIZE_UNITS.map(unit => (
                    <SelectItem key={unit.symbol} value={unit.symbol}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {calculatedSizes.length > 0 && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-xl font-semibold text-foreground">Equivalent Sizes:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {calculatedSizes.map(item => (
                  <div key={item.unit.symbol} className="flex justify-between items-baseline p-2 bg-muted/30 rounded-md">
                    <span className="text-sm text-muted-foreground">{item.unit.name} ({item.unit.symbol}):</span>
                    <span className="text-base font-medium text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          Conversions based on 1 KB = 1024 Bytes, 1 MB = 1024 KB, etc.
        </CardFooter>
      </Card>
    </div>
  );
}
