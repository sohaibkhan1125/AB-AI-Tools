
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Copy, Download, Loader2, FileCode2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertCsvToJson, type CsvToJsonInput } from '@/ai/flows/csv-to-json-flow';

export default function CsvToJsonPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvFileName, setCsvFileName] = useState<string>('');
  const [jsonText, setJsonText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setCsvFile(file);
        setCsvFileName(file.name);
        setJsonText(''); // Clear previous results
        toast({ title: 'File Selected', description: `${file.name} is ready for conversion.` });
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a valid .csv file.',
        });
        setCsvFile(null);
        setCsvFileName('');
      }
    }
  };

  const handleConvert = async () => {
    if (!csvFile) {
      toast({ variant: 'destructive', title: 'No File', description: 'Please select a CSV file first.' });
      return;
    }

    setIsLoading(true);
    setJsonText('');
    toast({ title: 'Converting...', description: 'Your CSV is being converted to JSON.' });

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvText = e.target?.result as string;
      if (!csvText) {
        toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read the CSV file content.' });
        setIsLoading(false);
        return;
      }

      try {
        const input: CsvToJsonInput = { csvText };
        const result = await convertCsvToJson(input);
        setJsonText(result.jsonText);
        toast({ title: 'Conversion Successful!', description: 'CSV has been converted to JSON.' });
      } catch (error: any) {
        console.error('CSV to JSON conversion error:', error);
        setJsonText('');
        toast({
          variant: 'destructive',
          title: 'Conversion Failed',
          description: error.message || 'Could not convert CSV to JSON. Please ensure the CSV format is valid.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      toast({ variant: 'destructive', title: 'File Read Error', description: 'Failed to read the CSV file.' });
      setIsLoading(false);
    };
    reader.readAsText(csvFile);
  };

  const handleCopyJson = () => {
    if (!jsonText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'Generate some JSON first.' });
      return;
    }
    navigator.clipboard.writeText(jsonText);
    toast({ title: 'Copied to Clipboard!', description: 'JSON data copied.' });
  };

  const handleDownloadJson = () => {
    if (!jsonText) {
      toast({ variant: 'destructive', title: 'Nothing to Download', description: 'Generate some JSON first.' });
      return;
    }
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const baseFileName = csvFileName.substring(0, csvFileName.lastIndexOf('.')) || 'converted_data';
    link.download = `${baseFileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Download Started', description: 'Your JSON file is downloading.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <FileCode2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">CSV to JSON Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload your CSV file to convert it into JSON format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div
            className="w-full p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="csv file upload area"
          >
            <UploadCloud className="h-10 w-10 text-primary mb-3" />
            <p className="text-muted-foreground">
              {csvFileName ? `Selected: ${csvFileName}` : 'Click to browse or drag & drop a .csv file'}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Max file size: 5MB (Recommended for browser performance)
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

          <Button onClick={handleConvert} disabled={!csvFile || isLoading} className="w-full text-lg py-3">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FileCode2 className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Converting...' : 'Convert to JSON'}
          </Button>

          {jsonText && (
            <div className="space-y-4 pt-6 border-t">
              <Label htmlFor="jsonOutput" className="font-medium text-base">Generated JSON:</Label>
              <Textarea
                id="jsonOutput"
                value={jsonText}
                readOnly
                rows={15}
                className="min-h-[250px] bg-muted/30 font-mono text-sm"
                placeholder="Your JSON output will appear here..."
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleCopyJson} variant="outline" className="w-full sm:flex-1">
                  <Copy className="mr-2 h-4 w-4" /> Copy JSON
                </Button>
                <Button onClick={handleDownloadJson} variant="outline" className="w-full sm:flex-1">
                  <Download className="mr-2 h-4 w-4" /> Download JSON File
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
