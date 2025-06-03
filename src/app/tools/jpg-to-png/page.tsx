
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Download, Replace } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface OriginalImageState {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

export default function JpgToPngPage() {
  const [originalImage, setOriginalImage] = useState<OriginalImageState | null>(null);
  const [convertedPngPreview, setConvertedPngPreview] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [fileName, setFileName] = useState('converted_image');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
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
          setConvertedPngPreview(null); 
          setFileName(file.name.split('.').slice(0, -1).join('.') + '_converted');
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid JPG or JPEG image file.',
      });
      setOriginalImage(null);
      setConvertedPngPreview(null);
    }
  };

  const convertToPng = () => {
    if (!originalImage) {
      toast({
        variant: 'destructive',
        title: 'No Image',
        description: 'Please upload a JPG/JPEG image first.',
      });
      return;
    }

    setIsConverting(true);
    toast({ title: 'Processing', description: 'Converting your image to PNG...' });

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL('image/png');
        setConvertedPngPreview(pngDataUrl);
        toast({ title: 'Success', description: 'Image converted to PNG successfully.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not process image.' });
      }
      setIsConverting(false);
    };
    img.onerror = () => {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load image for conversion.' });
      setIsConverting(false);
    };
    img.src = originalImage.dataUrl;
  };

  const handleDownload = () => {
    if (!convertedPngPreview) {
      toast({ variant: 'destructive', title: 'No Image', description: 'No converted PNG image to download.' });
      return;
    }
    const link = document.createElement('a');
    link.href = convertedPngPreview;
    link.download = `${fileName || 'converted_image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Downloaded', description: 'Converted PNG image saved.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Replace className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">JPG to PNG Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Convert your JPG or JPEG images to PNG format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div
            className="w-full p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="jpg upload area"
          >
            <UploadCloud className="h-12 w-12 text-primary mb-4" />
            <p className="text-muted-foreground mb-2">
              Click to browse or drag & drop a JPG/JPEG image here
            </p>
            <p className="text-xs text-muted-foreground/70">
              Supports JPG/JPEG format
            </p>
            <Input
              type="file"
              accept="image/jpeg,image/jpg"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
              id="imageUpload"
            />
          </div>

          {originalImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Original JPG/JPEG</h3>
                <div className="border rounded-md p-2 bg-muted/20 overflow-hidden">
                  <Image 
                    src={originalImage.dataUrl} 
                    alt="Original JPG/JPEG preview" 
                    width={originalImage.width} 
                    height={originalImage.height} 
                    className="max-w-full h-auto rounded" 
                    style={{maxWidth: '100%', height: 'auto'}}
                  />
                   <p className="text-sm text-muted-foreground mt-2 text-center">
                    Dimensions: {originalImage.width} x {originalImage.height}px
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="fileName" className="font-medium">Output File Name (without extension)</Label>
                  <Input id="fileName" type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="converted_image" className="mt-1" />
                </div>
                <Button onClick={convertToPng} disabled={isConverting || !originalImage} className="w-full">
                  <Replace className={`mr-2 h-5 w-5 ${isConverting ? 'animate-spin' : ''}`} />
                  {isConverting ? 'Converting...' : 'Convert to PNG'}
                </Button>
              </div>
            </div>
          )}

          {convertedPngPreview && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold text-foreground text-center">Converted PNG Preview</h3>
              <div className="border rounded-md p-2 bg-muted/20 overflow-hidden max-w-md mx-auto">
                 <Image 
                    src={convertedPngPreview} 
                    alt="Converted PNG preview" 
                    width={originalImage?.width || 300} 
                    height={originalImage?.height || 200} 
                    className="max-w-full h-auto rounded"
                    style={{maxWidth: '100%', height: 'auto'}}
                />
                 <p className="text-sm text-muted-foreground mt-2 text-center">
                    Preview of {fileName}.png
                  </p>
              </div>
              <Button onClick={handleDownload} className="w-full max-w-md mx-auto block">
                <Download className="mr-2 h-5 w-5" />
                Download PNG
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
