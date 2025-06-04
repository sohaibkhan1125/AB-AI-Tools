'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Download, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateImage, type GenerateImageInput, type GenerateImageOutput } from '@/ai/flows/generate-image-flow';

const formSchema = z.object({
  prompt: z.string().min(5, { message: "Prompt must be at least 5 characters long." }).max(500, { message: "Prompt cannot exceed 500 characters." }),
});

type ImageFormValues = z.infer<typeof formSchema>;

export default function AiImageGeneratorPage() {
  const [generatedImage, setGeneratedImage] = useState<GenerateImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit = async (data: ImageFormValues) => {
    setIsLoading(true);
    setGeneratedImage(null);
    toast({ title: 'Generating Image...', description: 'The AI is conjuring your masterpiece. This might take a few moments.' });

    try {
      const input: GenerateImageInput = { prompt: data.prompt };
      const result = await generateImage(input);
      setGeneratedImage(result);
      toast({ title: 'Image Generated!', description: 'Your AI-generated image is ready.' });
    } catch (error: any) {
      console.error('Image generation error:', error);
      setGeneratedImage(null);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'Could not generate image. Please try a different prompt or try again later.',
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage || !generatedImage.imageDataUri) {
      toast({ variant: 'destructive', title: 'Nothing to Download', description: 'Generate an image first.' });
      return;
    }
    const link = document.createElement('a');
    link.href = generatedImage.imageDataUri;
    
    const mimeTypeMatch = generatedImage.imageDataUri.match(/data:(image\/[^;]+);/);
    const extension = mimeTypeMatch && mimeTypeMatch[1] ? mimeTypeMatch[1].split('/')[1] : 'png';
    
    link.download = `ai_generated_image_${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Download Started', description: 'Your AI image is downloading.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">AI Image Generator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Describe the image you want to create, and let AI bring it to life!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Your Image Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A futuristic cityscape at sunset, photorealistic, vibrant colors"
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground pt-1">
                      Be descriptive for best results. Max 500 characters.
                    </p>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-3">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Generating...' : 'Generate Image'}
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="mt-8 text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground mt-2">The AI is working its magic... please be patient.</p>
            </div>
          )}

          {generatedImage?.imageDataUri && !isLoading && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-2xl font-semibold text-center mb-4 font-headline">Your Generated Image</h3>
              <Card className="bg-muted/20 p-4 shadow-inner">
                <div className="aspect-square relative w-full max-w-md mx-auto rounded-md overflow-hidden border">
                  <Image
                    src={generatedImage.imageDataUri}
                    alt={generatedImage.promptUsed || "AI generated image"}
                    layout="fill"
                    objectFit="contain"
                    data-ai-hint="generated art"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center italic">
                  Prompt: "{generatedImage.promptUsed}"
                </p>
              </Card>
              <Button onClick={handleDownload} className="w-full mt-6" variant="outline">
                <Download className="mr-2 h-5 w-5" /> Download Image
              </Button>
            </div>
          )}
          
          <Alert variant="default" className="mt-8">
            <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
            <AlertTitle className="font-semibold">Important Considerations</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p>AI image generation can take a few moments (sometimes up to 30 seconds or more).</p>
              <p>Results can be unpredictable. If you're not happy with the image, try rephrasing your prompt or generating again.</p>
              <p>The AI has safety filters. Prompts or generated images might be blocked if they violate content policies.</p>
              <p>Generated images are typically around 1MB and may be compressed for display.</p>
            </AlertDescription>
          </Alert>

        </CardContent>
         <CardFooter className="text-sm text-muted-foreground text-center block">
          Powered by Gemini AI. Use responsibly.
        </CardFooter>
      </Card>
    </div>
  );
}
