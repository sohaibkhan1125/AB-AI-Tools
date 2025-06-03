
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Braces, Copy, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ValidationStatus = {
  type: 'idle' | 'success' | 'error';
  message: string;
};

export default function JsonFormatterValidatorPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({ type: 'idle', message: '' });
  const { toast } = useToast();

  const handleFormatValidate = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setValidationStatus({ type: 'idle', message: 'Enter JSON to format and validate.' });
      toast({ variant: 'default', title: 'Input Empty', description: 'Please enter some JSON text.' });
      return;
    }

    try {
      const parsedJson = JSON.parse(inputText);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setOutputText(formattedJson);
      setValidationStatus({ type: 'success', message: 'Valid JSON formatted successfully!' });
      toast({ title: 'JSON Valid & Formatted' });
    } catch (error: any) {
      setOutputText('');
      let errorMessage = 'Invalid JSON. Please check the syntax.';
      if (error.message) {
        // Try to provide a more specific error message from the parser
        errorMessage = `Invalid JSON: ${error.message}`;
      }
      setValidationStatus({ type: 'error', message: errorMessage });
      toast({ variant: 'destructive', title: 'Invalid JSON', description: error.message || 'Please check your JSON syntax.' });
    }
  };

  const handleCopyOutput = () => {
    if (!outputText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'Format some JSON first.' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to Clipboard!', description: 'Formatted JSON copied.' });
  };

  const handleClearInput = () => {
    setInputText('');
    setOutputText('');
    setValidationStatus({ type: 'idle', message: '' });
    toast({ title: 'Input Cleared' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Braces className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">JSON Formatter & Validator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Paste your JSON below to format and validate it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="inputText" className="font-medium">Input JSON</Label>
            <Textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your JSON string here..."
              className="mt-1 min-h-[200px] font-mono"
              rows={10}
              aria-label="JSON input"
            />
          </div>

          <Button onClick={handleFormatValidate} className="w-full">
            Format & Validate JSON
          </Button>

          {validationStatus.type !== 'idle' && (
            <Alert variant={validationStatus.type === 'error' ? 'destructive' : 'default'}>
              {validationStatus.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{validationStatus.type === 'success' ? 'Valid JSON' : 'Validation Error'}</AlertTitle>
              <AlertDescription>{validationStatus.message}</AlertDescription>
            </Alert>
          )}

          {outputText && validationStatus.type === 'success' && (
            <div className="space-y-2">
              <Label htmlFor="outputText" className="font-medium">Formatted JSON</Label>
              <Textarea
                id="outputText"
                value={outputText}
                readOnly
                className="mt-1 min-h-[250px] bg-muted/30 font-mono"
                rows={15}
                aria-label="Formatted JSON output"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              onClick={handleCopyOutput} 
              variant="outline" 
              className="w-full sm:flex-1" 
              disabled={!outputText || validationStatus.type !== 'success'}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy Formatted JSON
            </Button>
            <Button onClick={handleClearInput} variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" /> Clear Input
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
