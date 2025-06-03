
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Baseline, Type, Pilcrow, Sigma, CaseSensitive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TextStats {
  wordCount: number;
  charCountWithSpaces: number;
  charCountWithoutSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  averageWordLength: number;
}

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const { toast } = useToast();

  const stats: TextStats = useMemo(() => {
    const trimmedText = text.trim();

    const words = trimmedText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const charCountWithSpaces = text.length;
    const charCountWithoutSpaces = text.replace(/\s/g, '').length;

    // More robust sentence detection: considers ., !, ?, and multiple terminators.
    const sentences = trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    
    // Paragraphs are typically separated by one or more empty lines.
    const paragraphs = trimmedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length || (trimmedText.length > 0 ? 1 : 0); // Count at least 1 if there's text

    const totalWordLength = words.reduce((acc, word) => acc + word.length, 0);
    const averageWordLength = wordCount > 0 ? parseFloat((totalWordLength / wordCount).toFixed(2)) : 0;

    return {
      wordCount,
      charCountWithSpaces,
      charCountWithoutSpaces,
      sentenceCount,
      paragraphCount,
      averageWordLength,
    };
  }, [text]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleClearText = () => {
    setText('');
    toast({ title: 'Text Cleared', description: 'The text area has been cleared.' });
  };

  const StatDisplay: React.FC<{ icon: React.ElementType, label: string, value: string | number, unit?: string }> = ({ icon: Icon, label, value, unit }) => (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3 text-primary" />
        <span className="text-sm font-medium text-foreground/80">{label}</span>
      </div>
      <span className="text-sm font-semibold text-primary">{value}{unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}</span>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Baseline className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Word Counter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Analyze your text and get detailed statistics instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="text-input" className="text-base font-medium mb-2 block">
              Enter your text below:
            </Label>
            <Textarea
              id="text-input"
              value={text}
              onChange={handleTextChange}
              placeholder="Start typing or paste your text here..."
              className="min-h-[200px] text-base border-input focus:ring-primary focus:border-primary"
              rows={10}
            />
          </div>

          {text.length > 0 && (
            <Button variant="outline" onClick={handleClearText} className="w-full sm:w-auto">
              Clear Text
            </Button>
          )}

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-xl font-semibold text-foreground mb-3 font-headline">Text Statistics:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatDisplay icon={Type} label="Words" value={stats.wordCount} />
              <StatDisplay icon={Pilcrow} label="Sentences" value={stats.sentenceCount} />
              <StatDisplay icon={Sigma} label="Characters (with spaces)" value={stats.charCountWithSpaces} />
              <StatDisplay icon={Sigma} label="Characters (no spaces)" value={stats.charCountWithoutSpaces} />
              <StatDisplay icon={Pilcrow} label="Paragraphs" value={stats.paragraphCount} />
              <StatDisplay icon={CaseSensitive} label="Avg. Word Length" value={stats.averageWordLength} unit="chars" />
            </div>
          </div>
        </CardContent>
         <CardFooter className="text-center text-sm text-muted-foreground">
            Counts are updated in real-time as you type.
        </CardFooter>
      </Card>
    </div>
  );
}
