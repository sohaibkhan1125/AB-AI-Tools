
'use client';

import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Download, Volume2, AlertTriangle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { textToVoiceWithTone, type TextToVoiceInput, type TextToVoiceOutput } from '@/ai/flows/text-to-voice-with-tone-flow';

const toneOptions = [
  { label: 'Neutral', value: 'Neutral' },
  { label: 'Happy', value: 'Happy' },
  { label: 'Sad', value: 'Sad' },
  { label: 'Excited', value: 'Excited' },
  { label: 'Calm', value: 'Calm' },
  { label: 'Friendly', value: 'Friendly' },
  { label: 'Professional', value: 'Professional' },
  { label: 'Whispering', value: 'Whispering' },
  // { label: 'Shouting', value: 'Shouting' }, // Potentially problematic for safety filters
];

const formSchema = z.object({
  textToSpeak: z.string()
    .min(1, { message: "Please enter some text to convert." })
    .max(1000, { message: "Text cannot exceed 1000 characters." }),
  desiredTone: z.string({ required_error: "Please select a tone." }),
});

type SpeechFormValues = z.infer<typeof formSchema>;

export default function TextToVoiceConverterPage() {
  const [generatedAudio, setGeneratedAudio] = useState<TextToVoiceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const form = useForm<SpeechFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textToSpeak: '',
      desiredTone: 'Neutral',
    },
  });

  const onSubmit = async (data: SpeechFormValues) => {
    setIsLoading(true);
    setGeneratedAudio(null);
    toast({ title: 'Generating Speech...', description: 'The AI is warming up its vocal cords. This might take a moment.' });

    try {
      const input: TextToVoiceInput = { textToSpeak: data.textToSpeak, desiredTone: data.desiredTone };
      const result = await textToVoiceWithTone(input);
      setGeneratedAudio(result);
      toast({ title: 'Speech Generated!', description: 'Your text has been converted to audio.' });
      if (audioPlayerRef.current && result.audioDataUri) {
        audioPlayerRef.current.src = result.audioDataUri;
      }
    } catch (error: any) {
      console.error('Text to speech error:', error);
      setGeneratedAudio(null);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'Could not generate speech. Please try different text or tone, or try again later.',
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAudio = () => {
    if (!generatedAudio || !generatedAudio.audioDataUri) {
      toast({ variant: 'destructive', title: 'Nothing to Download', description: 'Generate some audio first.' });
      return;
    }
    const link = document.createElement('a');
    link.href = generatedAudio.audioDataUri;
    
    const mimeTypeMatch = generatedAudio.audioDataUri.match(/data:(audio\/[^;]+);/);
    let extension = 'mp3'; // Default extension
    if (mimeTypeMatch && mimeTypeMatch[1]) {
      const typePart = mimeTypeMatch[1].toLowerCase();
      if (typePart === 'mpeg') extension = 'mp3';
      else if (typePart === 'webm') extension = 'webm';
      else if (typePart === 'ogg') extension = 'ogg';
      else if (typePart === 'wav') extension = 'wav';
      // Add more mappings if needed based on typical AI outputs
    }
    
    link.download = `ai_speech_${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Download Started', description: 'Your AI-generated audio is downloading.' });
  };
  
  const handleCopyText = () => {
    const text = form.getValues("textToSpeak");
    if (!text) {
      toast({ variant: "destructive", title: "Nothing to Copy", description: "Input text is empty." });
      return;
    }
    navigator.clipboard.writeText(text);
    toast({ title: "Text Copied!", description: "Input text copied to clipboard." });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Volume2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Text to Voice Converter (with Tone)</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Enter text, choose a tone, and let AI speak it out for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="textToSpeak"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Text to Convert</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Hello world! I am an AI voice."
                        className="min-h-[120px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                        <FormMessage />
                        <Button type="button" variant="ghost" size="sm" onClick={handleCopyText} className="text-xs text-muted-foreground">
                            <Copy className="mr-1 h-3 w-3" /> Copy Input Text
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground pt-1">
                      Max 1000 characters.
                    </p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredTone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Desired Voice Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {toneOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-3">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Volume2 className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Generating...' : 'Generate Speech'}
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="mt-8 text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground mt-2">The AI is preparing the audio... please be patient.</p>
            </div>
          )}

          {generatedAudio?.audioDataUri && !isLoading && (
            <div className="mt-8 pt-6 border-t space-y-4">
              <h3 className="text-2xl font-semibold text-center mb-4 font-headline">Generated Audio</h3>
              <audio ref={audioPlayerRef} controls className="w-full" src={generatedAudio.audioDataUri}>
                Your browser does not support the audio element.
              </audio>
              <Button onClick={handleDownloadAudio} className="w-full mt-4" variant="outline">
                <Download className="mr-2 h-5 w-5" /> Download Audio
              </Button>
               <details className="mt-2 text-xs bg-muted/30 p-2 rounded border">
                  <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">Show Prompt Used</summary>
                  <p className="mt-1 text-foreground/80 whitespace-pre-wrap">{generatedAudio.promptUsed}</p>
                </details>
            </div>
          )}
          
          <Alert variant="default" className="mt-8">
            <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
            <AlertTitle className="font-semibold">Important Considerations</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p>AI speech generation can take a few moments.</p>
              <p>The naturalness and tone accuracy depend on the AI model and the complexity of the text and tone requested.</p>
              <p>Some tones might be interpreted differently by the AI. Experiment for best results!</p>
              <p>The AI has safety filters. Certain text or tone combinations might be blocked.</p>
            </AlertDescription>
          </Alert>

        </CardContent>
         <CardFooter className="text-sm text-muted-foreground text-center block">
          Powered by AI. Use responsibly.
        </CardFooter>
      </Card>
    </div>
  );
}
