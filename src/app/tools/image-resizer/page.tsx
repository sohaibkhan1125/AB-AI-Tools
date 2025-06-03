
'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Download, RefreshCw, Link2, Palette, FileType, Scaling } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface OriginalImageState {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

export default function ImageResizerPage() {
  const [originalImage, setOriginalImage] = useState<OriginalImageState | null>(null);
  const [resizedImagePreview, setResizedImagePreview] = useState<string | null>(null);
  const [targetWidth, setTargetWidth] = useState<number | string>('');
  const [targetHeight, setTargetHeight] = useState<number | string>('');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [outputFormat, setOutputFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [imageQuality, setImageQuality] = useState(0.92);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('resized_image');
  
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
          setTargetWidth(img.naturalWidth);
          setTargetHeight(img.naturalHeight);
          setResizedImagePreview(null); 
          setFileName(file.name.split('.').slice(0, -1).join('.') + '_resized');
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid image file (PNG, JPG, WEBP, GIF).',
      });
    }
  };

  const handleDimensionChange = (value: string, type: 'width' | 'height') => {
    const numValue = parseInt(value, 10);
    if (type === 'width') {
      setTargetWidth(value === '' ? '' : numValue);
      if (keepAspectRatio && originalImage && originalImage.width > 0 && !isNaN(numValue) && numValue > 0) {
        setTargetHeight(Math.round((numValue / originalImage.width) * originalImage.height));
      }
    } else {
      setTargetHeight(value === '' ? '' : numValue);
      if (keepAspectRatio && originalImage && originalImage.height > 0 && !isNaN(numValue) && numValue > 0) {
        setTargetWidth(Math.round((numValue / originalImage.height) * originalImage.width));
      }
    }
  };
  
  useEffect(() => {
    if (keepAspectRatio && originalImage && typeof targetWidth === 'number' && targetWidth > 0 && originalImage.width > 0) {
        // This effect is primarily for when keepAspectRatio is toggled ON.
        // Recalculate height based on current width if aspect ratio is kept.
    }
  }, [keepAspectRatio, originalImage]);


  const resizeImage = () => {
    if (!originalImage || typeof targetWidth !== 'number' || typeof targetHeight !== 'number' || targetWidth <= 0 || targetHeight <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Dimensions',
        description: 'Please ensure the image is uploaded and dimensions are valid positive numbers.',
      });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Processing', description: 'Resizing your image...' });

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const resizedDataUrl = canvas.toDataURL(outputFormat, outputFormat === 'image/png' ? undefined : imageQuality);
        setResizedImagePreview(resizedDataUrl);
        toast({ title: 'Success', description: 'Image resized successfully.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not process image.' });
      }
      setIsProcessing(false);
    };
    img.onerror = () => {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load image for resizing.' });
      setIsProcessing(false);
    };
    img.src = originalImage.dataUrl;
  };

  const handleDownload = () => {
    if (!resizedImagePreview) {
      toast({ variant: 'destructive', title: 'No Image', description: 'No resized image to download.' });
      return;
    }
    const link = document.createElement('a');
    link.href = resizedImagePreview;
    const extension = outputFormat.split('/')[1];
    link.download = `${fileName || 'resized_image'}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Downloaded', description: 'Resized image saved.' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Scaling className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Image Resizer</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Adjust the dimensions of your images with ease.
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
              Click to browse or drag & drop an image here
            </p>
            <p className="text-xs text-muted-foreground/70">
              Supports PNG, JPG, WEBP, GIF
            </p>
            <Input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
              id="imageUpload"
            />
          </div>

          {originalImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Original Image</h3>
                <div className="border rounded-md p-2 bg-muted/20 overflow-hidden">
                  <Image 
                    src={originalImage.dataUrl} 
                    alt="Original preview" 
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
                  <Label htmlFor="width" className="font-medium">Target Width (px)</Label>
                  <Input id="width" type="number" value={targetWidth} onChange={(e) => handleDimensionChange(e.target.value, 'width')} placeholder="e.g., 800" className="mt-1" min="1" />
                </div>
                <div>
                  <Label htmlFor="height" className="font-medium">Target Height (px)</Label>
                  <Input id="height" type="number" value={targetHeight} onChange={(e) => handleDimensionChange(e.target.value, 'height')} placeholder="e.g., 600" className="mt-1" min="1"/>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="aspectRatio" checked={keepAspectRatio} onCheckedChange={(checked) => setKeepAspectRatio(checked as boolean)} />
                  <Label htmlFor="aspectRatio" className="font-medium flex items-center">
                    <Link2 className="mr-2 h-4 w-4 text-muted-foreground" /> Keep Aspect Ratio
                  </Label>
                </div>
                <div>
                  <Label htmlFor="fileName" className="font-medium">Output File Name</Label>
                  <Input id="fileName" type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="resized_image" className="mt-1" />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="outputFormat" className="font-medium flex items-center"><FileType className="mr-2 h-4 w-4 text-muted-foreground"/>Output Format</Label>
                        <Select value={outputFormat} onValueChange={(value: 'image/png' | 'image/jpeg' | 'image/webp') => setOutputFormat(value)}>
                            <SelectTrigger id="outputFormat" className="mt-1">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="image/png">PNG</SelectItem>
                                <SelectItem value="image/jpeg">JPEG</SelectItem>
                                <SelectItem value="image/webp">WEBP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {(outputFormat === 'image/jpeg' || outputFormat === 'image/webp') && (
                    <div>
                        <Label htmlFor="imageQuality" className="font-medium flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground"/>Image Quality</Label>
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
                    )}
                 </div>
                <Button onClick={resizeImage} disabled={isProcessing || !originalImage || !targetWidth || !targetHeight} className="w-full">
                  <RefreshCw className={`mr-2 h-5 w-5 ${isProcessing ? 'animate-spin' : ''}`} />
                  {isProcessing ? 'Resizing...' : 'Resize Image'}
                </Button>
              </div>
            </div>
          )}

          {resizedImagePreview && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold text-foreground text-center">Resized Preview</h3>
              <div className="border rounded-md p-2 bg-muted/20 overflow-hidden max-w-md mx-auto">
                 <Image 
                    src={resizedImagePreview} 
                    alt="Resized preview" 
                    width={Number(targetWidth) || 300} 
                    height={Number(targetHeight) || 200} 
                    className="max-w-full h-auto rounded"
                    style={{maxWidth: '100%', height: 'auto'}}
                />
                 <p className="text-sm text-muted-foreground mt-2 text-center">
                    New Dimensions: {targetWidth} x {targetHeight}px
                  </p>
              </div>
              <Button onClick={handleDownload} className="w-full max-w-md mx-auto block">
                <Download className="mr-2 h-5 w-5" />
                Download Resized Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
