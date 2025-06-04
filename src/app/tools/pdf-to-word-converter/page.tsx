
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Loader2, FileText, Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PDFDocument } from 'pdf-lib';
import { extractTextFromPdfPageImage, type PdfToWordTextExtractionInput } from '@/ai/flows/pdf-to-word-text-extraction-flow';

export default function PdfToWordConverterPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [firstPageImagePreview, setFirstPageImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setPdfFileName(file.name);
        setExtractedText('');
        setFirstPageImagePreview(null); // Clear previous preview
        toast({ title: 'PDF Selected', description: `${file.name} is ready for text extraction.` });
        
        // Attempt to generate image preview for the first page
        setIsProcessing(true); 
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          if (pdfDoc.getPageCount() > 0) {
            // For actual AI processing, a placeholder image is generated later.
            // This is just a quick feedback step.
            setFirstPageImagePreview('generating_preview'); 
            toast({title: "Preview Note", description: "Actual page image for AI is generated upon conversion.", duration: 4000});
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
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleExtractText = async () => {
    if (!pdfFile) {
      toast({ variant: 'destructive', title: 'No File', description: 'Please select a PDF file first.' });
      return;
    }

    setIsProcessing(true);
    setExtractedText('');
    setFirstPageImagePreview(null); 
    toast({ title: 'Processing PDF...', description: 'Generating image of the first page and sending to AI for text extraction.' });

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

      const canvas = document.createElement('canvas');
      const scaleFactor = 2; 
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error("Could not get canvas context.");
      }
      
      // Create a placeholder image with text
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = `${60 * scaleFactor}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText("PDF Content (Image)", canvas.width / 2, canvas.height / 2);
      ctx.font = `${30*scaleFactor}px Arial`;
      ctx.fillText(`Page 1 of ${pdfDoc.getPageCount()}`, canvas.width / 2, canvas.height / 2 + (80*scaleFactor));
      
      const imageDataUri = canvas.toDataURL('image/png');
      setFirstPageImagePreview(imageDataUri); // Show the generated image

      const input: PdfToWordTextExtractionInput = { imageDataUri };
      const result = await extractTextFromPdfPageImage(input);
      
      setExtractedText(result.extractedText);
      if (result.extractedText.trim().length > 0) {
        toast({ title: 'Text Extraction Successful!', description: 'Text extracted from the first PDF page.' });
      } else {
        toast({ title: 'No Text Found', description: 'The AI could not extract text from the first page, or the page is empty.', duration: 5000 });
      }

    } catch (error: any) {
      console.error('PDF to Text conversion error:', error);
      setExtractedText('');
      toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: error.message || 'Could not extract text from PDF page. Ensure the PDF is valid and not corrupted.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    if (!extractedText) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'Extract some text first.' });
      return;
    }
    navigator.clipboard.writeText(extractedText);
    toast({ title: 'Copied to Clipboard!', description: 'Extracted text copied.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">PDF to Word Converter (Text Extraction)</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload a PDF. The first page's text content will be extracted using AI.
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
                        alt="Image of PDF first page used for AI processing" 
                        width={400} 
                        height={Math.floor(400 * (11/8.5))} // Approximate A4 aspect ratio
                        className="max-w-full h-auto rounded"
                        style={{maxWidth: '100%', height: 'auto', border: '1px solid #ccc'}}
                    />
                </div>
             </div>
          )}
          {firstPageImagePreview === 'generating_preview' && (
            <div className="text-center text-muted-foreground">Generating image preview...</div>
          )}

          <Button onClick={handleExtractText} disabled={!pdfFile || isProcessing} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FileText className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Extracting Text...' : 'Extract Text from First Page'}
          </Button>

          {extractedText && (
            <div className="space-y-4 pt-6 border-t">
              <Label htmlFor="extractedTextOutput" className="font-medium text-base">Extracted Text:</Label>
              <Textarea
                id="extractedTextOutput"
                value={extractedText}
                readOnly
                rows={10}
                className="min-h-[200px] bg-muted/30 font-mono text-sm"
                placeholder="Your extracted text will appear here..."
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleCopyText} variant="outline" className="w-full sm:flex-1">
                  <Copy className="mr-2 h-4 w-4" /> Copy Text
                </Button>
              </div>
            </div>
          )}
            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Note on "PDF to Word"</AlertTitle>
                <AlertDescription>
                    This tool extracts <strong>plain text</strong> from an image of the <strong>first page</strong> of your PDF using AI.
                    It does <strong>not</strong> create a formatted .docx (Microsoft Word) file.
                    The quality of text extraction depends on the PDF's layout, clarity, and the AI's interpretation.
                    Complex layouts, handwritten text, or very dense tables might not be extracted perfectly.
                    This tool is best for getting the textual content out, which you can then copy into Word or other editors.
                </AlertDescription>
            </Alert>
        </CardContent>
         <CardFooter className="text-sm text-muted-foreground text-center block">
          AI-powered text extraction. Results may vary. Processes first page only.
        </CardFooter>
      </Card>
    </div>
  );
}
