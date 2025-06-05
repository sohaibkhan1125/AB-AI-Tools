
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, FileSpreadsheet as ExcelIcon, Loader2, Download, AlertCircle, DatabaseZap, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { read, utils, writeFileXLSX } from 'xlsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { convertXmlToCsv, type XmlToCsvInput, type XmlToCsvOutput } from '@/ai/flows/xml-to-csv-flow';

const NO_TABULAR_DATA_MESSAGE = "NO_TABULAR_DATA_FOUND";
const INVALID_XML_MESSAGE = "INVALID_XML_INPUT";
const AI_PROCESSING_ERROR_MESSAGE = "AI_PROCESSING_ERROR";
const AI_EXPLANATION_MESSAGE = "AI_EXPLANATION_INSTEAD_OF_CSV";


export default function XmlToExcelPage() {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [xmlFileName, setXmlFileName] = useState<string>('');
  const [extractedCsvText, setExtractedCsvText] = useState<string>('');
  const [aiMessage, setAiMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/xml' || file.type === 'application/xml' || file.name.endsWith('.xml')) {
        setXmlFile(file);
        setXmlFileName(file.name);
        setExtractedCsvText('');
        setAiMessage('');
        toast({ title: 'XML File Selected', description: `${file.name} is ready for processing.` });
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a valid .xml file.',
        });
        setXmlFile(null);
        setXmlFileName('');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleConvert = async () => {
    if (!xmlFile) {
      toast({ variant: 'destructive', title: 'No XML File', description: 'Please select an XML file first.' });
      return;
    }

    setIsProcessing(true);
    setExtractedCsvText('');
    setAiMessage('');
    toast({ title: 'Processing XML...', description: 'AI is attempting to extract tabular data. This may take a moment.' });

    const reader = new FileReader();
    reader.onload = async (e) => {
      const xmlText = e.target?.result as string;
      if (!xmlText) {
        toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read the XML file content.' });
        setIsProcessing(false);
        return;
      }

      try {
        const input: XmlToCsvInput = { xmlText, originalFileName: xmlFile.name };
        const result: XmlToCsvOutput = await convertXmlToCsv(input);

        if (result.success && result.csvText) {
          setExtractedCsvText(result.csvText);
          // Attempt to convert CSV to Excel and download
          try {
            const csvWorkbook = read(result.csvText, { type: 'string', rawNumbers: false });
            const firstSheetName = csvWorkbook.SheetNames[0];
            const worksheet = csvWorkbook.Sheets[firstSheetName];

            const newWorkbook = utils.book_new();
            utils.book_append_sheet(newWorkbook, worksheet, "Sheet1");

            const outputFileNameBase = result.originalFileName?.replace(/\.xml$/i, '') || 'converted_data';
            writeFileXLSX(newWorkbook, `${outputFileNameBase}.xlsx`);
            toast({ title: 'Conversion Successful!', description: `${outputFileNameBase}.xlsx has been downloaded.` });
          } catch (excelError: any) {
            console.error('Error converting AI-generated CSV to Excel:', excelError);
            setAiMessage(`AI generated CSV, but it could not be converted to Excel. Error: ${excelError.message}. You can try copying the CSV data below.`);
            toast({
              variant: 'destructive',
              title: 'Excel Conversion Failed for AI CSV',
              description: 'The CSV data extracted by AI might be malformed. See details and CSV output below.',
              duration: 7000,
            });
          }
        } else {
          // Handle specific messages from AI
          if (result.csvText === NO_TABULAR_DATA_MESSAGE) {
            setAiMessage('AI analysis complete: No clear tabular data was found in the XML.');
          } else if (result.csvText === INVALID_XML_MESSAGE) {
            setAiMessage('AI analysis complete: The XML input appears to be invalid or malformed.');
          } else if (result.csvText === AI_PROCESSING_ERROR_MESSAGE) {
            setAiMessage('AI processing error: The AI model failed to return output for the XML.');
          } else if (result.csvText === AI_EXPLANATION_MESSAGE && result.message) {
             setAiMessage(`AI returned an explanation: ${result.message}`);
          } else {
            setAiMessage(result.message || 'AI could not process the XML into a usable CSV format.');
          }
          toast({
            variant: result.csvText === NO_TABULAR_DATA_MESSAGE || result.csvText === INVALID_XML_MESSAGE ? 'default' : 'destructive',
            title: 'AI Processing Note',
            description: aiMessage || result.message || 'Check the message below for details.',
            duration: 7000,
          });
        }
      } catch (error: any) {
        console.error('Error processing XML with AI:', error);
        setAiMessage(`An unexpected error occurred: ${error.message}`);
        toast({
          variant: 'destructive',
          title: 'Processing Error',
          description: error.message || 'An unexpected error occurred during XML processing.',
        });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      toast({ variant: 'destructive', title: 'File Read Error', description: 'Failed to read the XML file.' });
      setIsProcessing(false);
    };
    reader.readAsText(xmlFile);
  };
  
  const handleCopyCsv = () => {
    if (!extractedCsvText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'No CSV data available to copy.' });
      return;
    }
    navigator.clipboard.writeText(extractedCsvText);
    toast({ title: 'Copied to Clipboard!', description: 'Extracted CSV data copied.' });
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <DatabaseZap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">XML to Excel Converter (AI Assisted)</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload an XML file. AI will attempt to extract tabular data and convert it to an Excel (.xlsx) spreadsheet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div
            className="w-full p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="xml file upload area"
          >
            <UploadCloud className="h-10 w-10 text-primary mb-3" />
            <p className="text-muted-foreground">
              {xmlFileName || 'Click to browse or drag & drop an .xml file'}
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

          <Button onClick={handleConvert} disabled={!xmlFile || isProcessing} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ExcelIcon className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Processing with AI...' : 'Convert to Excel (.xlsx)'}
          </Button>
          
          {aiMessage && (
             <Alert variant={extractedCsvText ? "default" : "destructive"} className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-semibold">AI Processing Result</AlertTitle>
                <AlertDescription>{aiMessage}</AlertDescription>
            </Alert>
          )}

          {extractedCsvText && (
            <div className="space-y-4 pt-6 border-t">
              <Label htmlFor="csvOutput" className="font-medium text-base">Intermediate CSV Data (Extracted by AI):</Label>
              <Textarea
                id="csvOutput"
                value={extractedCsvText}
                readOnly
                rows={8}
                className="min-h-[150px] bg-muted/30 font-mono text-sm"
                placeholder="CSV data extracted by AI will appear here..."
              />
              <Button onClick={handleCopyCsv} variant="outline" className="w-full sm:w-auto">
                  <Copy className="mr-2 h-4 w-4" /> Copy CSV Data
              </Button>
            </div>
          )}
          
          <Alert variant="default" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">How It Works & Limitations</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p>This tool uses Artificial Intelligence to analyze your XML file and attempt to find and extract the main tabular data within it. This data is first converted to CSV format by the AI.</p>
              <p>The resulting CSV is then automatically converted into an Excel (.xlsx) file for you to download.</p>
              <p><strong>Limitations:</strong> The AI's ability to correctly interpret and extract data from complex or non-standard XML structures may vary. If the AI cannot find suitable tabular data, or if the generated CSV is malformed, the Excel conversion might fail or produce unexpected results. In such cases, any intermediate CSV data extracted will be shown for manual review.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
           AI-powered XML parsing. Excel conversion via SheetJS/xlsx. Results depend on XML structure.
        </CardFooter>
      </Card>
    </div>
  );
}
