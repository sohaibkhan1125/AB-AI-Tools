import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode, AlertTriangle } from 'lucide-react';

export default function QRCodeScannerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <QrCode className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">QR Code Scanner</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Scan QR codes effortlessly using your device's camera.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div 
            className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center"
            data-ai-hint="webcam placeholder"
          >
             <AlertTriangle className="h-16 w-16 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground">
            The QR Code Scanner functionality is currently under development. 
            Please check back later!
          </p>
          <p className="text-sm text-muted-foreground">
            Once implemented, you'll be able to point your camera at a QR code to decode it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
