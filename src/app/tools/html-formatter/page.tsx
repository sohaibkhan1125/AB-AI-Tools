
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CodeXml, Copy, Trash2, Loader2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatHtml, type HtmlFormatterInput, type HtmlFormatterOutput } from '@/ai/flows/html-formatter-flow';

export default function HtmlFormatterPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormat = async () => {
    if (!inputText.trim()) {
      setOutputText('');
      setError(null);
      toast({ variant: 'default', title: 'Input Empty', description: 'Please enter some HTML to format.' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputText('');

    try {
      const input: HtmlFormatterInput = { htmlContent: inputText };
      const result: HtmlFormatterOutput = await formatHtml(input);
      setOutputText(result.formattedHtml);
      toast({ title: 'HTML Formatted Successfully!' });
    } catch (e: any) {
      const errorMessage = e.message || 'Failed to format HTML. Please check the syntax.';
      setError(errorMessage);
      toast({ variant: 'destructive', title: 'Formatting Error', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyOutput = () => {
    if (!outputText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'Format some HTML first.' });
      return;
    }
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Copied to Clipboard!', description: 'Formatted HTML copied.' });
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
            <CodeXml className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">HTML Formatter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Paste your HTML code below to format and beautify it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="inputText" className="font-medium">Input HTML</Label>
            <Textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your HTML code here..."
              className="mt-1 min-h-[200px] font-mono"
              rows={10}
              aria-label="HTML input"
            />
          </div>

          <Button onClick={handleFormat} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CodeXml className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Formatting...' : 'Format HTML'}
          </Button>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Formatting Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {outputText && !error && (
            <div className="space-y-2">
              <Label htmlFor="outputText" className="font-medium">Formatted HTML</Label>
              <Textarea
                id="outputText"
                value={outputText}
                readOnly
                className="mt-1 min-h-[250px] bg-muted/30 font-mono"
                rows={15}
                aria-label="Formatted HTML output"
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
              <Copy className="mr-2 h-4 w-4" /> Copy Formatted HTML
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
