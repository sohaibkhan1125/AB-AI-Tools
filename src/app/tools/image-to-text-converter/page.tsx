
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Loader2, ScanText, Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { extractTextFromPdfPageImage, type PdfToWordTextExtractionInput } from '@/ai/flows/pdf-to-word-text-extraction-flow'; // Reusing this flow

export default function ImageToTextConverterPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setExtractedText('');
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        toast({ title: 'Image Selected', description: `${file.name} is ready for text extraction.` });
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a valid image file (e.g., JPG, PNG, WEBP).',
        });
        setImageFile(null);
        setImagePreview(null);
      }
    }
     if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleExtractText = async () => {
    if (!imageFile || !imagePreview) {
      toast({ variant: 'destructive', title: 'No Image', description: 'Please select an image file first.' });
      return;
    }

    setIsProcessing(true);
    setExtractedText('');
    toast({ title: 'Processing Image...', description: 'Sending image to AI for text extraction.' });

    try {
      const input: PdfToWordTextExtractionInput = { imageDataUri: imagePreview }; // The flow expects this input structure
      const result = await extractTextFromPdfPageImage(input);
      
      setExtractedText(result.extractedText);
      if (result.extractedText.trim().length > 0) {
        toast({ title: 'Text Extraction Successful!', description: 'Text extracted from the image.' });
      } else {
        toast({ title: 'No Text Found', description: 'The AI could not extract text from the image, or the image is empty of text.', duration: 5000 });
      }

    } catch (error: any) {
      console.error('Image to Text conversion error:', error);
      setExtractedText('');
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: error.message || 'Could not extract text from image. The AI might not support this image or an error occurred.',
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
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <ScanText className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Image to Text Converter (OCR)</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload an image (JPG, PNG, WEBP) to extract text using Optical Character Recognition.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div
            className="w-full p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="image file upload area"
          >
            <UploadCloud className="h-10 w-10 text-primary mb-3" />
            <p className="text-muted-foreground">
              {imageFile ? `Selected: ${imageFile.name}` : 'Click to browse or drag & drop an image file'}
            </p>
             <p className="text-xs text-muted-foreground/70 mt-1">
              Supports JPG, PNG, WEBP, etc.
            </p>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              id="imageUpload"
            />
          </div>

          {imagePreview && (
             <div className="space-y-2">
                <Label className="font-medium">Image Preview:</Label>
                <div className="border rounded-md p-2 bg-muted/20 overflow-hidden max-w-md mx-auto">
                    <Image 
                        src={imagePreview} 
                        alt="Uploaded image preview" 
                        width={400} 
                        height={300} // Adjust as needed or make dynamic
                        className="max-w-full h-auto rounded object-contain"
                        style={{maxHeight: '300px'}}
                        data-ai-hint="uploaded image"
                    />
                </div>
             </div>
          )}

          <Button onClick={handleExtractText} disabled={!imageFile || isProcessing} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ScanText className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Extracting Text...' : 'Extract Text from Image'}
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
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                    This tool uses AI to extract text from the uploaded image.
                    The quality of the extraction depends on the image's clarity, font, and the AI's interpretation.
                    Complex layouts, handwritten text, or very low-resolution images might not be extracted perfectly.
                </AlertDescription>
            </Alert>
        </CardContent>
         <CardFooter className="text-sm text-muted-foreground text-center block">
          AI-powered OCR. Results may vary.
        </CardFooter>
      </Card>
    </div>
  );
}
