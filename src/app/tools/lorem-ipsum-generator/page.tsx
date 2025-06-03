
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ClipboardList, Copy, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLoremIpsum, type LoremIpsumInput } from '@/ai/flows/lorem-ipsum-flow';

type GenerationType = 'paragraphs' | 'sentences' | 'words';

const MAX_COUNTS: Record<GenerationType, number> = {
  paragraphs: 10,
  sentences: 50,
  words: 200,
};

export default function LoremIpsumGeneratorPage() {
  const [generationType, setGenerationType] = useState<GenerationType>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startsWithDefault, setStartsWithDefault] = useState<boolean>(true);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (count <= 0 || count > MAX_COUNTS[generationType]) {
      toast({
        variant: 'destructive',
        title: 'Invalid Count',
        description: `Please enter a count between 1 and ${MAX_COUNTS[generationType]} for ${generationType}.`,
      });
      return;
    }

    setIsLoading(true);
    setGeneratedText('');
    toast({ title: 'Generating Text...', description: 'Please wait while we conjure some Lorem Ipsum.' });

    try {
      const input: LoremIpsumInput = {
        type: generationType,
        count: Number(count),
        startsWithDefault,
      };
      const result = await generateLoremIpsum(input);
      setGeneratedText(result.text);
      toast({ title: 'Lorem Ipsum Generated!', description: 'Your placeholder text is ready.' });
    } catch (error: any) {
      console.error('Lorem Ipsum generation error:', error);
      setGeneratedText('');
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'Could not generate Lorem Ipsum text. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!generatedText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'Generate some text first.' });
      return;
    }
    navigator.clipboard.writeText(generatedText);
    toast({ title: 'Copied to Clipboard!', description: 'Lorem Ipsum text copied.' });
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
        setCount(1); // Or an empty string if preferred: setCount('')
    } else {
        setCount(Math.max(1, Math.min(value, MAX_COUNTS[generationType])));
    }
  };
  
  const handleGenerationTypeChange = (value: GenerationType) => {
    setGenerationType(value);
    // Adjust count if it exceeds the new type's max, or set a default
    if (count > MAX_COUNTS[value]) {
      setCount(MAX_COUNTS[value]);
    } else if (count < 1) {
      setCount(1);
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <ClipboardList className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Lorem Ipsum Generator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Generate placeholder text for your projects with various options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div>
              <Label className="font-medium text-base">Type of Text:</Label>
              <RadioGroup
                value={generationType}
                onValueChange={(value: string) => handleGenerationTypeChange(value as GenerationType)}
                className="mt-2 grid grid-cols-3 gap-2"
              >
                {(['paragraphs', 'sentences', 'words'] as GenerationType[]).map((type) => (
                  <Label
                    key={type}
                    htmlFor={`type-${type}`}
                    className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary cursor-pointer transition-colors"
                  >
                    <RadioGroupItem value={type} id={`type-${type}`} />
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="count" className="font-medium text-base">Number of {generationType}:</Label>
              <Input
                id="count"
                type="number"
                value={count}
                onChange={handleCountChange}
                min="1"
                max={MAX_COUNTS[generationType]}
                className="mt-1"
                placeholder={`e.g., 1 to ${MAX_COUNTS[generationType]}`}
              />
               <p className="text-xs text-muted-foreground mt-1">Max: {MAX_COUNTS[generationType]}</p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="startsWithDefault"
                checked={startsWithDefault}
                onCheckedChange={(checked) => setStartsWithDefault(checked as boolean)}
              />
              <Label htmlFor="startsWithDefault" className="font-medium">
                Start with "Lorem ipsum dolor sit amet..."
              </Label>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isLoading} className="w-full text-lg py-3">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Generating...' : 'Generate Lorem Ipsum'}
          </Button>

          {generatedText && (
            <div className="space-y-4 pt-6 border-t">
              <Label htmlFor="generatedTextOutput" className="font-medium text-base">Generated Text:</Label>
              <Textarea
                id="generatedTextOutput"
                value={generatedText}
                readOnly
                rows={10}
                className="min-h-[200px] bg-muted/30"
                placeholder="Your Lorem Ipsum will appear here..."
              />
              <Button onClick={handleCopyText} variant="outline" className="w-full sm:w-auto">
                <Copy className="mr-2 h-4 w-4" /> Copy Text
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
