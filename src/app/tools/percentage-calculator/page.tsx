
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PercentageCalculatorPage() {
  const { toast } = useToast();

  // State for "X% of Y"
  const [percentOfX, setPercentOfX] = useState<string>('');
  const [percentOfY, setPercentOfY] = useState<string>('');
  const percentOfResult = useMemo(() => {
    const x = parseFloat(percentOfX);
    const y = parseFloat(percentOfY);
    if (isNaN(x) || isNaN(y)) return '';
    return ((x / 100) * y).toLocaleString(undefined, {maximumFractionDigits: 5});
  }, [percentOfX, percentOfY]);

  // State for "X is what % of Y"
  const [isWhatX, setIsWhatX] = useState<string>('');
  const [isWhatY, setIsWhatY] = useState<string>('');
  const isWhatResult = useMemo(() => {
    const x = parseFloat(isWhatX);
    const y = parseFloat(isWhatY);
    if (isNaN(x) || isNaN(y) || y === 0) return '';
    return ((x / y) * 100).toLocaleString(undefined, {maximumFractionDigits: 2}) + '%';
  }, [isWhatX, isWhatY]);

  // State for "Percentage Change"
  const [changeInitial, setChangeInitial] = useState<string>('');
  const [changeFinal, setChangeFinal] = useState<string>('');
  const changeResult = useMemo(() => {
    const initial = parseFloat(changeInitial);
    const final = parseFloat(changeFinal);
    if (isNaN(initial) || isNaN(final) || initial === 0) return '';
    const change = ((final - initial) / initial) * 100;
    const prefix = change >= 0 ? 'Increase: +' : 'Decrease: ';
    return prefix + Math.abs(change).toLocaleString(undefined, {maximumFractionDigits: 2}) + '%';
  }, [changeInitial, changeFinal]);

  const handleInputChange = (
    value: string, 
    setter: React.Dispatch<React.SetStateAction<string>>,
    fieldName: string
  ) => {
    if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
      setter(value);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: `Please enter a valid number for ${fieldName}.`,
      });
    }
  };


  const ResultDisplay: React.FC<{label: string; value: string}> = ({ label, value }) => (
    <div className="mt-4 p-4 bg-muted/30 rounded-md text-center">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <p className="text-2xl font-bold text-primary">{value || '-'}</p>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Percent className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Percentage Calculator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Perform various percentage calculations with ease.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="percentOf" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="percentOf">X% of Y</TabsTrigger>
              <TabsTrigger value="isWhatPercent">X is ?% of Y</TabsTrigger>
              <TabsTrigger value="percentChange">% Change</TabsTrigger>
            </TabsList>

            <TabsContent value="percentOf">
              <Card className="border-none p-0 shadow-none">
                <CardHeader className="p-1 pb-2">
                  <CardTitle className="text-xl">Calculate Percentage of a Number</CardTitle>
                  <CardDescription>Find what X% of Y is.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-1">
                  <div>
                    <Label htmlFor="percentOfX">Percentage (X%)</Label>
                    <Input
                      id="percentOfX"
                      type="text"
                      value={percentOfX}
                      onChange={(e) => handleInputChange(e.target.value, setPercentOfX, 'Percentage (X%)')}
                      placeholder="e.g., 20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="percentOfY">Total Value (Y)</Label>
                    <Input
                      id="percentOfY"
                      type="text"
                      value={percentOfY}
                      onChange={(e) => handleInputChange(e.target.value, setPercentOfY, 'Total Value (Y)')}
                      placeholder="e.g., 150"
                    />
                  </div>
                  {percentOfResult && <ResultDisplay label="Result (X% of Y)" value={percentOfResult} />}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="isWhatPercent">
              <Card className="border-none p-0 shadow-none">
                <CardHeader className="p-1 pb-2">
                  <CardTitle className="text-xl">X is What Percentage of Y</CardTitle>
                  <CardDescription>Find what percentage value X is of value Y.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-1">
                  <div>
                    <Label htmlFor="isWhatX">Part Value (X)</Label>
                    <Input
                      id="isWhatX"
                      type="text"
                      value={isWhatX}
                       onChange={(e) => handleInputChange(e.target.value, setIsWhatX, 'Part Value (X)')}
                      placeholder="e.g., 30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="isWhatY">Total Value (Y)</Label>
                    <Input
                      id="isWhatY"
                      type="text"
                      value={isWhatY}
                       onChange={(e) => handleInputChange(e.target.value, setIsWhatY, 'Total Value (Y)')}
                      placeholder="e.g., 150"
                    />
                  </div>
                  {isWhatResult && <ResultDisplay label="Result (X is what % of Y)" value={isWhatResult} />}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="percentChange">
              <Card className="border-none p-0 shadow-none">
                 <CardHeader className="p-1 pb-2">
                  <CardTitle className="text-xl">Percentage Increase/Decrease</CardTitle>
                  <CardDescription>Calculate the percentage change from an initial value to a final value.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-1">
                  <div>
                    <Label htmlFor="changeInitial">Initial Value</Label>
                    <Input
                      id="changeInitial"
                      type="text"
                      value={changeInitial}
                       onChange={(e) => handleInputChange(e.target.value, setChangeInitial, 'Initial Value')}
                      placeholder="e.g., 100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="changeFinal">Final Value</Label>
                    <Input
                      id="changeFinal"
                      type="text"
                      value={changeFinal}
                      onChange={(e) => handleInputChange(e.target.value, setChangeFinal, 'Final Value')}
                      placeholder="e.g., 120"
                    />
                  </div>
                  {changeResult && <ResultDisplay label="Percentage Change" value={changeResult} />}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
