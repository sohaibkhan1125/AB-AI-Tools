'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LineChart, Loader2, CalculatorIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateSimpleInterest, type SimpleInterestInput, type SimpleInterestOutput } from '@/ai/flows/simple-interest-calculator-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  principal: z.coerce.number().positive({ message: 'Principal must be a positive number.' }),
  rate: z.coerce.number().min(0, 'Interest rate cannot be negative.').max(100, 'Rate seems too high (max 100%).'),
  timeYears: z.coerce.number().positive({ message: 'Time must be a positive number of years.' }),
});

type SimpleInterestFormValues = z.infer<typeof formSchema>;

export default function SimpleInterestCalculatorPage() {
  const [results, setResults] = useState<SimpleInterestOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SimpleInterestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: undefined,
      rate: undefined,
      timeYears: undefined,
    },
  });

  const onSubmit = async (data: SimpleInterestFormValues) => {
    setIsLoading(true);
    setResults(null);
    toast({ title: 'Calculating...', description: 'Crunching the numbers for simple interest.' });

    try {
      const backendInput: SimpleInterestInput = {
        principal: data.principal,
        rate: data.rate,
        timeYears: data.timeYears,
      };
      const interestData = await calculateSimpleInterest(backendInput);
      setResults(interestData);
      toast({ title: 'Calculation Complete!', description: 'Simple interest details are ready.' });
    } catch (error: any) {
      console.error('Simple interest calculation error:', error);
      setResults(null);
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: error.message || 'Could not calculate simple interest. Please check inputs.',
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
            <LineChart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Simple Interest Calculator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Calculate the simple interest earned and total amount.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="principal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 1000" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 5" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Period (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="e.g., 3" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))} />
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
                {isLoading ? 'Calculating...' : 'Calculate Interest'}
              </Button>
            </form>
          </Form>

          {results && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-2xl font-semibold text-center mb-6 font-headline">Calculation Results</h3>
              <div className="space-y-3">
                 <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Principal Amount</CardTitle>
                  <CardDescription className="text-xl font-bold">{formatCurrency(results.principal)}</CardDescription>
                </Card>
                <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Interest Rate (Annual)</CardTitle>
                  <CardDescription className="text-xl font-bold">{results.rate}%</CardDescription>
                </Card>
                <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Time Period</CardTitle>
                  <CardDescription className="text-xl font-bold">{results.timeYears} Year(s)</CardDescription>
                </Card>
                <Card className="p-4 shadow bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Interest Earned</CardTitle>
                  <CardDescription className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(results.interestEarned)}</CardDescription>
                </Card>
                <Card className="p-4 shadow bg-primary/10">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount (Principal + Interest)</CardTitle>
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
                  Enter the principal amount, the annual interest rate (e.g., 5 for 5%), and the time period in years. The calculator will determine the simple interest earned and the total future amount.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center block">
          Formula: Interest = (Principal × Rate × Time) / 100.
        </CardFooter>
      </Card>
    </div>
  );
}
