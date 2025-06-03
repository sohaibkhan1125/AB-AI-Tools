
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, SwitchHorizontal, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BASE_OPTIONS = [
  { label: 'Binary (Base 2)', value: '2' },
  { label: 'Octal (Base 8)', value: '8' },
  { label: 'Decimal (Base 10)', value: '10' },
  { label: 'Hexadecimal (Base 16)', value: '16' },
];

export default function NumberSystemConverterPage() {
  const [inputValue, setInputValue] = useState<string>('');
  const [fromBase, setFromBase] = useState<number>(10);
  const [toBase, setToBase] = useState<number>(2);
  const [outputValue, setOutputValue] = useState<string>('');
  const { toast } = useToast();

  const validateInput = useCallback((value: string, base: number): boolean => {
    if (value === '') return true; 
    let regex: RegExp;
    switch (base) {
      case 2: regex = /^[01]+$/; break;
      case 8: regex = /^[0-7]+$/; break;
      case 10: regex = /^[0-9]+$/; break;
      case 16: regex = /^[0-9a-fA-F]+$/i; break;
      default: return false;
    }
    return regex.test(value);
  }, []);

  const convertNumber = useCallback(() => {
    if (!inputValue.trim()) {
      setOutputValue('');
      return;
    }

    if (!validateInput(inputValue, fromBase)) {
      setOutputValue('');
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: `Input "${inputValue}" is not a valid base ${fromBase} number.`,
      });
      return;
    }

    try {
      const decimalValue = parseInt(inputValue, fromBase);
      if (isNaN(decimalValue)) {
        setOutputValue('');
        toast({
          variant: 'destructive',
          title: 'Parsing Error',
          description: `Cannot parse "${inputValue}" as base ${fromBase}. Ensure it's a valid number for this base.`,
        });
        return;
      }

      let result = decimalValue.toString(toBase);
      if (toBase === 16) {
        result = result.toUpperCase();
      }
      setOutputValue(result);

    } catch (e) {
      console.error("Conversion error:", e);
      setOutputValue('');
      toast({
        variant: 'destructive',
        title: 'Conversion Error',
        description: 'An unexpected error occurred during conversion.',
      });
    }
  }, [inputValue, fromBase, toBase, toast, validateInput]);

  useEffect(() => {
    convertNumber();
  }, [inputValue, fromBase, toBase, convertNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSwapBases = () => {
    const currentInput = inputValue;
    const currentOutput = outputValue;

    setFromBase(toBase);
    setToBase(fromBase); // Use the old fromBase for the new toBase

    // If output was valid for the new "from base", use it as input
    if (validateInput(currentOutput, toBase)) { // Validate against the new "from base" which is old "toBase"
        setInputValue(currentOutput);
    } else {
        // If current output is not valid for the new fromBase,
        // try to keep currentInput if it's valid for the new fromBase
        if (!validateInput(currentInput, toBase)) { // Validate against the new "from base" which is old "toBase"
            setInputValue(''); // Clear if current input is also not valid for new fromBase
        }
        // else inputValue remains, and useEffect will re-evaluate
    }

    toast({ title: 'Bases Swapped!' });
  };

  const handleClear = () => {
    setInputValue('');
    setOutputValue('');
    toast({ title: 'Fields Cleared' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Calculator className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Number System Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Convert numbers between Binary, Octal, Decimal, and Hexadecimal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromBaseSelect" className="font-medium">From Base</Label>
              <Select
                value={String(fromBase)}
                onValueChange={(val) => setFromBase(Number(val))}
              >
                <SelectTrigger id="fromBaseSelect" className="mt-1">
                  <SelectValue placeholder="Select base" />
                </SelectTrigger>
                <SelectContent>
                  {BASE_OPTIONS.map(option => (
                    <SelectItem key={`from-${option.value}`} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="toBaseSelect" className="font-medium">To Base</Label>
              <Select
                value={String(toBase)}
                onValueChange={(val) => setToBase(Number(val))}
              >
                <SelectTrigger id="toBaseSelect" className="mt-1">
                  <SelectValue placeholder="Select base" />
                </SelectTrigger>
                <SelectContent>
                  {BASE_OPTIONS.map(option => (
                    <SelectItem key={`to-${option.value}`} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="inputValue" className="font-medium">Input Number</Label>
            <Input
              id="inputValue"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={`Enter base ${fromBase} number`}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center justify-center">
             <Button onClick={handleSwapBases} variant="outline" size="icon" aria-label="Swap bases">
                <SwitchHorizontal className="h-5 w-5" />
             </Button>
          </div>


          <div>
            <Label htmlFor="outputValue" className="font-medium">Converted Number</Label>
            <Input
              id="outputValue"
              value={outputValue}
              readOnly
              placeholder={`Base ${toBase} result`}
              className="mt-1 bg-muted/30"
            />
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button onClick={handleClear} variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Clear Fields
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

