
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Repeat } from 'lucide-react';
import { UNIT_CATEGORIES, type UnitCategory, type Unit, convertTemperature } from '@/lib/unit-converter-data';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_CATEGORY = UNIT_CATEGORIES[0].name;

export default function UnitConverterPage() {
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(DEFAULT_CATEGORY);
  const [fromUnitSymbol, setFromUnitSymbol] = useState<string>(UNIT_CATEGORIES[0].units[0].symbol);
  const [toUnitSymbol, setToUnitSymbol] = useState<string>(UNIT_CATEGORIES[0].units[1]?.symbol || UNIT_CATEGORIES[0].units[0].symbol);
  const [inputValue, setInputValue] = useState<string>('1');
  const [outputValue, setOutputValue] = useState<string>('');
  const { toast } = useToast();

  const selectedCategory = useMemo(() => {
    return UNIT_CATEGORIES.find(cat => cat.name === selectedCategoryName) || UNIT_CATEGORIES[0];
  }, [selectedCategoryName]);

  const currentUnits = useMemo(() => selectedCategory.units, [selectedCategory]);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategoryName(categoryName);
    const newCategory = UNIT_CATEGORIES.find(cat => cat.name === categoryName) || UNIT_CATEGORIES[0];
    setFromUnitSymbol(newCategory.units[0].symbol);
    setToUnitSymbol(newCategory.units[1]?.symbol || newCategory.units[0].symbol);
    setInputValue('1'); // Reset input value
  };

  const convertUnits = useCallback(() => {
    const fromUnit = currentUnits.find(u => u.symbol === fromUnitSymbol);
    const toUnit = currentUnits.find(u => u.symbol === toUnitSymbol);
    const numInputValue = parseFloat(inputValue);

    if (!fromUnit || !toUnit || isNaN(numInputValue)) {
      setOutputValue('');
      return;
    }

    let result: number;

    if (selectedCategory.isTemperature) {
      result = convertTemperature(numInputValue, fromUnit.symbol, toUnit.symbol);
    } else {
      if (fromUnit.toBaseFactor === undefined || toUnit.toBaseFactor === undefined) {
         setOutputValue('Error: Conversion factor missing'); return;
      }
      const valueInBaseUnit = numInputValue * fromUnit.toBaseFactor;
      result = valueInBaseUnit / toUnit.toBaseFactor;
    }
    
    // Format output to a reasonable number of decimal places
    if (Math.abs(result) < 0.0001 && result !== 0) {
        setOutputValue(result.toExponential(4));
    } else {
        setOutputValue(Number(result.toFixed(6)).toString());
    }

  }, [inputValue, fromUnitSymbol, toUnitSymbol, currentUnits, selectedCategory]);

  useEffect(() => {
    convertUnits();
  }, [convertUnits]);

  const handleSwapUnits = () => {
    setFromUnitSymbol(toUnitSymbol);
    setToUnitSymbol(fromUnitSymbol);
    setInputValue(outputValue); // Keep the value continuity
    toast({ title: 'Units Swapped!', description: `${toUnitSymbol} is now the input unit.` });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
     // Allow empty string, numbers, decimal point, and negative sign for temperature
    if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
       setInputValue(value);
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <ArrowRightLeft className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Unit Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Convert between various units of measurement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selector */}
          <div>
            <Label htmlFor="categorySelect" className="font-medium">Category</Label>
            <Select value={selectedCategoryName} onValueChange={handleCategoryChange}>
              <SelectTrigger id="categorySelect" className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_CATEGORIES.map(category => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-4">
            {/* From Unit */}
            <div className="space-y-2">
              <Label htmlFor="fromUnitSelect" className="font-medium">From</Label>
              <Select value={fromUnitSymbol} onValueChange={setFromUnitSymbol}>
                <SelectTrigger id="fromUnitSelect">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map(unit => (
                    <SelectItem key={unit.symbol} value={unit.symbol}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text" 
                id="inputValue"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter value"
                className="mt-1"
              />
            </div>

            {/* Swap Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapUnits}
              className="self-center sm:self-end mb-[4px] sm:mb-[2px] h-10 w-10" // Adjust margin for alignment with input
              aria-label="Swap units"
            >
              <Repeat className="h-5 w-5" />
            </Button>

            {/* To Unit */}
            <div className="space-y-2">
              <Label htmlFor="toUnitSelect" className="font-medium">To</Label>
              <Select value={toUnitSymbol} onValueChange={setToUnitSymbol}>
                <SelectTrigger id="toUnitSelect">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map(unit => (
                    <SelectItem key={unit.symbol} value={unit.symbol}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                id="outputValue"
                value={outputValue}
                readOnly
                placeholder="Result"
                className="mt-1 bg-muted/50"
              />
            </div>
          </div>
          
          {fromUnitSymbol && toUnitSymbol && inputValue && parseFloat(inputValue) && outputValue && (
            <div className="text-center text-muted-foreground pt-2">
                {inputValue} {currentUnits.find(u => u.symbol === fromUnitSymbol)?.name} = {outputValue} {currentUnits.find(u => u.symbol === toUnitSymbol)?.name}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
