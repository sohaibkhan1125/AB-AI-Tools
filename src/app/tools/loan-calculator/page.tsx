
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { CircleDollarSign, Loader2, CalculatorIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateLoanDetails, type LoanCalculatorInput, type LoanCalculatorOutput } from '@/ai/flows/loan-calculator-flow';

const formSchema = z.object({
  loanAmount: z.coerce.number().positive({ message: 'Loan amount must be a positive number.' }),
  annualInterestRate: z.coerce.number().positive({ message: 'Interest rate must be a positive number.' }).max(100, {message: "Rate seems too high (max 100%)"}),
  loanTermYears: z.coerce.number().int().positive({ message: 'Loan term must be a positive whole number of years.' }).max(50, {message: "Term seems too long (max 50 years)"}),
});

type LoanFormValues = z.infer<typeof formSchema>;

export default function LoanCalculatorPage() {
  const [results, setResults] = useState<LoanCalculatorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: 10000,
      annualInterestRate: 5,
      loanTermYears: 5,
    },
  });

  const onSubmit = async (data: LoanFormValues) => {
    setIsLoading(true);
    setResults(null);
    toast({ title: 'Calculating...', description: 'Please wait while we crunch the numbers.' });

    try {
      const backendInput: LoanCalculatorInput = {
        loanAmount: data.loanAmount,
        annualInterestRate: data.annualInterestRate,
        loanTermYears: data.loanTermYears,
      };
      const loanData = await calculateLoanDetails(backendInput);
      setResults(loanData);
      toast({ title: 'Calculation Complete!', description: 'Loan details are ready.' });
    } catch (error: any) {
      console.error('Loan calculation error:', error);
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: error.message || 'Could not calculate loan details. Please check your inputs.',
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
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <CircleDollarSign className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Loan Calculator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Estimate your monthly loan payments, total interest, and see an amortization schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="annualInterestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loanTermYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Term (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5" {...field} />
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
                {isLoading ? 'Calculating...' : 'Calculate Loan'}
              </Button>
            </form>
          </Form>

          {results && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-2xl font-semibold text-center mb-6 font-headline">Calculation Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                <Card className="p-4 shadow">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payment</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">{formatCurrency(results.monthlyPayment)}</CardDescription>
                </Card>
                <Card className="p-4 shadow">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Payment</CardTitle>
                  <CardDescription className="text-2xl font-bold">{formatCurrency(results.totalPayment)}</CardDescription>
                </Card>
                <Card className="p-4 shadow">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Interest</CardTitle>
                  <CardDescription className="text-2xl font-bold text-destructive">{formatCurrency(results.totalInterest)}</CardDescription>
                </Card>
              </div>

              {results.amortizationSchedule && results.amortizationSchedule.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-center">Amortization Schedule</h4>
                  <div className="max-h-[400px] overflow-y-auto border rounded-md">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card/95 backdrop-blur-sm">
                        <TableRow>
                          <TableHead className="text-center">Month</TableHead>
                          <TableHead className="text-right">Principal</TableHead>
                          <TableHead className="text-right">Interest</TableHead>
                          <TableHead className="text-right">Remaining Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.amortizationSchedule.map((entry) => (
                          <TableRow key={entry.month}>
                            <TableCell className="text-center">{entry.month}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.principalPayment)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.interestPayment)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.remainingBalance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                       <TableCaption className="sticky bottom-0 bg-card/95 backdrop-blur-sm py-2">End of amortization schedule.</TableCaption>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center block">
          Calculations are estimates. Consult a financial advisor for precise figures.
        </CardFooter>
      </Card>
    </div>
  );
}
