
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, FileSpreadsheet as ExcelIcon, Loader2, Download, Copy, AlertCircle } from 'lucide-react';
import { read, utils, WorkBook, WorkSheet } from 'xlsx'; // Import types as well
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ExcelToCsvPage() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelFileName, setExcelFileName] = useState<string>('');
  const [csvText, setCsvText] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setExcelFile(file);
        setExcelFileName(file.name);
        setCsvText(''); // Clear previous results
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

  const handleConvert = () => {
    if (!excelFile) {
      toast({ variant: 'destructive', title: 'No Excel File', description: 'Please select an Excel file first.' });
      return;
    }

    setIsConverting(true);
    setCsvText('');
    toast({ title: 'Converting to CSV...', description: 'Please wait while your file is being processed.' });

    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) {
        toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read the Excel file content.' });
        setIsConverting(false);
        return;
      }

      try {
        const workbook: WorkBook = read(arrayBuffer, { type: 'array' });
        if (workbook.SheetNames.length === 0) {
          toast({ variant: 'destructive', title: 'Empty Workbook', description: 'The Excel file has no sheets.' });
          setIsConverting(false);
          return;
        }

        // Convert the first sheet to CSV
        const firstSheetName = workbook.SheetNames[0];
        const worksheet: WorkSheet = workbook.Sheets[firstSheetName];
        const generatedCsv = utils.sheet_to_csv(worksheet);
        
        setCsvText(generatedCsv);
        toast({ title: 'Conversion Successful!', description: `First sheet (${firstSheetName}) converted to CSV.` });
      } catch (error: any) {
        console.error('Error converting Excel to CSV:', error);
        toast({
          variant: 'destructive',
          title: 'Conversion Failed',
          description: error.message || 'Could not convert Excel to CSV. Please ensure the file is not corrupted.',
        });
      } finally {
        setIsConverting(false);
      }
    };
    reader.onerror = () => {
      toast({ variant: 'destructive', title: 'File Read Error', description: 'Failed to read the Excel file.' });
      setIsConverting(false);
    };
    reader.readAsArrayBuffer(excelFile);
  };

  const handleDownloadCsv = () => {
    if (!csvText) {
      toast({ variant: 'destructive', title: 'Nothing to Download', description: 'Convert an Excel file first.' });
      return;
    }
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Derive CSV filename from Excel filename + (first) sheet name (if available)
    const baseName = excelFileName.replace(/\.(xlsx|xls)$/i, '');
    // Assuming workbook object is not stored, we can't easily get sheet name here without re-reading.
    // For simplicity, just use base name. Could be enhanced if sheet name is stored during conversion.
    link.download = `${baseName}_sheet1.csv`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Download Started', description: 'Your CSV file is downloading.' });
  };

  const handleCopyCsv = () => {
    if (!csvText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'No CSV data to copy.' });
      return;
    }
    navigator.clipboard.writeText(csvText);
    toast({ title: 'Copied to Clipboard!', description: 'CSV data copied.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <ExcelIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Excel to CSV Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload your Excel file (.xlsx, .xls) to convert its first sheet into CSV format.
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

          <Button onClick={handleConvert} disabled={!excelFile || isConverting} className="w-full text-lg py-3">
            {isConverting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ExcelIcon className="mr-2 h-5 w-5" />
            )}
            {isConverting ? 'Converting...' : 'Convert First Sheet to CSV'}
          </Button>
          
          {csvText && (
            <div className="space-y-4 pt-6 border-t">
              <Label htmlFor="csvOutput" className="font-medium text-base">Generated CSV Data (from first sheet):</Label>
              <Textarea
                id="csvOutput"
                value={csvText}
                readOnly
                rows={10}
                className="min-h-[200px] bg-muted/30 font-mono text-sm"
                placeholder="Your CSV output will appear here..."
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleCopyCsv} variant="outline" className="w-full sm:flex-1">
                  <Copy className="mr-2 h-4 w-4" /> Copy CSV
                </Button>
                <Button onClick={handleDownloadCsv} variant="outline" className="w-full sm:flex-1">
                  <Download className="mr-2 h-4 w-4" /> Download .csv File
                </Button>
              </div>
            </div>
          )}
          
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">How It Works</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              This tool converts the <strong>first sheet</strong> of your uploaded Excel file into CSV (Comma Separated Values) format. The conversion happens entirely within your browser.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
           Powered by SheetJS/xlsx. Client-side conversion.
        </CardFooter>
      </Card>
    </div>
  );
}

