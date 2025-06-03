
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Download, Replace, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface OriginalImageState {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

export default function PngToJpgPage() {
  const [originalImage, setOriginalImage] = useState<OriginalImageState | null>(null);
  const [convertedJpgPreview, setConvertedJpgPreview] = useState<string | null>(null);
  const [imageQuality, setImageQuality] = useState(0.92); // Default JPG quality
  const [isConverting, setIsConverting] = useState(false);
  const [fileName, setFileName] = useState('converted_image');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/png') {
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
          setConvertedJpgPreview(null); 
          setFileName(file.name.split('.').slice(0, -1).join('.') + '_converted');
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid PNG image file.',
      });
      setOriginalImage(null);
      setConvertedJpgPreview(null);
    }
  };

  const convertToJpg = () => {
    if (!originalImage) {
      toast({
        variant: 'destructive',
        title: 'No Image',
        description: 'Please upload a PNG image first.',
      });
      return;
    }

    setIsConverting(true);
    toast({ title: 'Processing', description: 'Converting your image to JPG...' });

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Fill background with white for transparency handling in PNG to JPG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const jpgDataUrl = canvas.toDataURL('image/jpeg', imageQuality);
        setConvertedJpgPreview(jpgDataUrl);
        toast({ title: 'Success', description: 'Image converted to JPG successfully.' });
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
    if (!convertedJpgPreview) {
      toast({ variant: 'destructive', title: 'No Image', description: 'No converted JPG image to download.' });
      return;
    }
    const link = document.createElement('a');
    link.href = convertedJpgPreview;
    link.download = `${fileName || 'converted_image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Downloaded', description: 'Converted JPG image saved.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Replace className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">PNG to JPG Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Convert your PNG images to JPG format with adjustable quality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div
            className="w-full p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="png upload area"
          >
            <UploadCloud className="h-12 w-12 text-primary mb-4" />
            <p className="text-muted-foreground mb-2">
              Click to browse or drag & drop a PNG image here
            </p>
            <p className="text-xs text-muted-foreground/70">
              Supports PNG format
            </p>
            <Input
              type="file"
              accept="image/png"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
              id="imageUpload"
            />
          </div>

          {originalImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Original PNG</h3>
                <div className="border rounded-md p-2 bg-muted/20 overflow-hidden">
                  <Image 
                    src={originalImage.dataUrl} 
                    alt="Original PNG preview" 
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
                <div>
                  <Label htmlFor="imageQuality" className="font-medium flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground"/>JPG Quality</Label>
                  <div className="flex items-center gap-2 mt-1">
                      <Slider
                          id="imageQuality"
                          min={0.1} max={1} step={0.01}
                          value={[imageQuality]}
                          onValueChange={(value) => setImageQuality(value[0])}
                          className="flex-grow"
                      />
                      <span className="text-sm text-muted-foreground w-12 text-right">{(imageQuality * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <Button onClick={convertToJpg} disabled={isConverting || !originalImage} className="w-full">
                  <Replace className={`mr-2 h-5 w-5 ${isConverting ? 'animate-spin' : ''}`} />
                  {isConverting ? 'Converting...' : 'Convert to JPG'}
                </Button>
              </div>
            </div>
          )}

          {convertedJpgPreview && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold text-foreground text-center">Converted JPG Preview</h3>
              <div className="border rounded-md p-2 bg-muted/20 overflow-hidden max-w-md mx-auto">
                 <Image 
                    src={convertedJpgPreview} 
                    alt="Converted JPG preview" 
                    width={originalImage?.width || 300} 
                    height={originalImage?.height || 200} 
                    className="max-w-full h-auto rounded"
                    style={{maxWidth: '100%', height: 'auto'}}
                />
                 <p className="text-sm text-muted-foreground mt-2 text-center">
                    Preview of {fileName}.jpg
                  </p>
              </div>
              <Button onClick={handleDownload} className="w-full max-w-md mx-auto block">
                <Download className="mr-2 h-5 w-5" />
                Download JPG
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
