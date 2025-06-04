
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { deletePdfPages, type DeletePdfPagesInput } from '@/ai/flows/delete-pdf-pages-flow';
import { UploadCloud, Trash2 as Trash2Icon, Loader2, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PdfPageDeleterPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [pageNumbers, setPageNumbers] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setPdfFileName(file.name);
        toast({ title: 'PDF Selected', description: `${file.name} is ready.` });
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

  const handleDeletePages = async () => {
    if (!pdfFile) {
      toast({ variant: 'destructive', title: 'No PDF Selected', description: 'Please upload a PDF file.' });
      return;
    }
    if (!pageNumbers.trim()) {
      toast({ variant: 'destructive', title: 'Page Numbers Required', description: 'Please specify which pages to delete.' });
      return;
    }
    if (pageNumbers.toLowerCase().trim() === 'all') {
        toast({ variant: 'destructive', title: 'Invalid Input', description: 'Cannot delete "all" pages. Please specify page numbers or ranges, ensuring at least one page remains.' });
        return;
    }

    setIsProcessing(true);
    toast({ title: 'Deleting PDF Pages...', description: 'Please wait, this might take a moment.' });

    try {
      const pdfDataUri = await readFileAsDataURL(pdfFile);
      const input: DeletePdfPagesInput = { pdfDataUri, pageNumbersToDelete: pageNumbers };
      const result = await deletePdfPages(input);

      if (result.success && result.modifiedPdfDataUri) {
        const link = document.createElement('a');
        link.href = result.modifiedPdfDataUri;
        link.download = `${pdfFileName.replace(/\.pdf$/i, '')}_modified.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'Pages Deleted Successfully!', description: `${result.message} Download has started.` });
      } else {
        toast({ variant: 'destructive', title: 'Deletion Failed', description: result.message });
      }
    } catch (error: any) {
      console.error('Error deleting PDF pages:', error);
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: error.message || 'An unexpected error occurred during the page deletion process.',
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
            <Trash2Icon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">PDF Page Deleter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Remove specific pages or page ranges from your PDF document.
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
            <div className="space-y-2">
              <Label htmlFor="pageNumbersInput" className="font-medium">
                Pages to Delete
              </Label>
              <Input
                id="pageNumbersInput"
                type="text"
                value={pageNumbers}
                onChange={(e) => setPageNumbers(e.target.value)}
                placeholder='e.g., "1,3,5-7", "2-" (not "all")'
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground">
                Enter page numbers or ranges. Ensure at least one page remains.
              </p>
            </div>
          )}

          <Button onClick={handleDeletePages} disabled={!pdfFile || isProcessing || !pageNumbers.trim()} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Trash2Icon className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Processing...' : 'Delete Pages'}
          </Button>

          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">How to Specify Pages for Deletion</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p><strong>Single pages</strong>: e.g., <code>1,3,5</code> deletes pages 1, 3, and 5.</p>
              <p><strong>Ranges</strong>: e.g., <code>2-4</code> deletes pages 2, 3, and 4.</p>
              <p><strong>Open-ended ranges</strong>: e.g., <code>3-</code> deletes page 3 and all subsequent pages.</p>
              <p>Combine them: e.g., <code>1,3-5,7-</code>.</p>
              <p>Page numbering starts from 1. You cannot delete all pages; at least one page must remain.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          Make sure you have a backup of your original PDF if needed.
        </CardFooter>
      </Card>
    </div>
  );
}
