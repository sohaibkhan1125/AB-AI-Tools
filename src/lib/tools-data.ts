
import type { Tool } from '@/types/tool';
import { QrCode, FileImage, Scaling, Replace, KeyRound, Network, Baseline, Mic, Gauge, CaseSensitive, Binary, Link as LinkIcon, Palette, ArrowRightLeft, Calculator, ClipboardList, FileCode2, Braces, HardDrive, CodeXml, CircleDollarSign, Cake, TrendingUp, HeartPulse, DollarSign, Landmark, Percent, Receipt, FileText as FileTextIcon, LineChart } from 'lucide-react';

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
    description: 'Convert between various units of measurement like length, weight, temperature.',
    icon: ArrowRightLeft,
    href: '/tools/unit-converter',
    keywords: ['unit', 'converter', 'measurement', 'length', 'weight', 'temperature', 'metric', 'imperial']
  },
  {
    id: 'number-system-converter',
    name: 'Number System Converter',
    description: 'Convert numbers between binary, octal, decimal, and hexadecimal systems.',
    icon: Calculator,
    href: '/tools/number-system-converter',
    keywords: ['number', 'system', 'converter', 'binary', 'octal', 'decimal', 'hexadecimal', 'base']
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum style placeholder text for your projects.',
    icon: ClipboardList,
    href: '/tools/lorem-ipsum-generator',
    keywords: ['lorem ipsum', 'placeholder', 'text', 'generator', 'dummy text', 'latin']
  },
  {
    id: 'csv-to-json-converter',
    name: 'CSV to JSON Converter',
    description: 'Convert CSV data to JSON format. Upload a CSV file for conversion.',
    icon: FileCode2,
    href: '/tools/csv-to-json',
    keywords: ['csv', 'json', 'converter', 'data transformation', 'file conversion']
  },
  {
    id: 'json-formatter-validator',
    name: 'JSON Formatter & Validator',
    description: 'Format and validate JSON strings. Beautify your JSON for readability.',
    icon: Braces,
    href: '/tools/json-formatter-validator',
    keywords: ['json', 'formatter', 'validator', 'linter', 'pretty print', 'beautifier', 'viewer']
  },
  {
    id: 'file-size-calculator',
    name: 'File Size Calculator',
    description: 'Convert file sizes between Bytes, KB, MB, GB, TB, and PB (1KB = 1024 Bytes).',
    icon: HardDrive,
    href: '/tools/file-size-calculator',
    keywords: ['file size', 'bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'converter', 'calculator', 'storage']
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Format and beautify your HTML code for better readability.',
    icon: CodeXml,
    href: '/tools/html-formatter',
    keywords: ['html', 'formatter', 'beautifier', 'code', 'markup', 'format', 'pretty print']
  },
  {
    id: 'loan-calculator',
    name: 'Loan Calculator',
    description: 'Calculate monthly payments, total interest, and amortization for loans.',
    icon: CircleDollarSign,
    href: '/tools/loan-calculator',
    keywords: ['loan', 'mortgage', 'finance', 'payment', 'interest', 'amortization', 'calculator']
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate age based on a given birth date, showing years, months, and days.',
    icon: Cake,
    href: '/tools/age-calculator',
    keywords: ['age', 'birthday', 'date', 'calculator', 'years', 'months', 'days']
  },
  {
    id: 'investment-roi-calculator',
    name: 'Investment ROI Calculator',
    description: 'Calculate the Return on Investment (ROI) for an investment.',
    icon: TrendingUp,
    href: '/tools/investment-roi-calculator',
    keywords: ['roi', 'investment', 'return', 'profit', 'loss', 'finance', 'calculator']
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) and understand your weight category.',
    icon: HeartPulse,
    href: '/tools/bmi-calculator',
    keywords: ['bmi', 'body mass index', 'health', 'weight', 'fitness', 'calculator']
  },
  {
    id: 'salary-converter',
    name: 'Salary Converter',
    description: 'Convert between hourly, weekly, monthly, and annual salary rates.',
    icon: DollarSign,
    href: '/tools/salary-converter',
    keywords: ['salary', 'wage', 'income', 'pay', 'converter', 'hourly', 'annual', 'finance']
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    description: 'Calculate the future value of an investment with compound interest and optional annual contributions.',
    icon: Landmark,
    href: '/tools/compound-interest-calculator',
    keywords: ['compound interest', 'investment', 'savings', 'future value', 'finance', 'calculator', 'interest rate']
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, find what percentage X is of Y, and percentage changes.',
    icon: Percent,
    href: '/tools/percentage-calculator',
    keywords: ['percentage', 'percent', 'calculator', 'math', 'finance', 'discount', 'increase', 'decrease']
  },
  {
    id: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    description: 'Calculate sales tax and total price based on amount and tax rate.',
    icon: Receipt,
    href: '/tools/sales-tax-calculator',
    keywords: ['sales tax', 'tax', 'vat', 'gst', 'calculator', 'price', 'finance']
  },
  {
    id: 'income-tax-calculator',
    name: 'Simple Income Tax Calculator',
    description: 'Estimate income tax based on a simplified progressive tax bracket system.',
    icon: FileTextIcon,
    href: '/tools/income-tax-calculator',
    keywords: ['income tax', 'tax brackets', 'taxation', 'finance', 'calculator', 'salary']
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    description: 'Calculate simple interest earned and total amount on a principal.',
    icon: LineChart,
    href: '/tools/simple-interest-calculator',
    keywords: ['simple interest', 'interest', 'finance', 'investment', 'savings', 'calculator']
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
