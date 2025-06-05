
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ScanSearch, AlertTriangle, CheckCircle, HelpCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { detectAiText, type AiDetectorInput, type AiDetectorOutput } from '@/ai/flows/ai-detector-flow';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  textToAnalyze: z.string()
    .min(50, { message: "Text must be at least 50 characters long for a meaningful analysis." })
    .max(5000, { message: "Text cannot exceed 5000 characters." }),
});

type AiDetectorFormValues = z.infer<typeof formSchema>;

const getCategoryBadgeVariant = (category?: AiDetectorOutput['assessmentCategory']): "default" | "secondary" | "destructive" | "outline" => {
  if (!category) return "outline";
  if (category.includes("Human-Written")) return "default"; // More positive/neutral
  if (category.includes("AI-Generated")) return "destructive"; // More warning
  if (category === "Uncertain") return "secondary";
  return "outline";
};

const getCategoryIcon = (category?: AiDetectorOutput['assessmentCategory']): React.ElementType => {
  if (!category) return HelpCircle;
  if (category.includes("Human-Written")) return CheckCircle;
  if (category.includes("AI-Generated")) return AlertTriangle;
  return Info;
};


export default function AiDetectorPage() {
  const [analysisResult, setAnalysisResult] = useState<AiDetectorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AiDetectorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textToAnalyze: '',
    },
  });

  const onSubmit = async (data: AiDetectorFormValues) => {
    setIsLoading(true);
    setAnalysisResult(null);
    toast({ title: 'Analyzing Text...', description: 'The AI is evaluating the content. This might take a moment.' });

    try {
      const input: AiDetectorInput = { inputText: data.textToAnalyze };
      const result = await detectAiText(input);
      setAnalysisResult(result);
      toast({ title: 'Analysis Complete!', description: 'The AI has provided its assessment.' });
    } catch (error: any) {
      console.error('AI detection error:', error);
      setAnalysisResult(null);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'Could not analyze text. Please try again later.',
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <ScanSearch className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">AI Text Detector</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Paste text below to estimate the likelihood of it being AI-generated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="textToAnalyze"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Text to Analyze</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the text you want to analyze here (min 50, max 5000 characters)..."
                        className="min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-3">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ScanSearch className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Analyzing...' : 'Analyze Text'}
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="mt-8 text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground mt-2">The AI is carefully reading the text...</p>
            </div>
          )}

          {analysisResult && !isLoading && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-2xl font-semibold text-center mb-4 font-headline">Analysis Result</h3>
              <Card className="bg-muted/20 p-6 shadow-inner space-y-4">
                <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                  <span className="text-lg font-medium">Assessment:</span>
                  <Badge variant={getCategoryBadgeVariant(analysisResult.assessmentCategory)} className="text-base px-3 py-1">
                    {React.createElement(getCategoryIcon(analysisResult.assessmentCategory), { className: "mr-2 h-4 w-4"})}
                    {analysisResult.assessmentCategory}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold text-md mb-1">Reasoning:</p>
                  <p className="text-sm text-foreground/80 italic">"{analysisResult.assessmentReasoning}"</p>
                </div>
                 <details className="mt-4 text-xs bg-background/50 p-3 rounded border">
                  <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">Show Original Text</summary>
                  <Textarea
                    value={analysisResult.originalText}
                    readOnly
                    className="mt-2 min-h-[100px] max-h-[200px] bg-muted/10 text-xs"
                    rows={5}
                  />
                </details>
              </Card>
            </div>
          )}
          
          <Alert variant="default" className="mt-8 border-primary/30">
            <AlertTriangle className="h-4 w-4 !text-primary" />
            <AlertTitle className="font-semibold text-primary">Important Disclaimer</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p>This AI Text Detector provides an estimation based on patterns and statistical analysis. It is <strong>not a definitive proof</strong> of AI or human authorship.</p>
              <p>The tool can make mistakes (false positives or false negatives). Human-written text can sometimes be flagged as AI-generated, and AI-generated text can sometimes be missed.</p>
              <p>Use this tool as one piece of information among others, and always apply critical thinking. Do not use it to make final judgments about content origin without further verification.</p>
            </AlertDescription>
          </Alert>

        </CardContent>
         <CardFooter className="text-sm text-muted-foreground text-center block">
          Powered by AI. Interpret results with caution.
        </CardFooter>
      </Card>
    </div>
  );
}
