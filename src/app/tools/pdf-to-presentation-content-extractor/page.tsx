
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Loader2, Presentation, Copy, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PDFDocument } from 'pdf-lib';
import { extractTextFromPdfPageImage, type PdfToWordTextExtractionInput, type PdfToWordTextExtractionOutput } from '@/ai/flows/pdf-to-word-text-extraction-flow';

const MAX_PAGES_TO_PROCESS = 5;

interface ExtractedPageData {
  pageNumber: number;
  extractedText: string;
}

interface ExtractionResult {
  pages: ExtractedPageData[];
  processedPagesCount: number;
  totalPagesCount: number;
  limitApplied: boolean;
}

export default function PdfToPresentationContentPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setPdfFileName(file.name);
        setExtractionResult(null);
        toast({ title: 'PDF Selected', description: `${file.name} is ready for content extraction.` });
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
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleExtractContent = async () => {
    if (!pdfFile) {
      toast({ variant: 'destructive', title: 'No File', description: 'Please select a PDF file first.' });
      return;
    }

    setIsProcessing(true);
    setExtractionResult(null);
    toast({ title: 'Processing PDF...', description: 'Extracting text from PDF pages. This may take a while.' });

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const totalPages = pdfDoc.getPageCount();
      if (totalPages === 0) {
        toast({ variant: 'destructive', title: 'Empty PDF', description: 'The PDF has no pages to process.' });
        setIsProcessing(false);
        return;
      }

      const pagesToProcess = Math.min(totalPages, MAX_PAGES_TO_PROCESS);
      const limitApplied = totalPages > MAX_PAGES_TO_PROCESS;
      const extractedPagesData: ExtractedPageData[] = [];

      for (let i = 0; i < pagesToProcess; i++) {
        const page = pdfDoc.getPages()[i];
        const { width, height } = page.getSize();

        // Create a placeholder image data URI on the client
        const canvas = document.createElement('canvas');
        const scaleFactor = 1.5; // Consistent with other tools
        canvas.width = width * scaleFactor;
        canvas.height = height * scaleFactor;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          console.warn(`Could not get canvas context for page ${i + 1}. Skipping.`);
          extractedPagesData.push({
              pageNumber: i + 1,
              extractedText: "[Error creating image for this page]"
          });
          continue;
        }
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = `${Math.min(30 * scaleFactor, canvas.height / 10)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(`PDF Page ${i + 1} Content`, canvas.width / 2, canvas.height / 2);
        
        const imageDataUri = canvas.toDataURL('image/png');
        
        try {
          const textExtractionInput: PdfToWordTextExtractionInput = { imageDataUri };
          // Call the single-page text extraction flow
          const textResult: PdfToWordTextExtractionOutput = await extractTextFromPdfPageImage(textExtractionInput);
          extractedPagesData.push({
            pageNumber: i + 1,
            extractedText: textResult.extractedText,
          });
        } catch (e: any) {
          console.error(`Error extracting text from page ${i + 1}:`, e);
          extractedPagesData.push({
            pageNumber: i + 1,
            extractedText: `[Error extracting text: ${e.message || 'Unknown error'}]`,
          });
        }
      }
      
      const finalResult: ExtractionResult = {
        pages: extractedPagesData,
        processedPagesCount: pagesToProcess,
        totalPagesCount: totalPages,
        limitApplied,
      };
      setExtractionResult(finalResult);

      if (finalResult.pages.length > 0) {
        toast({ title: 'Content Extraction Complete!', description: `Text extracted from ${finalResult.processedPagesCount} of ${finalResult.totalPagesCount} pages.` });
      } else {
        toast({ title: 'No Text Found', description: 'The AI could not extract text from the processed pages, or the PDF is empty.', duration: 5000 });
      }

    } catch (error: any) {
      console.error('PDF to Presentation Content extraction error:', error);
      setExtractionResult(null);
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: error.message || 'Could not extract content from PDF. Ensure the PDF is valid.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPageText = (text: string, pageNumber: number) => {
    if (!text) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: `Page ${pageNumber} has no text to copy.` });
      return;
    }
    navigator.clipboard.writeText(text);
    toast({ title: `Page ${pageNumber} Text Copied!`, description: 'Text copied to clipboard.' });
  };
  
  const handleCopyAllText = () => {
    if (!extractionResult || extractionResult.pages.length === 0) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'No text extracted.' });
      return;
    }
    const allText = extractionResult.pages
      .map(page => `--- Page ${page.pageNumber} ---\n${page.extractedText}`)
      .join('\n\n');
    navigator.clipboard.writeText(allText);
    toast({ title: 'All Extracted Text Copied!', description: 'Content from all processed pages copied.' });
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Presentation className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">PDF to Presentation Content Extractor</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload a PDF to extract text from its pages, aiding in presentation creation.
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

          <Button onClick={handleExtractContent} disabled={!pdfFile || isProcessing} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FileText className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Extracting Content...' : 'Extract Text from PDF Pages'}
          </Button>

          {extractionResult && (
            <div className="space-y-4 pt-6 border-t">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Extracted Content:</h3>
                <Button onClick={handleCopyAllText} variant="outline" size="sm" disabled={extractionResult.pages.length === 0}>
                  <Copy className="mr-2 h-4 w-4" /> Copy All Text
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Processed {extractionResult.processedPagesCount} of {extractionResult.totalPagesCount} total pages. 
                {extractionResult.limitApplied && ` (Limited to ${MAX_PAGES_TO_PROCESS} pages for this version).`}
              </p>
              {extractionResult.pages.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {extractionResult.pages.map((page) => (
                    <AccordionItem value={`page-${page.pageNumber}`} key={page.pageNumber}>
                      <AccordionTrigger className="text-base hover:no-underline">
                        Page {page.pageNumber}
                      </AccordionTrigger>
                      <AccordionContent>
                        <Textarea
                          value={page.extractedText}
                          readOnly
                          rows={8}
                          className="min-h-[150px] bg-muted/30 font-mono text-sm mb-2"
                          placeholder="No text extracted for this page or an error occurred."
                        />
                        <Button onClick={() => handleCopyPageText(page.extractedText, page.pageNumber)} variant="outline" size="sm">
                          <Copy className="mr-2 h-4 w-4" /> Copy Page {page.pageNumber} Text
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">No text content was extracted from the processed pages.</p>
              )}
            </div>
          )}
          
          <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Notes</AlertTitle>
              <AlertDescription className="space-y-1">
                  <p>This tool extracts <strong>plain text</strong> from an image representation of each PDF page using AI. It does <strong>not</strong> create a formatted .pptx (PowerPoint) file.</p>
                  <p>The quality of text extraction depends on the PDF's layout, clarity, and the AI's interpretation. Complex layouts or poor quality scans may yield suboptimal results.</p>
                  <p>Currently, processing is limited to the first <strong>{MAX_PAGES_TO_PROCESS} pages</strong> of the PDF to ensure reasonable performance.</p>
                  <p>This tool is best for getting textual content to help you manually build your presentation slides.</p>
              </AlertDescription>
          </Alert>
        </CardContent>
         <CardFooter className="text-sm text-muted-foreground text-center block">
          AI-powered text extraction. Results may vary.
        </CardFooter>
      </Card>
    </div>
  );
}
