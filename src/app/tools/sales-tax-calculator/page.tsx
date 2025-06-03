'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Receipt, Loader2, CalculatorIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateSalesTax, type SalesTaxInput, type SalesTaxOutput } from '@/ai/flows/sales-tax-calculator-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number.' }),
  taxRate: z.coerce.number().min(0, 'Tax rate cannot be negative.').max(100, 'Tax rate seems too high (max 100%).'),
});

type SalesTaxFormValues = z.infer<typeof formSchema>;

export default function SalesTaxCalculatorPage() {
  const [results, setResults] = useState<SalesTaxOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SalesTaxFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined, // Will be treated as empty string by input initially
      taxRate: undefined,
    },
  });

  const onSubmit = async (data: SalesTaxFormValues) => {
    setIsLoading(true);
    setResults(null);
    toast({ title: 'Calculating...', description: 'Computing sales tax details.' });

    try {
      const backendInput: SalesTaxInput = {
        amount: data.amount,
        taxRate: data.taxRate,
      };
      const taxData = await calculateSalesTax(backendInput);
      setResults(taxData);
      toast({ title: 'Calculation Complete!', description: 'Sales tax details are ready.' });
    } catch (error: any) {
      console.error('Sales tax calculation error:', error);
      setResults(null);
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: error.message || 'Could not calculate sales tax. Please check inputs.',
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
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Receipt className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Sales Tax Calculator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Calculate the sales tax and total price of an item.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 100.00" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sales Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 7.5" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))} />
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
                {isLoading ? 'Calculating...' : 'Calculate Tax'}
              </Button>
            </form>
          </Form>

          {results && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-2xl font-semibold text-center mb-6 font-headline">Calculation Results</h3>
              <div className="space-y-3">
                <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Original Amount</CardTitle>
                  <CardDescription className="text-xl font-bold">{formatCurrency(results.originalAmount)}</CardDescription>
                </Card>
                <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tax Rate Applied</CardTitle>
                  <CardDescription className="text-xl font-bold">{results.taxRateApplied}%</CardDescription>
                </Card>
                 <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Sales Tax Amount</CardTitle>
                  <CardDescription className="text-xl font-bold text-destructive">{formatCurrency(results.taxAmount)}</CardDescription>
                </Card>
                <Card className="p-4 shadow bg-primary/10">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount (incl. Tax)</CardTitle>
                  <CardDescription className="text-xl font-bold text-primary">{formatCurrency(results.totalAmount)}</CardDescription>
                </Card>
              </div>
            </div>
          )}
           {!results && !isLoading && (
            <Alert variant="default" className="mt-8">
                <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
                <AlertTitle className="font-semibold">How it works</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                  Enter the original amount of the item/service and the applicable sales tax rate (e.g., enter 7.5 for 7.5%). The calculator will show the tax amount and the total price.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center block">
          This calculator provides a simple sales tax estimation.
        </CardFooter>
      </Card>
    </div>
  );
}
