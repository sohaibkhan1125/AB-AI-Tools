
'use client';

import { useState, useRef, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mergePdfs, type MergePdfsInput } from '@/ai/flows/merge-pdf-flow';
import { UploadCloud, FileText, Trash2, Combine, Loader2, Download, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  dataUrlPreview?: string; // For a tiny preview if desired, though complex for PDF
}

export default function MergePdfPage() {
  const [selectedFiles, setSelectedFiles] = useState<PdfFileItem[]>([]);
  const [outputFileName, setOutputFileName] = useState<string>('merged_document');
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPdfFiles: PdfFileItem[] = Array.from(files)
        .filter(file => file.type === 'application/pdf')
        .map(file => ({
          id: crypto.randomUUID(),
          file,
          name: file.name,
        }));

      const nonPdfFiles = Array.from(files).filter(file => file.type !== 'application/pdf');
      if (nonPdfFiles.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: `${nonPdfFiles.map(f => f.name).join(', ')} are not PDF files and were ignored.`,
        });
      }
      
      // Avoid adding duplicates based on name and size
      const uniqueNewFiles = newPdfFiles.filter(nf => 
        !selectedFiles.some(sf => sf.name === nf.name && sf.file.size === nf.file.size)
      );

      setSelectedFiles(prev => [...prev, ...uniqueNewFiles]);
      if (uniqueNewFiles.length > 0) {
        toast({ title: 'Files Added', description: `${uniqueNewFiles.length} PDF(s) ready for merging.` });
      }
      // Reset file input to allow selecting the same file again if removed
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...selectedFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setSelectedFiles(newFiles);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 1) { // Changed from < 2 to allow single file processing (useful for re-saving/optimizing in future)
      toast({ variant: 'destructive', title: 'Not Enough Files', description: 'Please select at least one PDF file to process.' });
      return;
    }
    if (!outputFileName.trim()) {
        toast({ variant: 'destructive', title: 'Output Name Required', description: 'Please enter a name for the merged PDF.' });
        return;
    }


    setIsMerging(true);
    toast({ title: 'Merging PDFs...', description: 'Please wait, this may take a moment.' });

    try {
      const pdfDataUris = await Promise.all(selectedFiles.map(item => readFileAsDataURL(item.file)));
      
      const input: MergePdfsInput = { pdfDataUris };
      const result = await mergePdfs(input);

      const link = document.createElement('a');
      link.href = result.mergedPdfDataUri;
      link.download = `${outputFileName.trim() || 'merged_document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: 'PDFs Merged Successfully!', description: `${link.download} has been downloaded.` });
      setSelectedFiles([]); // Optionally clear files after successful merge
    } catch (error: any) {
      console.error('Error merging PDFs:', error);
      toast({
        variant: 'destructive',
        title: 'Merging Failed',
        description: error.message || 'Could not merge PDFs. Please check the files and try again.',
      });
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Combine className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Merge PDF Files</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Upload multiple PDF files, reorder them, and combine into one single PDF.
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
              Click to browse or drag & drop PDF files
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Maximum 10 files, 5MB each (Recommended for browser performance)
            </p>
            <Input
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              id="pdfUpload"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Selected Files ({selectedFiles.length}):</h3>
              <ul className="space-y-3 border rounded-md p-4 max-h-96 overflow-y-auto bg-muted/20">
                {selectedFiles.map((item, index) => (
                  <li key={item.id} className="flex items-center justify-between p-3 bg-background rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <FileText className="h-6 w-6 text-primary mr-3 shrink-0" />
                    <span className="flex-grow truncate text-sm" title={item.name}>{item.name}</span>
                    <div className="flex items-center ml-3 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => moveFile(index, 'up')} disabled={index === 0} className="h-8 w-8" aria-label="Move up">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveFile(index, 'down')} disabled={index === selectedFiles.length - 1} className="h-8 w-8" aria-label="Move down">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeFile(item.id)} className="text-destructive hover:text-destructive h-8 w-8" aria-label="Remove file">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
            
          {selectedFiles.length > 0 && (
             <div className="space-y-2">
                <Label htmlFor="outputFileName" className="font-medium">Output File Name (without .pdf)</Label>
                <Input
                    id="outputFileName"
                    type="text"
                    value={outputFileName}
                    onChange={(e) => setOutputFileName(e.target.value)}
                    placeholder="e.g., merged_document"
                    className="mt-1"
                />
             </div>
          )}

          <Button onClick={handleMerge} disabled={isMerging || selectedFiles.length < 1} className="w-full text-lg py-3">
            {isMerging ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Combine className="mr-2 h-5 w-5" />
            )}
            {isMerging ? 'Merging...' : `Merge ${selectedFiles.length} PDF(s)`}
          </Button>

          {selectedFiles.length === 0 && !isMerging && (
             <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ready to Merge Your PDFs?</AlertTitle>
                <AlertDescription>
                    Upload the PDF files you want to combine. You can then reorder them before merging into a single document.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
