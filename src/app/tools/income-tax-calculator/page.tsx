
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { FileText as FileTextIcon, Loader2, CalculatorIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateIncomeTax, type IncomeTaxInput, type IncomeTaxOutput } from '@/ai/flows/income-tax-calculator-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  income: z.coerce.number().nonnegative({ message: 'Income cannot be negative.' }),
});

type IncomeTaxFormValues = z.infer<typeof formSchema>;

export default function IncomeTaxCalculatorPage() {
  const [results, setResults] = useState<IncomeTaxOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<IncomeTaxFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: '' as unknown as number,
    },
  });

  const onSubmit = async (data: IncomeTaxFormValues) => {
    setIsLoading(true);
    setResults(null);
    toast({ title: 'Calculating...', description: 'Estimating your income tax.' });

    try {
      const backendInput: IncomeTaxInput = { income: data.income };
      const taxData = await calculateIncomeTax(backendInput);
      setResults(taxData);
      toast({ title: 'Calculation Complete!', description: 'Income tax estimation is ready.' });
    } catch (error: any) {
      console.error('Income tax calculation error:', error);
      setResults(null);
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: error.message || 'Could not estimate income tax. Please check input.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <FileTextIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Simple Income Tax Calculator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Estimate your income tax based on a simplified progressive tax bracket system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Taxable Annual Income ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 60000" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CalculatorIcon className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Calculating...' : 'Calculate Income Tax'}
              </Button>
            </form>
          </Form>

          {results && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-2xl font-semibold text-center mb-6 font-headline">Tax Estimation Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-center">
                <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Estimated Tax</CardTitle>
                  <CardDescription className="text-2xl font-bold text-destructive">{formatCurrency(results.totalTax)}</CardDescription>
                </Card>
                <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Effective Tax Rate</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">{results.effectiveTaxRate}%</CardDescription>
                </Card>
              </div>

              {results.taxBreakdown && results.taxBreakdown.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-center">Tax Bracket Breakdown</h4>
                  <div className="max-h-[300px] overflow-y-auto border rounded-md">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card/95 backdrop-blur-sm">
                        <TableRow>
                          <TableHead>Bracket</TableHead>
                          <TableHead className="text-right">Rate</TableHead>
                          <TableHead className="text-right">Taxable</TableHead>
                          <TableHead className="text-right">Tax Paid</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.taxBreakdown.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell>{entry.bracketDescription}</TableCell>
                            <TableCell className="text-right">{entry.rate.toFixed(2)}%</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.taxableInBracket)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.taxPaidInBracket)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                       <TableCaption className="sticky bottom-0 bg-card/95 backdrop-blur-sm py-2">Tax calculation breakdown by bracket.</TableCaption>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
          <Alert variant="default" className="mt-8">
            <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
            <AlertTitle className="font-semibold">Disclaimer</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              This is a simplified calculator using a basic progressive tax model:
              10% on income up to $10,000;
              15% on income between $10,001 and $50,000;
              25% on income above $50,000.
              It does NOT account for deductions, credits, or specific regional tax laws. For accurate tax planning, consult a financial advisor or official tax resources.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center block">
          For illustrative purposes only.
        </CardFooter>
      </Card>
    </div>
  );
}
