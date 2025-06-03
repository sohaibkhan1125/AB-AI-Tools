
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input'; // For Popover trigger button styling
import { Cake, CalendarIcon, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAgeDetails, type AgeCalculatorInput, type AgeCalculatorOutput } from '@/ai/flows/age-calculator-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  birthDate: z.date({
    required_error: "A birth date is required.",
    invalid_type_error: "That's not a valid date!",
  }).max(new Date(), { message: "Birth date cannot be in the future." }),
});

type AgeFormValues = z.infer<typeof formSchema>;

export default function AgeCalculatorPage() {
  const [results, setResults] = useState<AgeCalculatorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AgeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: undefined, 
    },
  });

  const onSubmit = async (data: AgeFormValues) => {
    setIsLoading(true);
    setResults(null);
    toast({ title: 'Calculating Age...', description: 'Please wait.' });

    try {
      const backendInput: AgeCalculatorInput = {
        birthDateString: format(data.birthDate, 'yyyy-MM-dd'),
      };
      const ageData = await getAgeDetails(backendInput);
      setResults(ageData);
      toast({ title: 'Age Calculated!', description: 'Your age details are ready.' });
    } catch (error: any) {
      console.error('Age calculation error:', error);
      setResults(null); 
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: error.message || 'Could not calculate age. Please check the birth date.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Cake className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Age Calculator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Enter your birth date to find out your exact age.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CalendarIcon className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Calculating...' : 'Calculate Age'}
              </Button>
            </form>
          </Form>

          {results && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-2xl font-semibold text-center mb-6 font-headline">Your Age Is</h3>
              <Card className="bg-muted/20 p-6 text-center shadow-inner">
                <p className="text-4xl font-bold text-primary mb-2">{results.summary}</p>
                <p className="text-sm text-muted-foreground">
                  From {results.birthDateFormatted} to {results.todayFormatted}
                </p>
                 <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <div className="p-2 bg-background/50 rounded">
                        <div className="font-semibold">{results.years}</div>
                        <div>Year{results.years !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="p-2 bg-background/50 rounded">
                        <div className="font-semibold">{results.months}</div>
                        <div>Month{results.months !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="p-2 bg-background/50 rounded">
                        <div className="font-semibold">{results.days}</div>
                        <div>Day{results.days !== 1 ? 's' : ''}</div>
                    </div>
                 </div>
              </Card>
            </div>
          )}
          
          {!results && !isLoading && (
            <Alert variant="default" className="mt-8">
              <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
              <AlertTitle className="font-semibold">How it works</AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground">
                Select your date of birth using the calendar above and click "Calculate Age". The tool will show your age in years, months, and days.
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center block">
          Calculations are based on the current date.
        </CardFooter>
      </Card>
    </div>
  );
}
