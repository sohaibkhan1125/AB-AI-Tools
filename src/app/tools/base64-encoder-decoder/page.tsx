
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Binary, Copy, Trash2, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper function to convert a UTF-8 string to a Base64 string
function utf8ToBase64(str: string): string {
  try {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(str);
    // Convert Uint8Array to binary string
    let binaryString = '';
    uint8Array.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });
    return btoa(binaryString);
  } catch (e) {
    console.error("UTF-8 to Base64 encoding failed:", e);
    throw e; // Re-throw the error to be caught by the caller
  }
}

// Helper function to convert a Base64 string to a UTF-8 string
function base64ToUtf8(str: string): string {
  try {
    const binaryString = atob(str);
    // Convert binary string to Uint8Array
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8'); // Explicitly 'utf-8'
    return decoder.decode(uint8Array);
  } catch (e) {
    console.error("Base64 to UTF-8 decoding failed:", e);
    throw e; // Re-throw the error to be caught by the caller
  }
}


export default function Base64EncoderDecoderPage() {
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
      const encoded = utf8ToBase64(inputText);
      setOutputText(encoded);
      toast({ title: 'Encoded Successfully!', description: 'Text converted to Base64.' });
    } catch (error) {
      console.error("Encoding error:", error);
      setOutputText('');
      toast({ variant: 'destructive', title: 'Encoding Error', description: 'Could not encode the input text. Ensure valid UTF-8 input.' });
    }
  };

  const handleDecode = () => {
    if (!inputText.trim()) {
      toast({ variant: 'destructive', title: 'Input Empty', description: 'Please enter Base64 to decode.' });
      setOutputText('');
      return;
    }
    try {
      const decoded = base64ToUtf8(inputText);
      setOutputText(decoded);
      toast({ title: 'Decoded Successfully!', description: 'Base64 converted to text.' });
    } catch (error) {
      console.error("Decoding error:", error);
      setOutputText('');
      // Check if error is DOMException related to atob (invalid char) or decoding
      if (error instanceof DOMException && error.name === 'InvalidCharacterError') {
         toast({
            variant: 'destructive',
            title: 'Decoding Error',
            description: 'Invalid characters in Base64 string. Please check your input.',
         });
      } else {
        toast({
            variant: 'destructive',
            title: 'Decoding Error',
            description: 'Could not decode the Base64 string. It might be malformed or contain invalid characters.',
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
            <Binary className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Base64 Encoder / Decoder</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Encode your text into Base64 or decode Base64 strings back to readable text.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="inputText" className="font-medium">Input Text / Base64 String</Label>
            <Textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter plain text to encode or Base64 string to decode..."
              className="mt-1 min-h-[150px]"
              rows={6}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleEncode} className="w-full sm:flex-1">Encode to Base64</Button>
            <Button onClick={handleDecode} className="w-full sm:flex-1">Decode from Base64</Button>
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
