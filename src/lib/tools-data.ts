
import type { Tool } from '@/types/tool';
import { QrCode, FileImage, Scaling, Replace, KeyRound, Network, Baseline, Mic, Gauge, CaseSensitive, Binary, Link as LinkIcon, Palette, ArrowRightLeft } from 'lucide-react';

// A helper component if we want to combine icons, or use a more complex one.
// For now, we'll use single icons.
// const ImageToPdfIcon = () => (
//   <span className="relative">
//     <FileImage className="h-5 w-5 absolute opacity-70 -translate-x-1 -translate-y-1" />
//     <FileText className="h-5 w-5 relative" />
//   </span>
// );


export const TOOLS_DATA: Tool[] = [
  {
    id: 'qr-code-scanner',
    name: 'QR Code Scanner',
    description: 'Scan QR codes quickly and easily using your device camera.',
    icon: QrCode,
    href: '/tools/qr-code-scanner',
    keywords: ['qr', 'scanner', 'code', 'barcode']
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF Converter',
    description: 'Convert JPG, PNG, and other image formats to PDF documents.',
    icon: FileImage, 
    href: '/tools/image-to-pdf',
    keywords: ['image', 'pdf', 'converter', 'jpg', 'png']
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to your desired dimensions and format.',
    icon: Scaling,
    href: '/tools/image-resizer',
    keywords: ['image', 'resize', 'dimensions', 'scaler', 'photo']
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    description: 'Convert PNG images to JPG format with quality adjustment.',
    icon: Replace, 
    href: '/tools/png-to-jpg',
    keywords: ['png', 'jpg', 'jpeg', 'converter', 'image format']
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    description: 'Convert JPG/JPEG images to PNG format.',
    icon: Replace, 
    href: '/tools/jpg-to-png',
    keywords: ['jpg', 'jpeg', 'png', 'converter', 'image format']
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong, random passwords with customizable options.',
    icon: KeyRound,
    href: '/tools/password-generator',
    keywords: ['password', 'security', 'generator', 'secure', 'random']
  },
  {
    id: 'ip-address-info',
    name: 'IP Address Information',
    description: 'Get information about an IP address, including location and ISP.',
    icon: Network,
    href: '/tools/ip-address-info',
    keywords: ['ip', 'address', 'location', 'isp', 'network', 'geolocation']
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in your text.',
    icon: Baseline,
    href: '/tools/word-counter',
    keywords: ['text', 'analysis', 'word count', 'character count', 'sentence count', 'paragraph count']
  },
  {
    id: 'voice-to-text',
    name: 'Voice to Text Converter',
    description: 'Convert spoken audio into written text using AI.',
    icon: Mic,
    href: '/tools/voice-to-text',
    keywords: ['speech recognition', 'transcription', 'audio', 'dictation']
  },
  {
    id: 'internet-speed-tester',
    name: 'Internet Speed Test',
    description: 'Estimate your download speed and network latency. Upload speed test not available.',
    icon: Gauge,
    href: '/tools/internet-speed-tester',
    keywords: ['internet speed', 'download', 'latency', 'ping', 'bandwidth', 'connection test']
  },
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    description: 'Convert text to various cases like uppercase, lowercase, title case, etc.',
    icon: CaseSensitive,
    href: '/tools/text-case-converter',
    keywords: ['text', 'case', 'converter', 'uppercase', 'lowercase', 'title case', 'sentence case']
  },
  {
    id: 'base64-encoder-decoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 strings back to text.',
    icon: Binary,
    href: '/tools/base64-encoder-decoder',
    keywords: ['base64', 'encode', 'decode', 'binary', 'text', 'converter', 'ascii', 'utf8']
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    description: 'Encode text to URL-safe format or decode URL-encoded strings.',
    icon: LinkIcon,
    href: '/tools/url-encoder-decoder',
    keywords: ['url', 'encode', 'decode', 'percent encoding', 'uri', 'query string']
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, and HSL formats.',
    icon: Palette,
    href: '/tools/color-converter',
    keywords: ['color', 'converter', 'hex', 'rgb', 'hsl', 'picker', 'palette']
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert various units of measurement like length, weight, temperature.',
    icon: ArrowRightLeft,
    href: '/tools/unit-converter',
    keywords: ['unit', 'converter', 'measurement', 'length', 'weight', 'temperature', 'metric', 'imperial']
  }
  // Add more tools here in the future
  // Example:
  // {
  //   id: 'text-analyzer',
  //   name: 'Text Analyzer',
  //   description: 'Analyze text for word count, character count, and more.',
  //   icon: CaseSensitive,
  //   href: '/tools/text-analyzer',
  //   keywords: ['text', 'analysis', 'word count']
  // },
];
