
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileCode2, Copy, Trash2, Loader2, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertJsonToXml, type JsonToXmlInput, type JsonToXmlOutput } from '@/ai/flows/json-to-xml-flow';

export default function JsonToXmlPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!inputText.trim()) {
      setOutputText('');
      setError(null);
      toast({ variant: 'default', title: 'Input Empty', description: 'Please enter some JSON to convert.' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputText('');

    try {
      const input: JsonToXmlInput = { jsonText: inputText };
      const result: JsonToXmlOutput = await convertJsonToXml(input);
      
      if (result.success) {
        setOutputText(result.xmlText);
        toast({ title: 'JSON Converted to XML Successfully!' });
      } else {
        setError(result.message || result.xmlText || 'Failed to convert JSON to XML. AI could not process the input.');
        toast({ variant: 'destructive', title: 'Conversion Error', description: result.message || result.xmlText });
      }
    } catch (e: any) {
      const errorMessage = e.message || 'An unexpected error occurred during conversion.';
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'Conversion Error', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyOutput = () => {
    if (!outputText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'Convert some JSON first.' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to Clipboard!', description: 'Converted XML copied.' });
  };

  const handleClearInput = () => {
    setInputText('');
    setOutputText('');
    setError(null);
    toast({ title: 'Input Cleared' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <FileCode2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">JSON to XML Converter (AI Assisted)</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Paste your JSON code below to convert it to XML format using AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="inputText" className="font-medium">Input JSON</Label>
            <Textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your JSON code here..."
              className="mt-1 min-h-[200px] font-mono"
              rows={10}
              aria-label="JSON input"
            />
          </div>

          <Button onClick={handleConvert} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileCode2 className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Converting...' : 'Convert to XML'}
          </Button>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Conversion Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {outputText && !error && (
            <div className="space-y-2">
              <Label htmlFor="outputText" className="font-medium">Converted XML</Label>
              <Textarea
                id="outputText"
                value={outputText}
                readOnly
                className="mt-1 min-h-[250px] bg-muted/30 font-mono"
                rows={15}
                aria-label="Converted XML output"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              onClick={handleCopyOutput} 
              variant="outline" 
              className="w-full sm:flex-1" 
              disabled={!outputText || !!error}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy XML
            </Button>
            <Button onClick={handleClearInput} variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" /> Clear Fields
            </Button>
          </div>
          
          <Alert variant="default" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">AI-Assisted Conversion</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p>This tool uses AI to convert JSON to XML. The AI attempts to create a logical XML structure based on your JSON.</p>
              <p>For complex or deeply nested JSON, or if specific XML schema adherence is required, the AI's output may vary. Always review the generated XML for correctness.</p>
              <p>The tool first validates if the input is well-formed JSON. If not, an error will be shown.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
