import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileImage, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImageToPDFPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <FileImage className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Image to PDF Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Convert your images (JPG, PNG, etc.) into PDF documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
           <div 
            className="w-full h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center p-6"
            data-ai-hint="file upload placeholder"
          >
            <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">
              Functionality under development.
            </p>
            <Button variant="outline" disabled>Upload Images</Button>
          </div>
          <p className="text-muted-foreground">
            The Image to PDF Converter is currently under development. 
            Please check back soon!
          </p>
          <p className="text-sm text-muted-foreground">
            This tool will allow you to upload multiple images and convert them into a single PDF file.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
