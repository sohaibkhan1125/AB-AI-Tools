
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KeyRound, Copy, RefreshCw, CheckSquare, Square, CaseUpper, CaseLower, Hash, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const { toast } = useToast();

  const generatePassword = useCallback(() => {
    let charset = '';
    const guaranteedChars: string[] = [];

    if (includeLowercase) {
      charset += LOWERCASE_CHARS;
      guaranteedChars.push(LOWERCASE_CHARS[Math.floor(Math.random() * LOWERCASE_CHARS.length)]);
    }
    if (includeUppercase) {
      charset += UPPERCASE_CHARS;
      guaranteedChars.push(UPPERCASE_CHARS[Math.floor(Math.random() * UPPERCASE_CHARS.length)]);
    }
    if (includeNumbers) {
      charset += NUMBER_CHARS;
      guaranteedChars.push(NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)]);
    }
    if (includeSymbols) {
      charset += SYMBOL_CHARS;
      guaranteedChars.push(SYMBOL_CHARS[Math.floor(Math.random() * SYMBOL_CHARS.length)]);
    }

    if (charset === '') {
      toast({
        variant: 'destructive',
        title: 'No Character Types Selected',
        description: 'Please select at least one character type to include.',
      });
      setPassword('');
      return;
    }
    
    if (length < guaranteedChars.length) {
       toast({
        variant: 'destructive',
        title: 'Length Too Short',
        description: `Password length must be at least ${guaranteedChars.length} to include all selected character types.`,
      });
      setPassword('');
      return;
    }


    let newPassword = guaranteedChars.join('');
    const remainingLength = length - guaranteedChars.length;

    for (let i = 0; i < remainingLength; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password to ensure randomness of guaranteed characters' positions
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(newPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, toast]);

  const copyToClipboard = () => {
    if (!password) {
      toast({
        variant: 'destructive',
        title: 'Nothing to Copy',
        description: 'Generate a password first.',
      });
      return;
    }
    navigator.clipboard.writeText(password);
    toast({
      title: 'Password Copied!',
      description: 'The generated password has been copied to your clipboard.',
    });
  };
  
  // Generate password on initial load or when options change
  useState(generatePassword);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <KeyRound className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Password Generator</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Create strong and random passwords tailored to your needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <Label htmlFor="passwordDisplay" className="font-medium text-lg">Generated Password:</Label>
            <div className="flex items-center gap-2">
              <Input
                id="passwordDisplay"
                type="text"
                value={password}
                readOnly
                className="text-lg font-mono tracking-wider bg-muted/50 flex-grow"
                placeholder="Click Generate"
                aria-label="Generated password"
              />
              <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy password">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-xl font-semibold text-foreground">Options</h3>
            
            <div className="space-y-2">
              <Label htmlFor="length" className="font-medium">Password Length: {length}</Label>
              <Slider
                id="length"
                min={4}
                max={64}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox id="includeLowercase" checked={includeLowercase} onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)} />
                <Label htmlFor="includeLowercase" className="font-medium flex items-center text-sm">
                  <CaseLower className="mr-2 h-5 w-5 text-muted-foreground" /> Include Lowercase (a-z)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="includeUppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)} />
                <Label htmlFor="includeUppercase" className="font-medium flex items-center text-sm">
                  <CaseUpper className="mr-2 h-5 w-5 text-muted-foreground" /> Include Uppercase (A-Z)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="includeNumbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)} />
                <Label htmlFor="includeNumbers" className="font-medium flex items-center text-sm">
                  <Hash className="mr-2 h-5 w-5 text-muted-foreground" /> Include Numbers (0-9)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="includeSymbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)} />
                <Label htmlFor="includeSymbols" className="font-medium flex items-center text-sm">
                  <Sigma className="mr-2 h-5 w-5 text-muted-foreground" /> Include Symbols (!@#$)
                </Label>
              </div>
            </div>
            
            <Button onClick={generatePassword} className="w-full">
              <RefreshCw className="mr-2 h-5 w-5" /> Generate New Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
