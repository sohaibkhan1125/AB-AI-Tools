
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Loader2, Download, Copy, AlertCircle, DatabaseZap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { convertCsvToXml, type CsvToXmlInput, type CsvToXmlOutput } from '@/ai/flows/csv-to-xml-flow';

export default function ExcelToXmlPage() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelFileName, setExcelFileName] = useState<string>('');
  const [xmlText, setXmlText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setExcelFile(file);
        setExcelFileName(file.name);
        setXmlText('');
        setAiMessage(null);
        toast({ title: 'Excel File Selected', description: `${file.name} is ready for conversion.` });
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a valid .xlsx or .xls file.',
        });
        setExcelFile(null);
        setExcelFileName('');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleConvert = async () => {
    if (!excelFile) {
      toast({ variant: 'destructive', title: 'No Excel File', description: 'Please select an Excel file first.' });
      return;
    }

    setIsProcessing(true);
    setXmlText('');
    setAiMessage(null);
    toast({ title: 'Processing Excel...', description: 'Extracting data and sending to AI for XML conversion. This may take a moment.' });

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) {
        toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read the Excel file content.' });
        setIsProcessing(false);
        return;
      }

      try {
        const workbook: WorkBook = read(arrayBuffer, { type: 'array' });
        if (workbook.SheetNames.length === 0) {
          toast({ variant: 'destructive', title: 'Empty Workbook', description: 'The Excel file has no sheets.' });
          setIsProcessing(false);
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet: WorkSheet = workbook.Sheets[firstSheetName];
        const csvDataFromSheet = utils.sheet_to_csv(worksheet);

        if (!csvDataFromSheet.trim()) {
          toast({ variant: 'destructive', title: 'Empty Sheet', description: `The first sheet (${firstSheetName}) is empty or contains no data.` });
          setIsProcessing(false);
          return;
        }
        
        const aiInput: CsvToXmlInput = { csvText: csvDataFromSheet };
        const aiResult: CsvToXmlOutput = await convertCsvToXml(aiInput);

        if (aiResult.success) {
          setXmlText(aiResult.xmlText);
          toast({ title: 'Conversion Successful!', description: 'Excel data converted to XML by AI.' });
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
        console.error('Error converting Excel to XML:', error);
        setAiMessage(`An unexpected error occurred: ${error.message}`);
        toast({
          variant: 'destructive',
          title: 'Conversion Failed',
          description: error.message || 'Could not convert Excel to XML.',
        });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      toast({ variant: 'destructive', title: 'File Read Error', description: 'Failed to read the Excel file.' });
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(excelFile);
  };

  const handleDownloadXml = () => {
    if (!xmlText) {
      toast({ variant: 'destructive', title: 'Nothing to Download', description: 'Convert an Excel file first.' });
      return;
    }
    const blob = new Blob([xmlText], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const baseName = excelFileName.replace(/\.(xlsx|xls)$/i, '');
    link.download = `${baseName}_sheet1.xml`; 
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
            <DatabaseZap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Excel to XML Converter (AI Assisted)</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload an Excel file. Data from the first sheet will be converted to XML format using AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div
            className="w-full p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="excel file upload area"
          >
            <UploadCloud className="h-10 w-10 text-primary mb-3" />
            <p className="text-muted-foreground">
              {excelFileName || 'Click to browse or drag & drop an .xlsx or .xls file'}
            </p>
            <Input
              type="file"
              accept=".xlsx, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              id="excelUpload"
            />
          </div>

          <Button onClick={handleConvert} disabled={!excelFile || isProcessing} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <DatabaseZap className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Converting with AI...' : 'Convert First Sheet to XML'}
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
              <Label htmlFor="xmlOutput" className="font-medium text-base">Generated XML Data (from first sheet via AI):</Label>
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
              <p>This tool first extracts data from the <strong>first sheet</strong> of your Excel file and converts it to CSV format locally in your browser.</p>
              <p>Then, this CSV data is sent to an AI model, which attempts to convert it into a well-structured XML format.</p>
              <p><strong>Limitations:</strong> The AI's interpretation of how to structure the XML from tabular CSV data may vary. The resulting XML structure is based on common conventions (root element, record elements, field elements named after CSV headers). Complex Excel sheets with merged cells or highly nuanced data might not convert perfectly.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
           Excel parsing via SheetJS/xlsx. XML generation via AI. Results may vary.
        </CardFooter>
      </Card>
    </div>
  );
}
