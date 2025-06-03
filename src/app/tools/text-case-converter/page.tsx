
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CaseSensitive, Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TextCaseConverterPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    // Optionally, clear output text when input changes, or auto-convert based on a selected mode
    // setOutputText(''); 
  };

  const toSentenceCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const convertCase = (conversionType: 'uppercase' | 'lowercase' | 'sentence' | 'title') => {
    if (!inputText.trim()) {
      toast({ variant: 'destructive', title: 'No Text', description: 'Please enter some text to convert.' });
      setOutputText('');
      return;
    }
    let result = '';
    switch (conversionType) {
      case 'uppercase':
        result = inputText.toUpperCase();
        break;
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'sentence':
        result = toSentenceCase(inputText);
        break;
      case 'title':
        result = toTitleCase(inputText);
        break;
      default:
        result = inputText;
    }
    setOutputText(result);
    toast({ title: 'Text Converted!', description: `Converted to ${conversionType.replace(/^\w/, c => c.toUpperCase())} Case.` });
  };

  const handleCopy = () => {
    if (!outputText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'Convert some text first.' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to Clipboard!', description: 'Converted text copied.' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    toast({ title: 'Text Cleared', description: 'Input and output fields cleared.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <CaseSensitive className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Text Case Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Easily convert your text between different letter cases.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="inputText" className="font-medium">Input Text</Label>
            <Textarea
              id="inputText"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Paste or type your text here..."
              className="mt-1 min-h-[150px]"
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button onClick={() => convertCase('uppercase')} className="w-full">UPPERCASE</Button>
            <Button onClick={() => convertCase('lowercase')} className="w-full">lowercase</Button>
            <Button onClick={() => convertCase('sentence')} className="w-full">Sentence case</Button>
            <Button onClick={() => convertCase('title')} className="w-full">Title Case</Button>
          </div>
          
          {outputText && (
             <div className="border-t pt-6 space-y-2">
                <Label htmlFor="outputText" className="font-medium">Output Text</Label>
                <Textarea
                id="outputText"
                value={outputText}
                readOnly
                className="mt-1 min-h-[150px] bg-muted/30"
                rows={6}
                />
             </div>
          )}


          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleCopy} variant="outline" className="w-full sm:w-auto flex-grow" disabled={!outputText}>
              <Copy className="mr-2 h-4 w-4" /> Copy Output
            </Button>
            <Button onClick={handleClear} variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" /> Clear Text
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
