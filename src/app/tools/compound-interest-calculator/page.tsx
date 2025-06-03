
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Landmark, Loader2, CalculatorIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateCompoundInterest, type CompoundInterestInput, type CompoundInterestOutput, type CompoundingFrequency } from '@/ai/flows/compound-interest-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const formSchema = z.object({
  principalAmount: z.coerce.number().positive({ message: 'Principal amount must be positive.' }),
  annualInterestRate: z.coerce.number().min(0, "Rate can't be negative.").max(100, 'Rate seems too high (max 100%).'),
  investmentTermYears: z.coerce.number().int().positive({ message: 'Term must be a positive number of years.' }).max(100, 'Term seems too long (max 100 years).'),
  compoundingFrequency: z.enum(['annually', 'semi_annually', 'quarterly', 'monthly', 'daily'], {
    required_error: "Compounding frequency is required."
  }),
  annualContribution: z.coerce.number().min(0, "Contribution can't be negative.").optional(),
});

type InterestFormValues = z.infer<typeof formSchema>;

const compoundingFrequencyOptions: { label: string, value: CompoundingFrequency }[] = [
    { label: 'Annually', value: 'annually' },
    { label: 'Semi-Annually', value: 'semi_annually' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Daily', value: 'daily' },
];


export default function CompoundInterestCalculatorPage() {
  const [results, setResults] = useState<CompoundInterestOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<InterestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principalAmount: 1000,
      annualInterestRate: 5,
      investmentTermYears: 10,
      compoundingFrequency: 'annually',
      annualContribution: 0,
    },
  });

  const onSubmit = async (data: InterestFormValues) => {
    setIsLoading(true);
    setResults(null);
    toast({ title: 'Calculating...', description: 'Crunching the numbers for your investment.' });

    try {
      const backendInput: CompoundInterestInput = {
        ...data,
        annualContribution: data.annualContribution || 0, // Ensure it's a number
        compoundingFrequency: data.compoundingFrequency as CompoundingFrequency,
      };
      const interestData = await calculateCompoundInterest(backendInput);
      setResults(interestData);
      toast({ title: 'Calculation Complete!', description: 'Compound interest details are ready.' });
    } catch (error: any) {
      console.error('Compound interest calculation error:', error);
      setResults(null);
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: error.message || 'Could not calculate compound interest. Please check inputs.',
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
            <Landmark className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Compound Interest Calculator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Estimate the future value of your investment with compounding interest and optional contributions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="principalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Principal Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1000" {...field} />
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="investmentTermYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Term (Years)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="compoundingFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compounding Frequency</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {compoundingFrequencyOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="annualContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Annual Contribution ($) (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
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
              <h3 className="text-2xl font-semibold text-center mb-6 font-headline">Investment Projection</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Future Value</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">{formatCurrency(results.futureValue)}</CardDescription>
                </Card>
                <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Principal Invested</CardTitle>
                  <CardDescription className="text-2xl font-bold">{formatCurrency(results.totalPrincipalInvested)}</CardDescription>
                </Card>
                <Card className="p-4 shadow bg-muted/20">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Interest Earned</CardTitle>
                  <CardDescription className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(results.totalInterestEarned)}</CardDescription>
                </Card>
              </div>

              {results.annualBreakdown && results.annualBreakdown.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-center">Annual Breakdown</h4>
                  <div className="max-h-[400px] overflow-y-auto border rounded-md">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card/95 backdrop-blur-sm">
                        <TableRow>
                          <TableHead className="text-center">Year</TableHead>
                          <TableHead className="text-right">Starting Balance</TableHead>
                          <TableHead className="text-right">Contribution</TableHead>
                          <TableHead className="text-right">Interest Earned</TableHead>
                          <TableHead className="text-right">Ending Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.annualBreakdown.map((entry) => (
                          <TableRow key={entry.year}>
                            <TableCell className="text-center">{entry.year}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.startingBalance)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.contributionThisYear)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.interestEarnedThisYear)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(entry.endingBalance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                       <TableCaption className="sticky bottom-0 bg-card/95 backdrop-blur-sm py-2">End of investment term.</TableCaption>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
            {!results && !isLoading && (
            <Alert variant="default" className="mt-8">
                <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
                <AlertTitle className="font-semibold">How it works</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                  Enter your initial investment (principal), the annual interest rate, how long you plan to invest, how often the interest is compounded, and any additional amount you plan to contribute annually. The calculator will project the growth of your investment.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center block">
          Projections are estimates. Actual returns may vary. Does not account for taxes or fees.
        </CardFooter>
      </Card>
    </div>
  );
}
