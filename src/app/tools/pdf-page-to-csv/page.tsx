
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Loader2, Sheet, Copy, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PDFDocument } from 'pdf-lib';
import { extractTableFromPdfPageImage, type PdfPageToCsvInput } from '@/ai/flows/pdf-page-to-csv-flow';

export default function PdfPageToCsvPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [firstPageImagePreview, setFirstPageImagePreview] = useState<string | null>(null);
  const [csvText, setCsvText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setPdfFileName(file.name);
        setCsvText('');
        setFirstPageImagePreview(null);
        toast({ title: 'PDF Selected', description: `${file.name} is ready.` });
        
        // Generate preview of the first page
        setIsProcessing(true); 
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          if (pdfDoc.getPageCount() > 0) {
            const firstPage = pdfDoc.getPages()[0];
            const { width } = firstPage.getSize();
            
            // Create a temporary canvas to render the page
            const canvas = document.createElement('canvas');
            // Aim for a preview width of ~400px, adjust scale accordingly
            const scale = 400 / width; 
            // Note: Actual rendering for preview is complex with pdf-lib alone.
            // This section is primarily for UI feedback.
            // The real image for AI is generated in handleExtractConvert.
            
            setFirstPageImagePreview('generating_preview'); // Placeholder text
            toast({title: "Preview Note", description: "Actual page preview rendering is complex. Image for AI will be generated on conversion.", duration: 4000})
          } else {
            toast({ variant: 'destructive', title: 'Empty PDF', description: 'The selected PDF has no pages.' });
          }
        } catch (e) {
          console.error("Error processing PDF for preview:", e);
          toast({ variant: 'destructive', title: 'PDF Read Error', description: 'Could not read or process the PDF for preview.' });
          setFirstPageImagePreview(null);
        } finally {
            setIsProcessing(false);
        }

      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a valid .pdf file.',
        });
        setPdfFile(null);
        setPdfFileName('');
        setFirstPageImagePreview(null);
      }
    }
     if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExtractConvert = async () => {
    if (!pdfFile) {
      toast({ variant: 'destructive', title: 'No File', description: 'Please select a PDF file first.' });
      return;
    }

    setIsProcessing(true);
    setCsvText('');
    setFirstPageImagePreview(null); // Clear old preview if any
    toast({ title: 'Processing PDF...', description: 'Generating image of the first page and sending to AI.' });

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      if (pdfDoc.getPageCount() === 0) {
        toast({ variant: 'destructive', title: 'Empty PDF', description: 'The PDF has no pages to process.' });
        setIsProcessing(false);
        return;
      }

      const firstPage = pdfDoc.getPages()[0];
      const { width, height } = firstPage.getSize();

      // Create a canvas and draw placeholder content
      const canvas = document.createElement('canvas');
      const scaleFactor = 2; // Increase resolution for better AI processing
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error("Could not get canvas context.");
      }
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = `${60*scaleFactor}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText("PDF Content (Image)", canvas.width / 2, canvas.height / 2);
      ctx.font = `${30*scaleFactor}px Arial`;
      ctx.fillText(`Page 1 of ${pdfDoc.getPageCount()}`, canvas.width / 2, canvas.height / 2 + (80*scaleFactor) );
      
      const imageDataUri = canvas.toDataURL('image/png'); // Send as PNG
      setFirstPageImagePreview(imageDataUri); // Show the generated image

      const input: PdfPageToCsvInput = { imageDataUri };
      const result = await extractTableFromPdfPageImage(input);
      
      if (result.csvText.toLowerCase().includes("no tabular data found")) {
        toast({ title: 'No Table Found', description: 'The AI could not identify a table on the first page.', duration: 5000 });
      } else {
        toast({ title: 'Extraction Successful!', description: 'CSV data extracted from the first PDF page.' });
      }
      setCsvText(result.csvText);

    } catch (error: any) {
      console.error('PDF to CSV conversion error:', error);
      setCsvText('');
      toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: error.message || 'Could not convert PDF page to CSV. Ensure the PDF is valid and not corrupted.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCsv = () => {
    if (!csvText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'Generate some CSV data first.' });
      return;
    }
    navigator.clipboard.writeText(csvText);
    toast({ title: 'Copied to Clipboard!', description: 'CSV data copied.' });
  };

  const handleDownloadCsv = () => {
    if (!csvText) {
      toast({ variant: 'destructive', title: 'Nothing to Download', description: 'Generate some CSV data first.' });
      return;
    }
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const baseFileName = pdfFileName.substring(0, pdfFileName.lastIndexOf('.')) || 'extracted_data';
    link.download = `${baseFileName}_page1.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Download Started', description: 'Your CSV file is downloading.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Sheet className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">PDF Page to CSV Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload a PDF. The first page will be processed by AI to extract tabular data into CSV format.
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
              {pdfFileName ? `Selected: ${pdfFileName}` : 'Click to browse or drag & drop a .pdf file'}
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

          {firstPageImagePreview && firstPageImagePreview !== 'generating_preview' && (
             <div className="space-y-2">
                <Label className="font-medium">First Page Image (Sent to AI):</Label>
                <div className="border rounded-md p-2 bg-muted/20 overflow-hidden max-w-md mx-auto">
                    <Image 
                        src={firstPageImagePreview} 
                        alt="Preview of PDF first page" 
                        width={400} 
                        height={Math.floor(400 * (11/8.5))} // Approximate A4 aspect ratio for placeholder
                        className="max-w-full h-auto rounded"
                        style={{maxWidth: '100%', height: 'auto', border: '1px solid #ccc'}}
                    />
                </div>
             </div>
          )}
          {firstPageImagePreview === 'generating_preview' && (
            <div className="text-center text-muted-foreground">Generating image preview...</div>
          )}


          <Button onClick={handleExtractConvert} disabled={!pdfFile || isProcessing} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sheet className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Processing...' : 'Extract CSV from First Page'}
          </Button>

          {csvText && (
            <div className="space-y-4 pt-6 border-t">
              <Label htmlFor="csvOutput" className="font-medium text-base">Extracted CSV Data:</Label>
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
            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                    This tool attempts to extract tabular data from an <strong>image representation of the first page</strong> of your PDF using AI.
                    The quality of the extraction depends on the PDF's layout, clarity, and the AI's interpretation.
                    Complex layouts, handwritten text, or very dense tables might not be extracted perfectly. It works best with clear, machine-readable tables.
                    No actual PDF rendering happens client-side for direct preview; a simplified image is generated for AI processing.
                </AlertDescription>
            </Alert>
        </CardContent>
         <CardFooter className="text-sm text-muted-foreground text-center block">
          AI-powered table extraction. Results may vary.
        </CardFooter>
      </Card>
    </div>
  );
}
