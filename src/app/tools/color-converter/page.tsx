
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Color Conversion Utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  }
  // Handle 3-digit hex
  const shortResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
  if (shortResult) {
    return {
      r: parseInt(shortResult[1] + shortResult[1], 16),
      g: parseInt(shortResult[2] + shortResult[2], 16),
      b: parseInt(shortResult[3] + shortResult[3], 16),
    };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s: number, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    h /= 360;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState<string>('#5DADE2'); // Default to a pleasant blue
  const [r, setR] = useState<string>('93');
  const [g, setG] = useState<string>('173');
  const [b, setB] = useState<string>('226');
  const [h, setH] = useState<string>('203');
  const [s, setS] = useState<string>('60');
  const [l, setL] = useState<string>('63');

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const { toast } = useToast();

  const updateColorsFromHex = useCallback((newHex: string) => {
    if (focusedInput === 'hex' || focusedInput === 'picker') {
      const rgbColor = hexToRgb(newHex);
      if (rgbColor) {
        setR(String(rgbColor.r));
        setG(String(rgbColor.g));
        setB(String(rgbColor.b));
        const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
        setH(String(hslColor.h));
        setS(String(hslColor.s));
        setL(String(hslColor.l));
      }
    }
  }, [focusedInput]);

  const updateColorsFromRgb = useCallback(() => {
    if (focusedInput === 'r' || focusedInput === 'g' || focusedInput === 'b') {
      const rNum = parseInt(r, 10);
      const gNum = parseInt(g, 10);
      const bNum = parseInt(b, 10);
      if (!isNaN(rNum) && !isNaN(gNum) && !isNaN(bNum) &&
          rNum >= 0 && rNum <= 255 && gNum >= 0 && gNum <= 255 && bNum >= 0 && bNum <= 255) {
        const newHex = rgbToHex(rNum, gNum, bNum);
        setHex(newHex); // This will trigger updateColorsFromHex if focusedInput is not rgb
        const hslColor = rgbToHsl(rNum, gNum, bNum);
        setH(String(hslColor.h));
        setS(String(hslColor.s));
        setL(String(hslColor.l));
      }
    }
  }, [r, g, b, focusedInput]);

  const updateColorsFromHsl = useCallback(() => {
    if (focusedInput === 'h' || focusedInput === 's' || focusedInput === 'l') {
      const hNum = parseInt(h, 10);
      const sNum = parseInt(s, 10);
      const lNum = parseInt(l, 10);
      if (!isNaN(hNum) && !isNaN(sNum) && !isNaN(lNum) &&
          hNum >= 0 && hNum <= 360 && sNum >= 0 && sNum <= 100 && lNum >= 0 && lNum <= 100) {
        const rgbColor = hslToRgb(hNum, sNum, lNum);
        setR(String(rgbColor.r));
        setG(String(rgbColor.g));
        setB(String(rgbColor.b));
        setHex(rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b)); // This will trigger updateColorsFromHex if focusedInput is not hsl
      }
    }
  }, [h, s, l, focusedInput]);

  useEffect(() => {
    if (focusedInput === 'hex' || focusedInput === 'picker') {
        updateColorsFromHex(hex);
    }
  }, [hex, focusedInput, updateColorsFromHex]);

  useEffect(() => {
    if (focusedInput === 'r' || focusedInput === 'g' || focusedInput === 'b') {
        updateColorsFromRgb();
    }
  }, [r, g, b, focusedInput, updateColorsFromRgb]);

  useEffect(() => {
     if (focusedInput === 'h' || focusedInput === 's' || focusedInput === 'l') {
        updateColorsFromHsl();
    }
  }, [h, s, l, focusedInput, updateColorsFromHsl]);
  
  // Initialize on mount
  useEffect(() => {
    setFocusedInput('picker'); // Simulate initial source
    updateColorsFromHex(hex);
    setFocusedInput(null); // Reset focus source
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHex = e.target.value.toUpperCase();
    if (newHex.length > 0 && !newHex.startsWith('#')) {
      newHex = '#' + newHex;
    }
    setHex(newHex);
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    if (/^\d*$/.test(value)) {
      const numVal = parseInt(value, 10);
      if (value === '' || (numVal >= 0 && numVal <= 255)) {
        if (component === 'r') setR(value);
        else if (component === 'g') setG(value);
        else if (component === 'b') setB(value);
      }
    }
  };
  
  const handleHslChange = (component: 'h' | 's' | 'l', value: string) => {
    if (/^\d*$/.test(value)) {
      const numVal = parseInt(value, 10);
      const maxVal = component === 'h' ? 360 : 100;
      if (value === '' || (numVal >= 0 && numVal <= maxVal)) {
        if (component === 'h') setH(value);
        else if (component === 's') setS(value);
        else if (component === 'l') setL(value);
      }
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFocusedInput('picker');
    setHex(e.target.value.toUpperCase());
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} Copied!`, description: text });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mx-auto mb-4">
            <Palette className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Color Converter</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Convert colors between HEX, RGB, and HSL formats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Label htmlFor="colorPicker" className="font-medium text-lg">Select Color</Label>
            <Input
              id="colorPicker"
              type="color"
              value={hex}
              onChange={handleColorPickerChange}
              className="w-24 h-24 p-0 border-none rounded-full cursor-pointer shadow-md"
              aria-label="Color Picker"
            />
            <div
              className="w-full h-20 rounded-md border shadow-inner"
              style={{ backgroundColor: hex, transition: 'background-color 0.3s ease' }}
              aria-label="Color Preview"
            />
          </div>

          {/* HEX Input */}
          <div className="space-y-2">
            <Label htmlFor="hexInput" className="font-medium">HEX</Label>
            <div className="flex items-center gap-2">
              <Input
                id="hexInput"
                value={hex}
                onChange={handleHexChange}
                onFocus={() => setFocusedInput('hex')}
                onBlur={() => setFocusedInput(null)}
                placeholder="#RRGGBB"
                className="font-mono"
              />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(hex, 'HEX Color')} aria-label="Copy HEX color">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* RGB Inputs */}
          <div className="space-y-2">
            <Label className="font-medium">RGB (Red, Green, Blue)</Label>
            <div className="grid grid-cols-3 gap-x-2 gap-y-2 items-center">
              <div>
                <Label htmlFor="rInput" className="text-xs text-muted-foreground">R</Label>
                <Input id="rInput" type="text" value={r} onChange={(e) => handleRgbChange('r', e.target.value)} onFocus={() => setFocusedInput('r')} onBlur={() => setFocusedInput(null)} placeholder="0-255" />
              </div>
              <div>
                <Label htmlFor="gInput" className="text-xs text-muted-foreground">G</Label>
                <Input id="gInput" type="text" value={g} onChange={(e) => handleRgbChange('g', e.target.value)} onFocus={() => setFocusedInput('g')} onBlur={() => setFocusedInput(null)} placeholder="0-255" />
              </div>
              <div>
                <Label htmlFor="bInput" className="text-xs text-muted-foreground">B</Label>
                <Input id="bInput" type="text" value={b} onChange={(e) => handleRgbChange('b', e.target.value)} onFocus={() => setFocusedInput('b')} onBlur={() => setFocusedInput(null)} placeholder="0-255" />
              </div>
            </div>
             <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => copyToClipboard(`rgb(${r}, ${g}, ${b})`, 'RGB Color')} aria-label="Copy RGB color">
                <Copy className="mr-2 h-4 w-4" /> Copy RGB
            </Button>
          </div>

          {/* HSL Inputs */}
          <div className="space-y-2">
            <Label className="font-medium">HSL (Hue, Saturation, Lightness)</Label>
            <div className="grid grid-cols-3 gap-x-2 gap-y-2 items-center">
              <div>
                <Label htmlFor="hInput" className="text-xs text-muted-foreground">H (°)</Label>
                <Input id="hInput" type="text" value={h} onChange={(e) => handleHslChange('h', e.target.value)} onFocus={() => setFocusedInput('h')} onBlur={() => setFocusedInput(null)} placeholder="0-360" />
              </div>
              <div>
                <Label htmlFor="sInput" className="text-xs text-muted-foreground">S (%)</Label>
                <Input id="sInput" type="text" value={s} onChange={(e) => handleHslChange('s', e.target.value)} onFocus={() => setFocusedInput('s')} onBlur={() => setFocusedInput(null)} placeholder="0-100" />
              </div>
              <div>
                <Label htmlFor="lInput" className="text-xs text-muted-foreground">L (%)</Label>
                <Input id="lInput" type="text" value={l} onChange={(e) => handleHslChange('l', e.target.value)} onFocus={() => setFocusedInput('l')} onBlur={() => setFocusedInput(null)} placeholder="0-100" />
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => copyToClipboard(`hsl(${h}, ${s}%, ${l}%)`, 'HSL Color')} aria-label="Copy HSL color">
                <Copy className="mr-2 h-4 w-4" /> Copy HSL
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

