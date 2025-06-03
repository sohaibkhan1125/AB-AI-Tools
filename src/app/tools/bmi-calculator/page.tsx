
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, Loader2, CalculatorIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getBmiDetails, type BmiInput, type BmiOutput } from '@/ai/flows/bmi-calculator-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  weight: z.string().min(1, "Weight is required.").refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Weight must be a positive number."}),
  weightUnit: z.enum(['kg', 'lb']),
  heightSystem: z.enum(['metric', 'imperial']),
  heightCm: z.string().optional(),
  heightFt: z.string().optional(),
  heightIn: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.heightSystem === 'metric') {
    if (!data.heightCm || isNaN(parseFloat(data.heightCm)) || parseFloat(data.heightCm) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Height in cm must be a positive number.",
        path: ['heightCm'],
      });
    }
  } else { // imperial
    if (!data.heightFt || isNaN(parseFloat(data.heightFt)) || parseFloat(data.heightFt) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Feet must be a positive number.",
        path: ['heightFt'],
      });
    }
     // Inches can be 0, but not negative or >= 12. Optional if not entered, but validated if system is imperial.
    if (data.heightIn === undefined || data.heightIn === '' || isNaN(parseFloat(data.heightIn)) || parseFloat(data.heightIn) < 0 || parseFloat(data.heightIn) >= 12) {
        if (data.heightIn !== '' && data.heightIn !== undefined ) { // Only add error if it's not empty and invalid
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Inches must be a number between 0 and 11.99.",
                path: ['heightIn'],
            });
        } else if (data.heightIn === undefined || data.heightIn === '') {
            // If imperial is chosen and inches is empty, treat as 0. Or make it required. For now, let's make it "required" by forcing a 0-11.99 range.
            // If we want inches to be optional and default to 0 if empty, validation should be different or handled in onSubmit
        }
    }
  }
});

type BmiFormValues = z.infer<typeof formSchema>;

export default function BmiCalculatorPage() {
  const [results, setResults] = useState<BmiOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<BmiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: '',
      weightUnit: 'kg',
      heightSystem: 'metric',
      heightCm: '',
      heightFt: '',
      heightIn: '',
    },
  });

  const heightSystem = form.watch('heightSystem');

  const onSubmit = async (data: BmiFormValues) => {
    setIsLoading(true);
    setResults(null);
    toast({ title: 'Calculating BMI...', description: 'Please wait.' });

    let weightKg: number;
    if (data.weightUnit === 'lb') {
      weightKg = parseFloat(data.weight) * 0.453592;
    } else {
      weightKg = parseFloat(data.weight);
    }

    let heightCm: number;
    if (data.heightSystem === 'metric') {
      heightCm = parseFloat(data.heightCm!);
    } else {
      const feet = parseFloat(data.heightFt!);
      const inches = parseFloat(data.heightIn || '0'); // Default to 0 inches if empty
      heightCm = (feet * 12 + inches) * 2.54;
    }

    if (isNaN(weightKg) || isNaN(heightCm) || weightKg <=0 || heightCm <=0) {
        toast({ variant: 'destructive', title: 'Invalid Input', description: 'Please ensure weight and height are valid positive numbers.' });
        setIsLoading(false);
        return;
    }


    try {
      const backendInput: BmiInput = { weightKg, heightCm };
      const bmiData = await getBmiDetails(backendInput);
      setResults(bmiData);
      toast({ title: 'BMI Calculated!', description: 'Your BMI details are ready.' });
    } catch (error: any) {
      console.error('BMI calculation error:', error);
      setResults(null); 
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: error.message || 'Could not calculate BMI. Please check your inputs.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getCategoryBadgeVariant = (category?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (category) {
      case 'Underweight': return 'outline';
      case 'Normal weight': return 'default';
      case 'Overweight': return 'secondary';
      case 'Obese': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <HeartPulse className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">BMI Calculator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Enter your weight and height to calculate your Body Mass Index.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Weight Input */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <div className="flex gap-2">
                       <FormControl>
                        <Input type="number" placeholder="e.g., 70" {...field} className="flex-grow" />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name="weightUnit"
                        render={({ field: unitField }) => (
                          <RadioGroup
                            onValueChange={unitField.onChange}
                            defaultValue={unitField.value}
                            className="flex items-center"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="kg" id="kg" />
                              </FormControl>
                              <FormLabel htmlFor="kg" className="font-normal">kg</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="lb" id="lb" />
                              </FormControl>
                              <FormLabel htmlFor="lb" className="font-normal">lb</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Height Input System */}
              <FormField
                control={form.control}
                name="heightSystem"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Height Unit System</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="metric" id="metric" />
                          </FormControl>
                          <FormLabel htmlFor="metric" className="font-normal">Metric (cm)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="imperial" id="imperial" />
                          </FormControl>
                          <FormLabel htmlFor="imperial" className="font-normal">Imperial (ft, in)</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Conditional Height Inputs */}
              {heightSystem === 'metric' && (
                <FormField
                  control={form.control}
                  name="heightCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 175" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {heightSystem === 'imperial' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="heightFt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (ft)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heightIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (in)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CalculatorIcon className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Calculating...' : 'Calculate BMI'}
              </Button>
            </form>
          </Form>

          {results && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-2xl font-semibold text-center mb-4 font-headline">Your BMI Result</h3>
              <Card className="bg-muted/20 p-6 text-center shadow-inner">
                 <p className="text-5xl font-bold text-primary mb-2">{results.bmi}</p>
                 <Badge variant={getCategoryBadgeVariant(results.category)} className="text-lg px-3 py-1">
                    {results.category}
                 </Badge>
                 <p className="text-xs text-muted-foreground mt-3">
                    Calculated with weight: {results.weightKg.toFixed(1)} kg and height: {results.heightCm.toFixed(1)} cm.
                 </p>
              </Card>
               <Alert variant="default" className="mt-6">
                <HeartPulse className="h-4 w-4 !text-primary" />
                <AlertTitle className="font-semibold text-primary">BMI Categories (WHO Standard)</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                  <ul className="list-disc list-inside pl-2 space-y-1 mt-1">
                    <li>Underweight: &lt; 18.5</li>
                    <li>Normal weight: 18.5 – 24.9</li>
                    <li>Overweight: 25 – 29.9</li>
                    <li>Obese: ≥ 30</li>
                  </ul>
                   This calculator provides an estimate. Consult a healthcare professional for health advice.
                </AlertDescription>
              </Alert>
            </div>
          )}
           {!results && !isLoading && (
            <Alert variant="default" className="mt-8">
                <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
                <AlertTitle className="font-semibold">How it works</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                  Enter your weight and height using your preferred units. The tool will convert them to metric (if needed) and calculate your BMI. The result will show your BMI value and the corresponding health category.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center block">
          BMI is a general indicator and may not apply to all individuals (e.g., athletes).
        </CardFooter>
      </Card>
    </div>
  );
}
