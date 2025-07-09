'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileImage, UploadCloud, Trash2, Download, FileText, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";


interface ImageFile {
  id: string;
  name: string;
  dataUrl: string;
  file: File;
}

export default function ImageToPDFPage() {
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfName, setPdfName] = useState('ab_ai_tools_hub_converted');
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [imageQuality, setImageQuality] = useState(0.92); // Corresponds to jsPDF's default
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: ImageFile[] = [];
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newImages.push({
              id: crypto.randomUUID(),
              name: file.name,
              dataUrl: e.target?.result as string,
              file,
            });
            // Check if all files are read
            if (newImages.length === files.length) {
                 setSelectedImages(prev => [...prev, ...newImages.filter(nI => !prev.find(pI => pI.name === nI.name && pI.file.size === nI.file.size))]);
            }
          };
          reader.readAsDataURL(file);
        } else {
          toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: `${file.name} is not a supported image file. Supported types include JPG, PNG, WEBP, GIF.`,
          });
        }
      });
    }
  };

  const removeImage = (id: string) => {
    setSelectedImages(prev => prev.filter(image => image.id !== id));
  };

  const convertToPdf = async () => {
    if (selectedImages.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Images Selected',
        description: 'Please upload images to convert.',
      });
      return;
    }

    setIsConverting(true);
    toast({
      title: 'Conversion Started',
      description: 'Generating your PDF...',
    });

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: pageSize,
      });

      for (let i = 0; i < selectedImages.length; i++) {
        const imageFile = selectedImages[i];
        const img = new window.Image();
        img.src = imageFile.dataUrl;

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            const pdfPageWidth = pdf.internal.pageSize.getWidth();
            const pdfPageHeight = pdf.internal.pageSize.getHeight();
            
            const margin = 10; // 10mm margin
            const usableWidth = pdfPageWidth - 2 * margin;
            const usableHeight = pdfPageHeight - 2 * margin;

            let newWidth, newHeight;

            // Calculate aspect ratio
            const aspectRatio = imgWidth / imgHeight;

            if (imgWidth > usableWidth || imgHeight > usableHeight) {
                if (usableWidth / aspectRatio <= usableHeight) {
                    newWidth = usableWidth;
                    newHeight = newWidth / aspectRatio;
                } else {
                    newHeight = usableHeight;
                    newWidth = newHeight * aspectRatio;
                }
            } else {
                newWidth = imgWidth;
                newHeight = imgHeight;
            }
            
            // Center the image
            const x = margin + (usableWidth - newWidth) / 2;
            const y = margin + (usableHeight - newHeight) / 2;


            if (i > 0) {
              pdf.addPage();
            }
            // Determine image type for addImage; default to JPEG if not obvious
            let imageFormat = imageFile.file.type.split('/')[1]?.toUpperCase() || 'JPEG';
            if (!['JPEG', 'PNG', 'WEBP'].includes(imageFormat)) {
                imageFormat = 'JPEG'; // Default for unknown types jsPDF supports
            }
            pdf.addImage(imageFile.dataUrl, imageFormat, x, y, newWidth, newHeight, undefined, 'FAST', imageQuality);
            resolve();
          };
          img.onerror = (err) => {
            console.error("Error loading image for PDF:", err);
            toast({
                variant: "destructive",
                title: "Image Load Error",
                description: `Could not load ${imageFile.name} for PDF conversion.`,
            });
            reject(new Error(`Failed to load image: ${imageFile.name}`));
          }
        });
      }

      pdf.save(`${pdfName || 'ab_ai_tools_hub_converted'}.pdf`);
      toast({
        title: 'Conversion Successful!',
        description: 'Your PDF has been downloaded.',
      });
    } catch (error) {
      console.error('Error converting to PDF:', error);
      toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: 'An unexpected error occurred during PDF conversion.',
      });
    } finally {
      setIsConverting(false);
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <FileImage className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Image to PDF Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Convert JPG, PNG, WEBP, GIF and other images into a single PDF document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div
            className="w-full p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ai-hint="file upload dropzone"
          >
            <UploadCloud className="h-12 w-12 text-primary mb-4" />
            <p className="text-muted-foreground mb-2">
              Click to browse or drag & drop images here
            </p>
            <p className="text-xs text-muted-foreground/70">
              Supports JPG, PNG, WEBP, GIF
            </p>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
              id="imageUpload"
            />
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="pdfName" className="font-medium">PDF File Name (optional)</Label>
            <Input 
              id="pdfName" 
              type="text" 
              value={pdfName}
              onChange={(e) => setPdfName(e.target.value)}
              placeholder="e.g., my_document" 
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="pageSize" className="font-medium flex items-center"><FileText className="mr-2 h-4 w-4 text-muted-foreground"/>Page Size</Label>
                <Select value={pageSize} onValueChange={(value: "a4" | "letter") => setPageSize(value)}>
                    <SelectTrigger id="pageSize">
                        <SelectValue placeholder="Select page size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                 <Label htmlFor="imageQuality" className="font-medium flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground"/>Image Quality (for JPG/WEBP)</Label>
                <div className="flex items-center gap-2">
                    <Slider
                        id="imageQuality"
                        min={0.1}
                        max={1}
                        step={0.01}
                        value={[imageQuality]}
                        onValueChange={(value) => setImageQuality(value[0])}
                        className="flex-grow"
                    />
                    <span className="text-sm text-muted-foreground w-12 text-right">{(imageQuality * 100).toFixed(0)}%</span>
                </div>
            </div>
          </div>


          {selectedImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Selected Images ({selectedImages.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2 border rounded-md bg-muted/20">
                {selectedImages.map((image) => (
                  <div key={image.id} className="relative group aspect-square border rounded-md overflow-hidden shadow-sm">
                    <Image src={image.dataUrl} alt={image.name} layout="fill" objectFit="cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                      <p className="text-xs text-white truncate w-full text-center mb-1">{image.name}</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        aria-label={`Remove ${image.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={convertToPdf} 
            disabled={isConverting || selectedImages.length === 0} 
            className="w-full"
          >
            <Download className="mr-2 h-5 w-5" />
            {isConverting ? 'Converting...' : `Convert to PDF (${selectedImages.length} image${selectedImages.length === 1 ? '' : 's'})`}
          </Button>
          
        </CardContent>
      </Card>
    </div>
  );
}
