
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mic, Square, Loader2, Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { transcribeAudio, type TranscribeAudioInput } from '@/ai/flows/transcribe-audio-flow';

type RecordingState = 'idle' | 'requesting_permission' | 'permission_denied' | 'recording' | 'processing' | 'error';

export default function VoiceToTextPage() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const stopMediaStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleStartRecording = async () => {
    if (recordingState === 'recording') return;

    setRecordingState('requesting_permission');
    setError(null);
    setTranscript('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Media devices API not supported by your browser.');
      setRecordingState('error');
      toast({ variant: 'destructive', title: 'Browser Error', description: 'Media devices API not supported.' });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setRecordingState('recording');
      
      const options = { mimeType: 'audio/webm;codecs=opus' };
      let effectiveOptions = options;
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        effectiveOptions = { mimeType: 'audio/webm' }; // Fallback
         if (!MediaRecorder.isTypeSupported(effectiveOptions.mimeType)) {
           effectiveOptions = { mimeType: '' }; // Let browser decide
         }
      }

      mediaRecorderRef.current = new MediaRecorder(stream, effectiveOptions);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        stopMediaStream();
        if (audioChunksRef.current.length === 0) {
            setError('No audio data recorded. Please try speaking louder or closer to the microphone.');
            setRecordingState('error');
            toast({ variant: 'destructive', title: 'Recording Error', description: 'No audio data was captured.' });
            return;
        }

        setRecordingState('processing');
        const audioBlob = new Blob(audioChunksRef.current, { type: effectiveOptions.mimeType || 'audio/webm' });
        
        const reader = new FileReader();
        reader.onloadend = async () => {
          const audioDataUri = reader.result as string;
          try {
            const input: TranscribeAudioInput = { audioDataUri };
            const result = await transcribeAudio(input);
            setTranscript(result.transcript);
            toast({ title: 'Transcription Complete', description: 'Your voice has been converted to text.' });
          } catch (apiError: any) {
            console.error('Transcription API error:', apiError);
            setError(`Transcription failed: ${apiError.message || 'Unknown error'}`);
            toast({ variant: 'destructive', title: 'Transcription Error', description: apiError.message || 'Could not transcribe audio.' });
          } finally {
            setRecordingState('idle');
          }
        };
        reader.onerror = () => {
            setError('Failed to read audio data.');
            setRecordingState('error');
            toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not process recorded audio.' });
        }
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
      toast({ title: 'Recording Started', description: 'Speak into your microphone.' });

    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied. Please enable microphone permissions in your browser settings.');
      setRecordingState('permission_denied');
      toast({ variant: 'destructive', title: 'Permission Denied', description: 'Microphone access is required.' });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      // onstop event will handle further state changes
    }
  };

  const handleCopyTranscript = () => {
    if (!transcript) {
      toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'No transcript available.' });
      return;
    }
    navigator.clipboard.writeText(transcript);
    toast({ title: 'Copied to Clipboard', description: 'Transcript copied successfully.' });
  };

  useEffect(() => {
    // Cleanup stream on component unmount
    return () => {
      stopMediaStream();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [stopMediaStream]);

  const getButtonContent = () => {
    switch (recordingState) {
      case 'recording':
        return <><Square className="mr-2 h-5 w-5" /> Stop Recording</>;
      case 'processing':
        return <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>;
      case 'requesting_permission':
        return <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Requesting...</>;
      default:
        return <><Mic className="mr-2 h-5 w-5" /> Start Recording</>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Mic className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Voice to Text Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Click "Start Recording" and speak. Your words will be transcribed into text.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
           {recordingState === 'permission_denied' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Microphone Access Denied</AlertTitle>
              <AlertDescription>
                Please enable microphone permissions for this site in your browser settings to use this tool.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={recordingState === 'recording' ? handleStopRecording : handleStartRecording}
            disabled={recordingState === 'processing' || recordingState === 'requesting_permission'}
            className="w-full text-lg py-6"
            size="lg"
          >
            {getButtonContent()}
          </Button>

          {recordingState === 'recording' && (
            <p className="text-center text-primary animate-pulse font-medium">Recording... Speak clearly.</p>
          )}


          {transcript && (
            <div className="space-y-4 pt-4 border-t">
              <Label htmlFor="transcriptOutput" className="text-lg font-semibold">Your Transcript:</Label>
              <Textarea
                id="transcriptOutput"
                value={transcript}
                readOnly
                rows={8}
                className="bg-muted/30"
                placeholder="Your transcribed text will appear here..."
              />
              <Button onClick={handleCopyTranscript} variant="outline" className="w-full sm:w-auto">
                <Copy className="mr-2 h-4 w-4" /> Copy Transcript
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
