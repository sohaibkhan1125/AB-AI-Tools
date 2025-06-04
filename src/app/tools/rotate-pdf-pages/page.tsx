
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { rotatePdfPages, type RotatePdfInput } from '@/ai/flows/rotate-pdf-pages-flow';
import { UploadCloud, RotateCw as RotateCwIcon, Loader2, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RotatePdfPagesPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [pageNumbers, setPageNumbers] = useState<string>('all');
  const [rotationAngle, setRotationAngle] = useState<'90' | '180' | '270'>('90');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setPdfFileName(file.name);
        toast({ title: 'PDF Selected', description: `${file.name} is ready for rotation.` });
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a valid .pdf file.',
        });
        setPdfFile(null);
        setPdfFileName('');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleRotate = async () => {
    if (!pdfFile) {
      toast({ variant: 'destructive', title: 'No PDF Selected', description: 'Please upload a PDF file to rotate.' });
      return;
    }
    if (!pageNumbers.trim()) {
      toast({ variant: 'destructive', title: 'Page Numbers Required', description: 'Please specify which pages to rotate.' });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Rotating PDF Pages...', description: 'Please wait, this might take a moment.' });

    try {
      const pdfDataUri = await readFileAsDataURL(pdfFile);
      const input: RotatePdfInput = { pdfDataUri, pageNumbers, rotationAngle };
      const result = await rotatePdfPages(input);

      if (result.success && result.modifiedPdfDataUri) {
        const link = document.createElement('a');
        link.href = result.modifiedPdfDataUri;
        link.download = `${pdfFileName.replace(/\.pdf$/i, '')}_rotated.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'PDF Rotated Successfully!', description: `${result.message} Download has started.` });
      } else {
        toast({ variant: 'destructive', title: 'Rotation Failed', description: result.message });
      }
    } catch (error: any) {
      console.error('Error rotating PDF pages:', error);
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: error.message || 'An unexpected error occurred during the rotation process.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <RotateCwIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Rotate PDF Pages</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Rotate specific pages or all pages in your PDF document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div
            className="w-full p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="pdf file upload area"
          >
            <UploadCloud className="h-10 w-10 text-primary mb-3" />
            <p className="text-muted-foreground">
              {pdfFileName || 'Click to browse or drag & drop a PDF file'}
            </p>
            <Input
              type="file"
              accept="application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              id="pdfUpload"
            />
          </div>

          {pdfFile && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pageNumbersInput" className="font-medium">
                  Pages to Rotate
                </Label>
                <Input
                  id="pageNumbersInput"
                  type="text"
                  value={pageNumbers}
                  onChange={(e) => setPageNumbers(e.target.value)}
                  placeholder='e.g., "all", "1,3,5-7", "2-"'
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground">
                  Enter "all", specific pages (e.g., "1,3"), or ranges (e.g., "2-5", "6-").
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rotationAngleSelect" className="font-medium">
                  Rotation Angle (Clockwise)
                </Label>
                <Select
                  value={rotationAngle}
                  onValueChange={(value: '90' | '180' | '270') => setRotationAngle(value)}
                >
                  <SelectTrigger id="rotationAngleSelect" className="mt-1">
                    <SelectValue placeholder="Select angle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 Degrees</SelectItem>
                    <SelectItem value="180">180 Degrees</SelectItem>
                    <SelectItem value="270">270 Degrees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button onClick={handleRotate} disabled={!pdfFile || isProcessing} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <RotateCwIcon className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Processing...' : 'Rotate PDF'}
          </Button>

          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">How to Specify Pages</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p><strong>all</strong>: Rotates every page in the document.</p>
              <p><strong>Single pages</strong>: e.g., <code>1,3,5</code> rotates pages 1, 3, and 5.</p>
              <p><strong>Ranges</strong>: e.g., <code>2-4</code> rotates pages 2, 3, and 4.</p>
              <p><strong>Open-ended ranges</strong>: e.g., <code>3-</code> rotates page 3 and all subsequent pages.</p>
              <p>Combine them: e.g., <code>1,3-5,7-</code>.</p>
              <p>Page numbering starts from 1.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          Changes are applied to the selected pages. Original file remains untouched.
        </CardFooter>
      </Card>
    </div>
  );
}
