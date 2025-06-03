'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode, CameraOff, RotateCcw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import jsQR from 'jsqr';
import Link from 'next/link';

export default function QRCodeScannerPage() {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera API is not supported by your browser.");
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Unsupported Browser',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Camera access was denied. Please enable camera permissions in your browser settings.');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  useEffect(() => {
    let animationFrameId: number;

    const scanQRCode = () => {
      if (!isScanning || !videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        if (isScanning) animationFrameId = requestAnimationFrame(scanQRCode);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          setScannedData(code.data);
          setIsScanning(false);
          toast({
            title: 'QR Code Scanned!',
            description: `Data: ${code.data.substring(0, 50)}${code.data.length > 50 ? '...' : ''}`,
          });
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop()); // Stop camera after scan
          }
        }
      }
      if (isScanning) animationFrameId = requestAnimationFrame(scanQRCode);
    };

    if (hasCameraPermission && isScanning) {
      animationFrameId = requestAnimationFrame(scanQRCode);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasCameraPermission, isScanning, toast]);

  const handleScanAgain = () => {
    setScannedData(null);
    setError(null);
    setIsScanning(true);
    if (streamRef.current) { // Restart camera if it was stopped
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        setError('Failed to restart camera.');
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();
  };
  
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;  
    }
  }

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
        <CardContent className="space-y-6">
          <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
            {hasCameraPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                <CameraOff className="h-16 w-16 text-destructive mb-4" />
                <p className="text-destructive text-center">Camera permission is required to scan QR codes.</p>
              </div>
            )}
             {hasCameraPermission === null && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                <p className="text-muted-foreground">Requesting camera permission...</p>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {scannedData && (
            <Card className="bg-accent/10">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Scanned Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground break-all whitespace-pre-wrap">{scannedData}</p>
                {isValidUrl(scannedData) && (
                  <Button variant="link" asChild className="p-0 h-auto mt-2 text-primary hover:underline">
                    <Link href={scannedData} target="_blank" rel="noopener noreferrer">
                      Open Link <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <Button onClick={handleScanAgain} className="w-full" disabled={isScanning && hasCameraPermission !== false}>
            <RotateCcw className="mr-2 h-5 w-5" /> {scannedData ? 'Scan Another QR Code' : (isScanning ? 'Scanning...' : 'Start Scan')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
