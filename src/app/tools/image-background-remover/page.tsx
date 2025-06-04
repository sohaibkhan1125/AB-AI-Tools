
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Download, Eraser, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { removeImageBackground, type RemoveImageBackgroundInput, type RemoveImageBackgroundOutput } from '@/ai/flows/remove-image-background-flow';

interface OriginalImageState {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

const checkerboardStyle = {
  backgroundImage:
    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
};

export default function AiImageBackgroundRemoverPage() {
  const [originalImage, setOriginalImage] = useState<OriginalImageState | null>(null);
  const [processedImage, setProcessedImage] = useState<RemoveImageBackgroundOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          setOriginalImage({
            file,
            dataUrl: e.target?.result as string,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          setProcessedImage(null); // Clear previous result
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid image file (e.g., PNG, JPG).',
      });
      setOriginalImage(null);
      setProcessedImage(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) {
      toast({ variant: 'destructive', title: 'No Image', description: 'Please upload an image first.' });
      return;
    }

    setIsLoading(true);
    setProcessedImage(null);
    toast({ title: 'Processing Image...', description: 'The AI is attempting to remove the background. This might take a moment.' });

    try {
      const input: RemoveImageBackgroundInput = { imageDataUri: originalImage.dataUrl };
      const result = await removeImageBackground(input);
      setProcessedImage(result);
      toast({ title: 'Background Removal Attempt Complete!', description: 'Check the result below.' });
    } catch (error: any) {
      console.error('Background removal error:', error);
      setProcessedImage(null);
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: error.message || 'Could not remove background. The AI might not support this image or request.',
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage || !processedImage.processedImageDataUri) {
      toast({ variant: 'destructive', title: 'Nothing to Download', description: 'Process an image first.' });
      return;
    }
    const link = document.createElement('a');
    link.href = processedImage.processedImageDataUri;
    
    // Try to infer extension, default to png
    const mimeTypeMatch = processedImage.processedImageDataUri.match(/data:image\/([^;]+);/);
    const extension = mimeTypeMatch && mimeTypeMatch[1] ? mimeTypeMatch[1] : 'png';
    const originalFileName = originalImage?.file.name.split('.').slice(0, -1).join('.') || 'image';
    
    link.download = `${originalFileName}_bg_removed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Download Started', description: 'Your processed image is downloading.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Eraser className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">AI Image Background Remover</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload an image and let AI try to remove its background, making it transparent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div
            className="w-full p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="image upload area"
          >
            <UploadCloud className="h-12 w-12 text-primary mb-4" />
            <p className="text-muted-foreground mb-2">
              Click to browse or drag & drop an image
            </p>
            <p className="text-xs text-muted-foreground/70">
              Supports common image formats (PNG, JPG, WEBP).
            </p>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
              id="imageUpload"
            />
          </div>

          {originalImage && (
            <div className="text-center">
              <Button onClick={handleRemoveBackground} disabled={isLoading} className="text-lg py-3 px-6">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Eraser className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Processing...' : 'Remove Background with AI'}
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="mt-8 text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground mt-2">The AI is working... This can take up to 30 seconds or more.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-8">
            {originalImage && (
              <div className="space-y-2">
                <Label className="text-center block font-semibold text-lg">Original Image</Label>
                <div className="border rounded-md p-2 bg-muted/20 overflow-hidden aspect-square flex items-center justify-center">
                  <Image
                    src={originalImage.dataUrl}
                    alt="Original image"
                    width={originalImage.width}
                    height={originalImage.height}
                    className="max-w-full max-h-full h-auto rounded object-contain"
                  />
                </div>
              </div>
            )}

            {processedImage?.processedImageDataUri && !isLoading && (
              <div className="space-y-2">
                <Label className="text-center block font-semibold text-lg">Processed Image</Label>
                <div className="border rounded-md p-2 bg-muted/20 overflow-hidden aspect-square flex items-center justify-center" style={checkerboardStyle}>
                  <Image
                    src={processedImage.processedImageDataUri}
                    alt="Processed image with background removed"
                    width={originalImage?.width || 500} // Use original width for layout consistency
                    height={originalImage?.height || 500} // Use original height
                    className="max-w-full max-h-full h-auto rounded object-contain"
                    data-ai-hint="transparent background"
                  />
                </div>
                <Button onClick={handleDownload} className="w-full mt-4" variant="outline">
                  <Download className="mr-2 h-5 w-5" /> Download Processed Image
                </Button>
              </div>
            )}
          </div>
          
          <Alert variant="default" className="mt-8">
            <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
            <AlertTitle className="font-semibold">Important Considerations</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p>This tool uses AI to attempt background removal. The quality can vary greatly depending on the image's complexity, contrast between subject and background, and other factors.</p>
              <p>Results are best for images with clear, well-defined subjects.</p>
              <p>The AI will try to output a PNG image with a transparent background. If the original image was a JPG, the result will still be a PNG to support transparency.</p>
              <p>Processing can take some time, please be patient.</p>
              <p>The AI has safety filters. Prompts or images might be blocked if they violate content policies.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
         <CardFooter className="text-sm text-muted-foreground text-center block">
          Powered by AI. Use responsibly.
        </CardFooter>
      </Card>
    </div>
  );
}
