
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  hourlyRate: z.string().optional(),
  hoursPerWeek: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 168, { message: "Must be > 0 and <= 168" }),
  weeksPerYear: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 52, { message: "Must be > 0 and <= 52" }),
  annualSalary: z.string().optional(),
}).refine(data => data.hourlyRate || data.annualSalary, {
  message: "Either Hourly Rate or Annual Salary must be provided.",
  path: ["hourlyRate"], // You can point to one or both fields
}).refine(data => {
  if (data.hourlyRate && isNaN(parseFloat(data.hourlyRate))) return false;
  if (data.annualSalary && isNaN(parseFloat(data.annualSalary))) return false;
  if (data.hourlyRate && parseFloat(data.hourlyRate) < 0) return false;
  if (data.annualSalary && parseFloat(data.annualSalary) < 0) return false;
  return true;
}, {
  message: "Rates and salary must be valid positive numbers if provided.",
  path: ["hourlyRate"],
});


type SalaryFormValues = z.infer<typeof formSchema>;

export default function SalaryConverterPage() {
  const [lastChanged, setLastChanged] = useState<'hourly' | 'annual' | null>(null);
  const { toast } = useToast();

  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hourlyRate: '',
      hoursPerWeek: '40',
      weeksPerYear: '52',
      annualSalary: '',
    },
    mode: 'onChange',
  });

  const { watch, setValue, trigger } = form;
  const watchedValues = watch();

  const calculateAnnualSalary = useCallback(() => {
    const hourlyRate = parseFloat(watchedValues.hourlyRate || '0');
    const hoursPerWeek = parseFloat(watchedValues.hoursPerWeek || '0');
    const weeksPerYear = parseFloat(watchedValues.weeksPerYear || '0');

    if (!isNaN(hourlyRate) && !isNaN(hoursPerWeek) && !isNaN(weeksPerYear) && hoursPerWeek > 0 && weeksPerYear > 0) {
      const newAnnualSalary = hourlyRate * hoursPerWeek * weeksPerYear;
      setValue('annualSalary', newAnnualSalary.toFixed(2), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }
  }, [watchedValues.hourlyRate, watchedValues.hoursPerWeek, watchedValues.weeksPerYear, setValue]);

  const calculateHourlyRate = useCallback(() => {
    const annualSalary = parseFloat(watchedValues.annualSalary || '0');
    const hoursPerWeek = parseFloat(watchedValues.hoursPerWeek || '0');
    const weeksPerYear = parseFloat(watchedValues.weeksPerYear || '0');

    if (!isNaN(annualSalary) && !isNaN(hoursPerWeek) && !isNaN(weeksPerYear) && hoursPerWeek > 0 && weeksPerYear > 0) {
      const newHourlyRate = annualSalary / (hoursPerWeek * weeksPerYear);
      setValue('hourlyRate', newHourlyRate.toFixed(2), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }
  }, [watchedValues.annualSalary, watchedValues.hoursPerWeek, watchedValues.weeksPerYear, setValue]);
  

  useEffect(() => {
    if (lastChanged === 'hourly') {
      calculateAnnualSalary();
    }
  }, [watchedValues.hourlyRate, watchedValues.hoursPerWeek, watchedValues.weeksPerYear, lastChanged, calculateAnnualSalary]);
  
  useEffect(() => {
    if (lastChanged === 'annual') {
      calculateHourlyRate();
    }
  }, [watchedValues.annualSalary, watchedValues.hoursPerWeek, watchedValues.weeksPerYear, lastChanged, calculateHourlyRate]);


  const handleHourlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('hourlyRate', e.target.value);
    setLastChanged('hourly');
    trigger('hourlyRate'); // Manually trigger validation if needed earlier
  };
  
  const handleAnnualSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('annualSalary', e.target.value);
    setLastChanged('annual');
    trigger('annualSalary'); // Manually trigger validation if needed earlier
  };

  const onSubmit = (data: SalaryFormValues) => {
    // This function is mainly here to satisfy react-hook-form's onSubmit requirement.
    // Calculations are done live via useEffect.
    // We can add a toast or some confirmation if needed, but not strictly necessary for a live calculator.
    toast({
      title: 'Values Updated',
      description: 'Salary figures have been recalculated based on your input.',
    });
  };

  const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === '' || isNaN(Number(value))) return '';
    return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <DollarSign className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Salary Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Convert between hourly and annual salaries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 25.00"
                        {...field}
                        onChange={handleHourlyRateChange}
                        onFocus={() => setLastChanged('hourly')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hoursPerWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours per Week</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="e.g., 40"
                          {...field}
                          onChange={(e) => {field.onChange(e); if(lastChanged === 'hourly') calculateAnnualSalary(); else if (lastChanged === 'annual') calculateHourlyRate();}}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weeksPerYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weeks per Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          placeholder="e.g., 52"
                          {...field}
                          onChange={(e) => {field.onChange(e); if(lastChanged === 'hourly') calculateAnnualSalary(); else if (lastChanged === 'annual') calculateHourlyRate();}}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="annualSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Salary ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 52000.00"
                        {...field}
                        onChange={handleAnnualSalaryChange}
                        onFocus={() => setLastChanged('annual')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Submit button is optional as updates are live */}
              {/* <Button type="submit" className="w-full">Recalculate (if needed)</Button> */}
            </form>
          </Form>
          
          <Alert variant="default" className="mt-8">
              <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
              <AlertTitle className="font-semibold">How it works</AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground">
                Enter values in any field. The corresponding hourly rate or annual salary will be calculated automatically. You can also adjust hours per week and weeks per year.
              </AlertDescription>
          </Alert>

        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center block">
          Calculations update as you type. Assumes standard work patterns.
        </CardFooter>
      </Card>
    </div>
  );
}

