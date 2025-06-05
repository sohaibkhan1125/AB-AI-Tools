
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Scissors, Loader2, FileText, AlertCircle } from 'lucide-react';
import { read, utils, writeFileXLSX } from 'xlsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SplitExcelFilePage() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelFileName, setExcelFileName] = useState<string>('');
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setExcelFile(file);
        setExcelFileName(file.name);
        setSheetNames([]);
        setSelectedSheets({});
        toast({ title: 'Excel File Selected', description: `${file.name} is ready.` });

        setIsProcessing(true); // Indicate processing for sheet name extraction
        try {
          const arrayBuffer = await file.arrayBuffer();
          const workbook = read(arrayBuffer, { type: 'array' });
          setSheetNames(workbook.SheetNames);
          const initialSelected: Record<string, boolean> = {};
          workbook.SheetNames.forEach(name => initialSelected[name] = true); // Select all by default
          setSelectedSheets(initialSelected);
          if (workbook.SheetNames.length === 0) {
            toast({ variant: 'destructive', title: 'Empty Workbook', description: 'The selected Excel file has no sheets.' });
          }
        } catch (e) {
          console.error("Error reading Excel file for sheets:", e);
          toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read sheets from the Excel file.' });
          setExcelFile(null);
          setExcelFileName('');
        } finally {
          setIsProcessing(false);
        }
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

  const handleSheetSelectionChange = (sheetName: string, checked: boolean) => {
    setSelectedSheets(prev => ({ ...prev, [sheetName]: checked }));
  };

  const handleSplitSelectedSheets = async () => {
    if (!excelFile) {
      toast({ variant: 'destructive', title: 'No Excel File', description: 'Please upload an Excel file first.' });
      return;
    }

    const sheetsToSplit = Object.entries(selectedSheets).filter(([_, isSelected]) => isSelected).map(([name]) => name);
    if (sheetsToSplit.length === 0) {
      toast({ variant: 'destructive', title: 'No Sheets Selected', description: 'Please select at least one sheet to split.' });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Splitting Excel File...', description: 'Please wait while your file is being processed.' });

    try {
      const arrayBuffer = await excelFile.arrayBuffer();
      const originalWorkbook = read(arrayBuffer, { type: 'array' });
      let filesDownloaded = 0;

      for (const sheetName of sheetsToSplit) {
        const worksheet = originalWorkbook.Sheets[sheetName];
        if (worksheet) {
          const newWorkbook = utils.book_new();
          utils.book_append_sheet(newWorkbook, worksheet, sheetName); // Use original sheet name for the new workbook's sheet
          
          const outputFileName = `${excelFileName.replace(/\.(xlsx|xls)$/i, '')}_${sheetName}.xlsx`;
          writeFileXLSX(newWorkbook, outputFileName);
          filesDownloaded++;
          // Add a small delay to help browsers manage multiple downloads, though writeFileXLSX might handle this.
          await new Promise(resolve => setTimeout(resolve, 200)); 
        }
      }

      if (filesDownloaded > 0) {
        toast({ title: 'Splitting Successful!', description: `${filesDownloaded} sheet(s) have been downloaded as separate Excel files.` });
      } else {
         toast({ variant: 'destructive', title: 'Splitting Failed', description: 'No sheets were processed or downloaded.' });
      }
      
    } catch (error: any) {
      console.error('Error splitting Excel file:', error);
      toast({
        variant: 'destructive',
        title: 'Splitting Failed',
        description: error.message || 'Could not split the Excel file.',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const allSheetsSelected = sheetNames.length > 0 && sheetNames.every(name => selectedSheets[name]);
  const toggleSelectAllSheets = () => {
    const newValue = !allSheetsSelected;
    const newSelectedSheets: Record<string, boolean> = {};
    sheetNames.forEach(name => newSelectedSheets[name] = newValue);
    setSelectedSheets(newSelectedSheets);
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Scissors className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Split Excel File by Sheet</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload an Excel file and split its sheets into separate .xlsx files.
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

          {sheetNames.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="font-medium text-base">Select sheets to split:</Label>
                 <Button variant="link" onClick={toggleSelectAllSheets} className="p-0 h-auto">
                    {allSheetsSelected ? 'Deselect All' : 'Select All'}
                  </Button>
              </div>
              <div className="max-h-60 overflow-y-auto border rounded-md p-4 space-y-2 bg-muted/20">
                {sheetNames.map(name => (
                  <div key={name} className="flex items-center space-x-2 p-2 bg-background rounded shadow-sm">
                    <Checkbox
                      id={`sheet-${name}`}
                      checked={selectedSheets[name] || false}
                      onCheckedChange={(checked) => handleSheetSelectionChange(name, !!checked)}
                    />
                    <Label htmlFor={`sheet-${name}`} className="flex-grow cursor-pointer">{name}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={handleSplitSelectedSheets} 
            disabled={!excelFile || isProcessing || Object.values(selectedSheets).every(v => !v)} 
            className="w-full text-lg py-3"
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Scissors className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Splitting...' : 'Split Selected Sheets'}
          </Button>
          
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">How It Works</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              Upload your Excel file. Sheets found in the workbook will be listed. Select the sheets you want to split. Each selected sheet will be saved as a new, separate Excel (.xlsx) file. This process happens entirely in your browser for privacy and speed.
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

    