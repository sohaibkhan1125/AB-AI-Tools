
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, SplitSquareHorizontal, Loader2, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SplitCsvPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvFileName, setCsvFileName] = useState<string>('');
  const [rowsPerFile, setRowsPerFile] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setCsvFile(file);
        setCsvFileName(file.name);
        toast({ title: 'CSV File Selected', description: `${file.name} is ready for splitting.` });
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

  const handleSplitCsv = async () => {
    if (!csvFile) {
      toast({ variant: 'destructive', title: 'No CSV File', description: 'Please select a CSV file first.' });
      return;
    }
    if (rowsPerFile <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Rows', description: 'Number of rows per file must be greater than 0.' });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Splitting CSV...', description: 'Please wait while your file is being processed.' });

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      if (!csvText) {
        toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read the CSV file content.' });
        setIsProcessing(false);
        return;
      }

      try {
        const lines = csvText.split(/\r?\n/);
        if (lines.length <= 1) { // Only header or empty
          toast({ variant: 'default', title: 'Not Enough Data', description: 'CSV file has no data rows to split (or only a header).' });
          setIsProcessing(false);
          return;
        }

        const header = lines[0];
        const dataRows = lines.slice(1).filter(line => line.trim() !== ''); // Remove empty lines from data

        if (dataRows.length === 0) {
             toast({ variant: 'default', title: 'No Data Rows', description: 'CSV file has a header but no data rows to split.' });
            setIsProcessing(false);
            return;
        }

        let fileCount = 0;
        for (let i = 0; i < dataRows.length; i += rowsPerFile) {
          const chunk = dataRows.slice(i, i + rowsPerFile);
          const chunkCsv = [header, ...chunk].join('\n');
          
          const blob = new Blob([chunkCsv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const baseFileName = csvFileName.replace(/\.csv$/i, '') || 'split_data';
          link.download = `${baseFileName}_part_${fileCount + 1}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          fileCount++;
        }

        if (fileCount > 0) {
            toast({ title: 'Splitting Successful!', description: `${fileCount} CSV file(s) have been downloaded.` });
        } else {
             toast({ variant: 'default', title: 'No Files Generated', description: 'The CSV might have fewer rows than the split size.' });
        }

      } catch (error: any) {
        console.error('Error splitting CSV:', error);
        toast({
          variant: 'destructive',
          title: 'Splitting Failed',
          description: error.message || 'Could not split the CSV file.',
        });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      toast({ variant: 'destructive', title: 'File Read Error', description: 'Failed to read the CSV file.' });
      setIsProcessing(false);
    };
    reader.readAsText(csvFile);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <SplitSquareHorizontal className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Split CSV File</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload a CSV file and split it into multiple smaller files based on a specified number of rows.
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

          {csvFile && (
            <div className="space-y-2">
              <Label htmlFor="rowsPerFileInput" className="font-medium">
                Rows per Split File (excluding header)
              </Label>
              <Input
                id="rowsPerFileInput"
                type="number"
                min="1"
                value={rowsPerFile}
                onChange={(e) => setRowsPerFile(Math.max(1, parseInt(e.target.value, 10) || 1))}
                placeholder="e.g., 1000"
                className="mt-1"
              />
            </div>
          )}

          <Button onClick={handleSplitCsv} disabled={!csvFile || isProcessing} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <SplitSquareHorizontal className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Splitting...' : 'Split CSV & Download'}
          </Button>
          
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">How It Works</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p>Upload your CSV file and specify how many data rows (excluding the header) you want in each smaller file.</p>
              <p>The header row from your original CSV will be included at the top of each split file.</p>
              <p>The splitting process happens entirely within your browser for speed and privacy. No data is sent to a server.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
           Client-side CSV splitting.
        </CardFooter>
      </Card>
    </div>
  );
}
