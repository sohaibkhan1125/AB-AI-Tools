
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link as LinkIcon, Copy, Trash2, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UrlEncoderDecoderPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleEncode = () => {
    if (!inputText.trim()) {
      toast({ variant: 'destructive', title: 'Input Empty', description: 'Please enter text to encode.' });
      setOutputText('');
      return;
    }
    try {
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
      toast({ title: 'Encoded Successfully!', description: 'Text converted to URL-safe format.' });
    } catch (error) {
      console.error("Encoding error:", error);
      setOutputText('');
      toast({ variant: 'destructive', title: 'Encoding Error', description: 'Could not encode the input text.' });
    }
  };

  const handleDecode = () => {
    if (!inputText.trim()) {
      toast({ variant: 'destructive', title: 'Input Empty', description: 'Please enter a URL-encoded string to decode.' });
      setOutputText('');
      return;
    }
    try {
      const decoded = decodeURIComponent(inputText);
      setOutputText(decoded);
      toast({ title: 'Decoded Successfully!', description: 'URL-encoded string converted to text.' });
    } catch (error) {
      console.error("Decoding error:", error);
      setOutputText('');
      // URIError is thrown for malformed URI sequences
      if (error instanceof URIError) {
        toast({
            variant: 'destructive',
            title: 'Decoding Error',
            description: 'Invalid URL-encoded string. Please check your input.',
        });
      } else {
        toast({
            variant: 'destructive',
            title: 'Decoding Error',
            description: 'An unexpected error occurred during decoding.',
        });
      }
    }
  };

  const handleCopyOutput = () => {
    if (!outputText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'Output is empty.' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to Clipboard!', description: 'Output text copied.' });
  };

  const handleClearFields = () => {
    setInputText('');
    setOutputText('');
    toast({ title: 'Fields Cleared' });
  };
  
  const handleSwapFields = () => {
    setInputText(outputText);
    setOutputText(inputText);
    toast({ title: 'Swapped!', description: 'Input and output fields have been swapped.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <LinkIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">URL Encoder / Decoder</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Encode text for safe use in URLs or decode URL-encoded strings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="inputText" className="font-medium">Input Text / URL-encoded String</Label>
            <Textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter plain text to encode or URL-encoded string to decode..."
              className="mt-1 min-h-[150px]"
              rows={6}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleEncode} className="w-full sm:flex-1">Encode URL</Button>
            <Button onClick={handleDecode} className="w-full sm:flex-1">Decode URL</Button>
          </div>
          
          <div className="flex items-center justify-center">
            <Button onClick={handleSwapFields} variant="ghost" size="icon" aria-label="Swap input and output">
              <ArrowRightLeft className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
          </div>

          <div>
            <Label htmlFor="outputText" className="font-medium">Output</Label>
            <Textarea
              id="outputText"
              value={outputText}
              readOnly
              placeholder="Result will appear here..."
              className="mt-1 min-h-[150px] bg-muted/30"
              rows={6}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button onClick={handleCopyOutput} variant="outline" className="w-full sm:flex-1" disabled={!outputText}>
              <Copy className="mr-2 h-4 w-4" /> Copy Output
            </Button>
            <Button onClick={handleClearFields} variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
