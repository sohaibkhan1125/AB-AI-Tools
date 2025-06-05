
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Loader2, Download, Copy, AlertCircle, FileCode2, DatabaseZap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { convertCsvToXml, type CsvToXmlInput, type CsvToXmlOutput } from '@/ai/flows/csv-to-xml-flow';

export default function CsvToXmlPage() {
  const [csvText, setCsvText] = useState<string>('');
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [xmlText, setXmlText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setCsvFileName(file.name);
        setXmlText('');
        setAiMessage(null);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCsvText(content);
          toast({ title: 'CSV File Loaded', description: `${file.name} content loaded into textarea.` });
        };
        reader.onerror = () => {
          toast({ variant: 'destructive', title: 'File Read Error', description: 'Failed to read the CSV file.' });
          setCsvText('');
          setCsvFileName(null);
        };
        reader.readAsText(file);

      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a valid .csv file.',
        });
        setCsvText('');
        setCsvFileName(null);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };
  
  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCsvText(event.target.value);
    setCsvFileName(null); // Clear filename if text is manually changed
  };


  const handleConvert = async () => {
    if (!csvText.trim()) {
      toast({ variant: 'destructive', title: 'No CSV Data', description: 'Please upload a CSV file or paste CSV text.' });
      return;
    }

    setIsProcessing(true);
    setXmlText('');
    setAiMessage(null);
    toast({ title: 'Converting CSV to XML...', description: 'AI is processing your data. This may take a moment.' });

    try {
      const aiInput: CsvToXmlInput = { csvText };
      const aiResult: CsvToXmlOutput = await convertCsvToXml(aiInput);

      if (aiResult.success) {
        setXmlText(aiResult.xmlText);
        toast({ title: 'Conversion Successful!', description: 'CSV data converted to XML by AI.' });
      } else {
        setAiMessage(aiResult.message || aiResult.xmlText || 'AI could not convert the CSV data to XML.');
        toast({
          variant: 'destructive',
          title: 'AI Conversion Failed',
          description: aiResult.message || aiResult.xmlText || 'Check AI message below.',
          duration: 7000,
        });
      }
    } catch (error: any) {
      console.error('Error converting CSV to XML:', error);
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

  const handleDownloadXml = () => {
    if (!xmlText) {
      toast({ variant: 'destructive', title: 'Nothing to Download', description: 'Convert some CSV data first.' });
      return;
    }
    const blob = new Blob([xmlText], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const baseName = csvFileName?.replace(/\.csv$/i, '') || 'converted_data';
    link.download = `${baseName}.xml`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Download Started', description: 'Your XML file is downloading.' });
  };

  const handleCopyXml = () => {
    if (!xmlText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'No XML data to copy.' });
      return;
    }
    navigator.clipboard.writeText(xmlText);
    toast({ title: 'Copied to Clipboard!', description: 'XML data copied.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <FileCode2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">CSV to XML Converter (AI Assisted)</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload or paste CSV data to convert it into XML format using AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <Label htmlFor="csvInputArea" className="font-medium">CSV Input</Label>
            <Textarea
              id="csvInputArea"
              value={csvText}
              onChange={handleTextareaChange}
              placeholder="Paste your CSV data here, or upload a file below..."
              className="mt-1 min-h-[150px] font-mono text-sm"
              rows={8}
            />
          </div>
          <div
            className="w-full p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="csv file upload area"
          >
            <UploadCloud className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              {csvFileName || 'Click to browse or drag & drop a .csv file (optional)'}
            </p>
            <Input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              id="csvUpload"
            />
          </div>

          <Button onClick={handleConvert} disabled={isProcessing || !csvText.trim()} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <DatabaseZap className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Converting with AI...' : 'Convert CSV to XML'}
          </Button>
          
          {aiMessage && (
             <Alert variant={xmlText ? "default" : "destructive"} className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-semibold">AI Processing Result</AlertTitle>
                <AlertDescription>{aiMessage}</AlertDescription>
            </Alert>
          )}

          {xmlText && (
            <div className="space-y-4 pt-6 border-t">
              <Label htmlFor="xmlOutput" className="font-medium text-base">Generated XML Data:</Label>
              <Textarea
                id="xmlOutput"
                value={xmlText}
                readOnly
                rows={10}
                className="min-h-[200px] bg-muted/30 font-mono text-sm"
                placeholder="Your XML output will appear here..."
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleCopyXml} variant="outline" className="w-full sm:flex-1">
                  <Copy className="mr-2 h-4 w-4" /> Copy XML
                </Button>
                <Button onClick={handleDownloadXml} variant="outline" className="w-full sm:flex-1">
                  <Download className="mr-2 h-4 w-4" /> Download .xml File
                </Button>
              </div>
            </div>
          )}
          
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">How It Works & Limitations</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p>This tool sends your CSV data to an AI model, which attempts to convert it into a well-structured XML format.</p>
              <p>The AI will typically use CSV headers as XML tag names for fields within each record, wrapped in a root element.</p>
              <p><strong>Limitations:</strong> The AI's interpretation of how to structure the XML may vary. For very large or complex CSVs, performance might be affected, or the AI might not perfectly convert all data. Always review the generated XML.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
           XML generation via AI. Results may vary based on CSV structure.
        </CardFooter>
      </Card>
    </div>
  );
}

