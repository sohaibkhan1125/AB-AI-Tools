
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gauge, Download, Wifi, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from "@/components/ui/progress";


const TEST_FILE_URL = 'https://bouygues.testdebit.info/5Mo.dat'; // 5MB test file
const TEST_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB in bytes
const PING_URL = 'https://ip-api.com/json/?fields=query'; // Small payload for latency test

interface SpeedTestResults {
  downloadSpeed: number | null; // Mbps
  latency: number | null; // ms
}

export default function InternetSpeedTesterPage() {
  const [results, setResults] = useState<SpeedTestResults>({ downloadSpeed: null, latency: null });
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string>('');
  const { toast } = useToast();

  const measureDownloadSpeed = async (): Promise<number | null> => {
    setCurrentTest('Testing Download Speed...');
    setTestProgress(0);
    const startTime = performance.now();
    try {
      const response = await fetch(TEST_FILE_URL, { cache: 'no-store' });
      if (!response.ok || !response.body) {
        throw new Error(`Failed to download test file (status: ${response.status})`);
      }

      const reader = response.body.getReader();
      let receivedLength = 0;
      
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedLength += value.length;
        setTestProgress((receivedLength / TEST_FILE_SIZE_BYTES) * 100);
      }

      const endTime = performance.now();
      const durationSeconds = (endTime - startTime) / 1000;
      
      if (durationSeconds === 0) return null; // Avoid division by zero
      
      // Actual file size might be slightly different, using defined size for consistency.
      // For more accuracy, could use receivedLength if server provides Content-Length and it matches.
      const speedBps = (TEST_FILE_SIZE_BYTES * 8) / durationSeconds; 
      return parseFloat((speedBps / 1_000_000).toFixed(2)); // Convert to Mbps
    } catch (error) {
      console.error('Download speed test error:', error);
      toast({ variant: 'destructive', title: 'Download Test Failed', description: (error as Error).message });
      return null;
    }
  };

  const measureLatency = async (): Promise<number | null> => {
    setCurrentTest('Testing Latency (Ping)...');
    setTestProgress(0); // Reset progress for this stage
    const startTime = performance.now();
    try {
      await fetch(PING_URL, { method: 'GET', cache: 'no-store' });
      const endTime = performance.now();
      setTestProgress(100);
      return parseFloat((endTime - startTime).toFixed(2));
    } catch (error) {
      console.error('Latency test error:', error);
      toast({ variant: 'destructive', title: 'Latency Test Failed', description: (error as Error).message });
      return null;
    }
  };

  const startTest = useCallback(async () => {
    setIsTesting(true);
    setResults({ downloadSpeed: null, latency: null });
    toast({ title: 'Speed Test Started', description: 'Measuring your connection...' });

    const latency = await measureLatency();
    let downloadSpeed = null;
    if (latency !== null) { // Only proceed if latency test didn't fail catastrophically
        downloadSpeed = await measureDownloadSpeed();
    }

    setResults({ downloadSpeed, latency });
    setIsTesting(false);
    setCurrentTest('');
    setTestProgress(0);
    toast({ title: 'Speed Test Complete!', description: 'Check your results below.' });
  }, [toast]);

  const ResultDisplay: React.FC<{ icon: React.ElementType, label: string, value: number | null, unit: string }> = ({ icon: Icon, label, value, unit }) => (
    <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg shadow-sm text-center">
      <Icon className="h-10 w-10 mb-3 text-primary" />
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      {isTesting && value === null ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      ) : value !== null ? (
        <p className="text-3xl font-bold text-primary">
          {value} <span className="text-lg font-normal text-muted-foreground">{unit}</span>
        </p>
      ) : (
        <p className="text-3xl font-bold text-muted-foreground">-</p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Gauge className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Internet Speed Test</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Estimate your download speed and network latency.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Button
            onClick={startTest}
            disabled={isTesting}
            className="w-full text-lg py-6"
            size="lg"
          >
            {isTesting ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <Gauge className="mr-2 h-6 w-6" />
            )}
            {isTesting ? 'Testing...' : 'Start Speed Test'}
          </Button>

          {isTesting && currentTest && (
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground">{currentTest}</p>
              <Progress value={testProgress} className="w-full" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <ResultDisplay icon={Download} label="Download Speed" value={results.downloadSpeed} unit="Mbps" />
            <ResultDisplay icon={Wifi} label="Latency (Ping)" value={results.latency} unit="ms" />
          </div>
          
          <Alert variant="default" className="mt-6">
            <AlertTriangle className="h-4 w-4 !text-muted-foreground" />
            <AlertTitle className="font-semibold">Disclaimer</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              This tool provides an estimation of your internet speed and latency. Results can be affected by various factors including network congestion, server load of test files, and your device's performance. For precise measurements, consider using dedicated speed test applications. Upload speed testing is not available with this tool due to client-side limitations.
            </AlertDescription>
          </Alert>

        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
            Test file source: bouygues.testdebit.info. Latency test: ip-api.com.
        </CardFooter>
      </Card>
    </div>
  );
}
