
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, FileSpreadsheet as ExcelIcon, Loader2, Download, AlertCircle } from 'lucide-react';
import { read, utils, writeFileXLSX } from 'xlsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CsvToExcelPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvFileName, setCsvFileName] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setCsvFile(file);
        setCsvFileName(file.name);
        toast({ title: 'CSV File Selected', description: `${file.name} is ready for conversion.` });
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleConvert = () => {
    if (!csvFile) {
      toast({ variant: 'destructive', title: 'No CSV File', description: 'Please select a CSV file first.' });
      return;
    }

    setIsConverting(true);
    toast({ title: 'Converting to Excel...', description: 'Please wait while your file is being processed.' });

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      if (!csvText) {
        toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read the CSV file content.' });
        setIsConverting(false);
        return;
      }

      try {
        // Parse CSV text into a workbook object
        const parsedWorkbook = read(csvText, { type: 'string', rawNumbers: false });
        
        // Assuming the first sheet is the one we care about
        const firstSheetName = parsedWorkbook.SheetNames[0];
        const worksheet = parsedWorkbook.Sheets[firstSheetName];

        // Create a new workbook to ensure a clean XLSX structure
        const newWorkbook = utils.book_new();
        utils.book_append_sheet(newWorkbook, worksheet, "Sheet1"); // Use the parsed worksheet

        // Generate XLSX and trigger download
        const outputFileName = `${csvFileName.replace(/\.csv$/i, '') || 'converted_data'}.xlsx`;
        writeFileXLSX(newWorkbook, outputFileName);

        toast({ title: 'Conversion Successful!', description: `${outputFileName} has been downloaded.` });
      } catch (error: any) {
        console.error('Error converting CSV to Excel:', error);
        toast({
          variant: 'destructive',
          title: 'Conversion Failed',
          description: error.message || 'Could not convert CSV to Excel. Please ensure the CSV is well-formatted.',
        });
      } finally {
        setIsConverting(false);
      }
    };
    reader.onerror = () => {
      toast({ variant: 'destructive', title: 'File Read Error', description: 'Failed to read the CSV file.' });
      setIsConverting(false);
    };
    reader.readAsText(csvFile);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <ExcelIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">CSV to Excel Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload your CSV file to convert it into an Excel (.xlsx) spreadsheet.
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
              {csvFileName || 'Click to browse or drag & drop a .csv file'}
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

          <Button onClick={handleConvert} disabled={!csvFile || isConverting} className="w-full text-lg py-3">
            {isConverting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Download className="mr-2 h-5 w-5" />
            )}
            {isConverting ? 'Converting...' : 'Convert to Excel (.xlsx) & Download'}
          </Button>
          
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">How It Works</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              This tool converts your CSV (Comma Separated Values) file into an Excel Open XML Spreadsheet Format (.xlsx) file. The conversion happens entirely within your browser for speed and privacy. No data is sent to a server.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
           Powered by SheetJS/xlsx. Conversion is done client-side.
        </CardFooter>
      </Card>
    </div>
  );
}
