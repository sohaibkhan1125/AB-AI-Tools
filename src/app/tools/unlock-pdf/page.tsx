
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { unlockPdf, type UnlockPdfInput } from '@/ai/flows/unlock-pdf-flow';
import { UploadCloud, Unlock as UnlockIcon, Loader2, Download, AlertCircle, KeyRound } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function UnlockPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setPdfFileName(file.name);
        toast({ title: 'PDF Selected', description: `${file.name} is ready.` });
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
      fileInputRef.current.value = ""; 
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleUnlock = async () => {
    if (!pdfFile) {
      toast({ variant: 'destructive', title: 'No PDF Selected', description: 'Please upload a PDF file to unlock.' });
      return;
    }

    setIsProcessing(true);
    toast({ title: 'Attempting to Unlock...', description: 'Please wait.' });

    try {
      const pdfDataUri = await readFileAsDataURL(pdfFile);
      const input: UnlockPdfInput = { pdfDataUri, password };
      const result = await unlockPdf(input);

      if (result.success && result.unlockedPdfDataUri) {
        const link = document.createElement('a');
        link.href = result.unlockedPdfDataUri;
        link.download = `${pdfFileName.replace(/\.pdf$/i, '')}_unlocked.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'PDF Unlocked!', description: `${result.message} Download has started.` });
      } else {
        toast({ variant: 'destructive', title: 'Unlock Failed', description: result.message });
      }
    } catch (error: any) {
      console.error('Error unlocking PDF:', error);
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: error.message || 'An unexpected error occurred during the unlock process.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <UnlockIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Unlock PDF</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Remove password protection from your PDF file. Password must be known.
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
              {pdfFileName || 'Click to browse or drag & drop a PDF file'}
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

          {pdfFile && (
            <div className="space-y-2">
              <Label htmlFor="passwordInput" className="font-medium flex items-center">
                <KeyRound className="h-4 w-4 mr-2 text-muted-foreground" />
                PDF Password (if any)
              </Label>
              <Input
                id="passwordInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to open/unlock"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground">Leave blank if the PDF has no open password but might have restrictions, or if you want to test if it's already unlocked.</p>
            </div>
          )}

          <Button onClick={handleUnlock} disabled={!pdfFile || isProcessing} className="w-full text-lg py-3">
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <UnlockIcon className="mr-2 h-5 w-5" />
            )}
            {isProcessing ? 'Processing...' : 'Unlock PDF'}
          </Button>

          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">Important Note</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground space-y-1">
              <p>This tool attempts to remove password-based restrictions from a PDF file if you provide the correct password.</p>
              <p>It <strong>cannot</strong> crack or bypass unknown passwords or remove certain types of advanced DRM (Digital Rights Management).</p>
              <p>Ensure you have the right to modify the PDF file.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          Please use responsibly and respect copyright.
        </CardFooter>
      </Card>
    </div>
  );
}
