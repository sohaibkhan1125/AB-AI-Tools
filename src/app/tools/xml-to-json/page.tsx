
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Loader2, Download, Copy, AlertCircle, FileCode2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { convertXmlToJson, type XmlToJsonInput, type XmlToJsonOutput } from '@/ai/flows/xml-to-json-flow';

export default function XmlToJsonPage() {
  const [xmlText, setXmlText] = useState<string>('');
  const [xmlFileName, setXmlFileName] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/xml' || file.type === 'application/xml' || file.name.endsWith('.xml')) {
        setXmlFileName(file.name);
        setJsonText('');
        setAiMessage(null);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setXmlText(content);
          toast({ title: 'XML File Loaded', description: `${file.name} content loaded into textarea.` });
        };
        reader.onerror = () => {
          toast({ variant: 'destructive', title: 'File Read Error', description: 'Failed to read the XML file.' });
          setXmlText('');
          setXmlFileName(null);
        };
        reader.readAsText(file);

      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a valid .xml file.',
        });
        setXmlText('');
        setXmlFileName(null);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };
  
  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setXmlText(event.target.value);
    setXmlFileName(null); // Clear filename if text is manually changed
  };

  const handleConvert = async () => {
    if (!xmlText.trim()) {
      toast({ variant: 'destructive', title: 'No XML Data', description: 'Please upload an XML file or paste XML text.' });
      return;
    }

    setIsProcessing(true);
    setJsonText('');
    setAiMessage(null);
    toast({ title: 'Converting XML to JSON...', description: 'AI is processing your data. This may take a moment.' });

    try {
      const aiInput: XmlToJsonInput = { xmlText };
      const aiResult: XmlToJsonOutput = await convertXmlToJson(aiInput);

      if (aiResult.success) {
        setJsonText(aiResult.jsonText);
        toast({ title: 'Conversion Successful!', description: 'XML data converted to JSON by AI.' });
      } else {
        setAiMessage(aiResult.message || aiResult.jsonText || 'AI could not convert the XML data to JSON.');
        toast({
          variant: 'destructive',
          title: 'AI Conversion Failed',
          description: aiResult.message || aiResult.jsonText || 'Check AI message below.',
          duration: 7000,
        });
      }
    } catch (error: any) {
      console.error('Error converting XML to JSON:', error);
      setAiMessage(`An unexpected error occurred: ${error.message}`);
      toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: error.message || 'An unexpected error occurred during AI processing.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadJson = () => {
    if (!jsonText) {
      toast({ variant: 'destructive', title: 'Nothing to Download', description: 'Convert some XML data first.' });
      return;
    }
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const baseName = xmlFileName?.replace(/\.xml$/i, '') || 'converted_data';
    link.download = `${baseName}.json`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Download Started', description: 'Your JSON file is downloading.' });
  };

  const handleCopyJson = () => {
    if (!jsonText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'No JSON data to copy.' });
      return;
    }
    navigator.clipboard.writeText(jsonText);
    toast({ title: 'Copied to Clipboard!', description: 'JSON data copied.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <FileCode2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">XML to JSON Converter (AI Assisted)</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload or paste XML data to convert it into JSON format using AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <Label htmlFor="xmlInputArea" className="font-medium">XML Input</Label>
            <Textarea
              id="xmlInputArea"
              value={xmlText}
              onChange={handleTextareaChange}
              placeholder="Paste your XML data here, or upload a file below..."
              className="mt-1 min-h-[150px] font-mono text-sm"
              rows={8}
            />
          </div>
          <div
            className="w-full p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="xml file upload area"
          >
            <UploadCloud className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              {xmlFileName || 'Click to browse or drag & drop an .xml file (optional)'}
            </p>
            <Input
              type="file"
              accept=".xml,text/xml,application/xml"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              id="xmlUpload"
            />
          </div>

          <Button onClick={handleConvert} disabled={isProcessing || !xmlText.trim()} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FileCode2 className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Converting with AI...' : 'Convert XML to JSON'}
          </Button>
          
          {aiMessage && (
             <Alert variant={jsonText ? "default" : "destructive"} className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-semibold">AI Processing Result</AlertTitle>
                <AlertDescription>{aiMessage}</AlertDescription>
            </Alert>
          )}

          {jsonText && (
            <div className="space-y-4 pt-6 border-t">
              <Label htmlFor="jsonOutput" className="font-medium text-base">Generated JSON Data:</Label>
              <Textarea
                id="jsonOutput"
                value={jsonText}
                readOnly
                rows={10}
                className="min-h-[200px] bg-muted/30 font-mono text-sm"
                placeholder="Your JSON output will appear here..."
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleCopyJson} variant="outline" className="w-full sm:flex-1">
                  <Copy className="mr-2 h-4 w-4" /> Copy JSON
                </Button>
                <Button onClick={handleDownloadJson} variant="outline" className="w-full sm:flex-1">
                  <Download className="mr-2 h-4 w-4" /> Download .json File
                </Button>
              </div>
            </div>
          )}
          
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">How It Works & Limitations</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p>This tool sends your XML data to an AI model, which attempts to convert it into a well-structured JSON format.</p>
              <p>The AI will try to interpret XML elements, attributes, and text content into appropriate JSON objects, arrays, and values.</p>
              <p><strong>Limitations:</strong> The AI's interpretation of complex or non-standard XML structures may vary. Always review the generated JSON for correctness and ensure it meets your needs. The AI will attempt to produce valid JSON, but for highly complex or malformed XML, results may not be perfect.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
           JSON generation via AI. Results may vary based on XML structure.
        </CardFooter>
      </Card>
    </div>
  );
}
