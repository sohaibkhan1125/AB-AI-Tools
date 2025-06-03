
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TrendingUp, CalculatorIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  initialInvestment: z.coerce.number().positive({ message: 'Initial investment must be a positive number.' }),
  finalValue: z.coerce.number().nonnegative({ message: 'Final value must be a non-negative number.' }),
});

type RoiFormValues = z.infer<typeof formSchema>;

interface RoiResults {
  netProfit: number;
  roiPercentage: number;
}

export default function InvestmentRoiCalculatorPage() {
  const [results, setResults] = useState<RoiResults | null>(null);
  const { toast } = useToast();

  const form = useForm<RoiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialInvestment: undefined,
      finalValue: undefined,
    },
  });

  const onSubmit = (data: RoiFormValues) => {
    const { initialInvestment, finalValue } = data;

    if (initialInvestment === 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Initial investment cannot be zero.',
      });
      setResults(null);
      return;
    }

    const netProfit = finalValue - initialInvestment;
    const roiPercentage = (netProfit / initialInvestment) * 100;

    setResults({
      netProfit,
      roiPercentage,
    });

    toast({
      title: 'ROI Calculated!',
      description: 'Your investment return details are ready.',
    });
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return '-';
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <TrendingUp className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Investment ROI Calculator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Calculate the Return on Investment for your ventures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="initialInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Investment Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="finalValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final Value of Investment ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 1200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <CalculatorIcon className="mr-2 h-5 w-5" />
                Calculate ROI
              </Button>
            </form>
          </Form>

          {results && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-2xl font-semibold text-center mb-6 font-headline">Calculation Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-center">
                <Card className={`p-4 shadow ${results.netProfit >= 0 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'}`}>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit / Loss</CardTitle>
                  <CardDescription className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(results.netProfit)}
                  </CardDescription>
                </Card>
                <Card className={`p-4 shadow ${results.roiPercentage >= 0 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'}`}>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Return on Investment (ROI)</CardTitle>
                  <CardDescription className={`text-2xl font-bold ${results.roiPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercentage(results.roiPercentage)}
                  </CardDescription>
                </Card>
              </div>
            </div>
          )}

          {!results && (
             <Alert variant="default" className="mt-8">
                <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
                <AlertTitle className="font-semibold">How it works</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                  Enter your initial investment and the final value of that investment. The calculator will show your net profit (or loss) and the ROI percentage.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center block">
          ROI = (Net Profit / Initial Investment) * 100. Taxes and other fees are not considered.
        </CardFooter>
      </Card>
    </div>
  );
}
