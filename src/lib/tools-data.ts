
import type { Tool, ToolCategory } from '@/types/tool';
import {
  QrCode, FileImage, Scaling, Replace, KeyRound, Network, Baseline, Mic, Gauge, CaseSensitive, Binary, Link as LinkIcon, Palette, ArrowRightLeft, Calculator, ClipboardList, FileCode2, FileSpreadsheet, Braces, HardDrive, CodeXml, CircleDollarSign, Cake, TrendingUp, HeartPulse, DollarSign, Landmark, Percent, Receipt, FileText as FileTextIcon, LineChart, Combine, Sheet, FileText, Presentation, Unlock, RotateCw, Trash2, Scissors, Image as ImageIconLucide, Eraser, ScanText, ZoomIn, ScanSearch, SplitSquareHorizontal, DatabaseZap, Volume2, Video as VideoIcon, Folder, PenTool, Sparkles, LayoutGrid, Box, Settings2, Clapperboard, Shuffle, GanttChartSquare
} from 'lucide-react';

// Helper to determine broader display/filter category
const getFilterCategory = (toolCategory: ToolCategory): ToolCategory => {
  switch (toolCategory) {
    case 'PDF Tools': return 'PDF Tools';
    case 'Image Tools': return 'Image Tools';
    case 'Video Tools': return 'Video Tools';
    case 'Text & AI Tools': return 'AI Write'; // Maps to "AI Write" filter
    case 'Data Converters':
    case 'File Management': // Group File Management under Converters for filter simplicity for now
      return 'Converter Tools';
    case 'Calculators':
    case 'Web Utilities':
      return 'Other Tools';
    default:
      return toolCategory; // Should not happen if all are mapped
  }
};


export const TOOLS_DATA: Tool[] = [
  {
    id: 'qr-code-scanner',
    name: 'QR Code Scanner',
    description: 'Scan QR codes quickly and easily using your device camera.',
    icon: QrCode,
    href: '/tools/qr-code-scanner',
    category: 'Web Utilities',
    displayCategory: 'Other Tools',
    keywords: ['qr', 'scanner', 'code', 'barcode']
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF Converter',
    description: 'Convert JPG, PNG, WEBP, GIF and other image formats to PDF documents. Handles multiple images.',
    icon: FileImage,
    href: '/tools/image-to-pdf',
    category: 'PDF Tools',
    displayCategory: 'PDF Tools',
    isFeaturedCategory: true,
    keywords: ['image', 'pdf', 'converter', 'jpg', 'png', 'webp', 'gif']
  },
  {
    id: 'webp-to-pdf', // Will show under PDF Tools
    name: 'WEBP to PDF Converter',
    description: 'Easily convert your WEBP image files into PDF documents. Supports single or multiple WEBP files.',
    icon: FileImage,
    href: '/tools/image-to-pdf', // Assuming it uses the same page
    category: 'PDF Tools',
    displayCategory: 'PDF Tools',
    keywords: ['webp', 'pdf', 'converter', 'image']
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF Files',
    description: 'Combine multiple PDF files into a single document. Reorder files as needed.',
    icon: Combine,
    href: '/tools/merge-pdf',
    category: 'PDF Tools',
    displayCategory: 'PDF Tools',
    isFeaturedCategory: true, // For header
    keywords: ['pdf', 'merge', 'combine', 'join', 'document management']
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove password protection from a PDF file (password must be known).',
    icon: Unlock,
    href: '/tools/unlock-pdf',
    category: 'PDF Tools',
    displayCategory: 'PDF Tools',
    keywords: ['pdf', 'unlock', 'remove password', 'decrypt', 'security']
  },
  {
    id: 'rotate-pdf-pages',
    name: 'Rotate PDF Pages',
    description: 'Rotate specific pages or all pages in a PDF document by 90, 180, or 270 degrees.',
    icon: RotateCw,
    href: '/tools/rotate-pdf-pages',
    category: 'PDF Tools',
    displayCategory: 'PDF Tools',
    keywords: ['pdf', 'rotate', 'edit', 'pages', 'orientation', 'document']
  },
  {
    id: 'delete-pdf-pages',
    name: 'PDF Page Deleter',
    description: 'Remove specific pages from your PDF documents.',
    icon: Trash2,
    href: '/tools/pdf-page-deleter',
    category: 'PDF Tools',
    displayCategory: 'PDF Tools',
    keywords: ['pdf', 'delete pages', 'remove pages', 'edit pdf', 'document management']
  },
  {
    id: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    description: 'Select and extract specific pages or page ranges from a PDF into a new document.',
    icon: Scissors,
    href: '/tools/extract-pdf-pages',
    category: 'PDF Tools',
    displayCategory: 'PDF Tools',
    keywords: ['pdf', 'extract', 'split', 'pages', 'select pages', 'document management']
  },
  {
    id: 'pdf-page-to-csv',
    name: 'PDF Page to CSV Converter',
    description: 'Extracts tabular data from a single PDF page and converts it to CSV format, ready for Excel.',
    icon: Sheet,
    href: '/tools/pdf-page-to-csv',
    category: 'PDF Tools', // Could also be Converter
    displayCategory: 'PDF Tools',
    keywords: ['pdf', 'csv', 'excel', 'table extraction', 'data conversion', 'ocr']
  },
  {
    id: 'pdf-to-word-text-extraction',
    name: 'PDF to Word (Text Extraction)',
    description: 'Extracts text from the first page of a PDF using AI. Output is plain text, copyable to Word.',
    icon: FileText,
    href: '/tools/pdf-to-word-converter',
    category: 'PDF Tools', // Could also be Converter or AI Write
    displayCategory: 'PDF Tools',
    keywords: ['pdf', 'word', 'text extraction', 'converter', 'ocr', 'document']
  },
  {
    id: 'pdf-to-presentation-content-extractor',
    name: 'PDF to Presentation Content Extractor',
    description: 'Extracts text from PDF pages (first 5 pages) to help build presentation slides.',
    icon: Presentation,
    href: '/tools/pdf-to-presentation-content-extractor',
    category: 'PDF Tools', // Or AI Write
    displayCategory: 'PDF Tools',
    keywords: ['pdf', 'powerpoint', 'presentation', 'slides', 'text extraction', 'ocr']
  },
  {
    id: 'image-to-text-converter',
    name: 'Image to Text Converter (OCR)',
    description: 'Extract text from images (JPG, PNG, etc.) using Optical Character Recognition (OCR).',
    icon: ScanText,
    href: '/tools/image-to-text-converter',
    category: 'Image Tools', // Or AI Write
    displayCategory: 'Image Tools',
    keywords: ['ocr', 'image to text', 'text extraction', 'scan', 'picture to text']
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to your desired dimensions and format.',
    icon: Scaling,
    href: '/tools/image-resizer',
    category: 'Image Tools',
    displayCategory: 'Image Tools',
    isFeaturedCategory: true, // For header
    keywords: ['image', 'resize', 'dimensions', 'scaler', 'photo']
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    description: 'Convert PNG images to JPG format with quality adjustment.',
    icon: Replace,
    href: '/tools/png-to-jpg',
    category: 'Image Tools', // Could be Converter Tools
    displayCategory: 'Image Tools',
    keywords: ['png', 'jpg', 'jpeg', 'converter', 'image format']
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    description: 'Convert JPG/JPEG images to PNG format.',
    icon: Replace,
    href: '/tools/jpg-to-png',
    category: 'Image Tools', // Could be Converter Tools
    displayCategory: 'Image Tools',
    keywords: ['jpg', 'jpeg', 'png', 'converter', 'image format']
  },
  {
    id: 'webp-to-jpg',
    name: 'WEBP to JPG Converter',
    description: 'Convert WEBP images to JPG format with adjustable quality.',
    icon: Replace,
    href: '/tools/webp-to-jpg',
    category: 'Image Tools', // Could be Converter Tools
    displayCategory: 'Image Tools',
    keywords: ['webp', 'jpg', 'jpeg', 'converter', 'image format']
  },
  {
    id: 'webp-to-png',
    name: 'WEBP to PNG Converter',
    description: 'Convert your WEBP images to high-quality PNG format, preserving transparency.',
    icon: Replace,
    href: '/tools/webp-to-png',
    category: 'Image Tools', // Could be Converter Tools
    displayCategory: 'Image Tools',
    keywords: ['webp', 'png', 'converter', 'image format', 'transparency']
  },
  {
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'Create unique images from text prompts using cutting-edge AI.',
    icon: ImageIconLucide,
    href: '/tools/ai-image-generator',
    category: 'Image Tools', // Could be AI Write
    displayCategory: 'Image Tools',
    keywords: ['ai', 'image', 'generator', 'art', 'creative', 'generative art', 'text to image']
  },
  {
    id: 'ai-image-background-remover',
    name: 'AI Image Background Remover',
    description: 'Upload an image and let AI attempt to remove its background, making it transparent.',
    icon: Eraser,
    href: '/tools/image-background-remover',
    category: 'Image Tools', // Could be AI Write
    displayCategory: 'Image Tools',
    keywords: ['background remover', 'transparent background', 'image editing', 'ai', 'png', 'remove bg']
  },
  {
    id: 'ai-image-upscaler',
    name: 'AI Image Upscaler (Experimental)',
    description: 'Attempt to increase the resolution and enhance details of your images using AI. Results are experimental and may vary.',
    icon: ZoomIn,
    href: '/tools/ai-image-upscaler',
    category: 'Image Tools', // Could be AI Write
    displayCategory: 'Image Tools',
    keywords: ['ai', 'image', 'upscale', 'super resolution', 'enhance', 'details', 'experimental']
  },
  {
    id: 'ai-detector',
    name: 'AI Text Detector',
    description: 'Analyzes text to estimate the likelihood of it being AI-generated. Provides an assessment and reasoning.',
    icon: ScanSearch,
    href: '/tools/ai-detector',
    category: 'Text & AI Tools',
    displayCategory: 'AI Write',
    isFeaturedCategory: true, // For header
    keywords: ['ai detector', 'text analysis', 'content authenticity', 'ai writing', 'gpt detector']
  },
  {
    id: 'voice-to-text',
    name: 'Voice to Text Converter',
    description: 'Record your voice and convert it into text using AI transcription.',
    icon: Volume2,
    href: '/tools/voice-to-text',
    category: 'Text & AI Tools',
    displayCategory: 'AI Write',
    keywords: ['speech to text', 'transcription', 'audio', 'voice recognition', 'ai']
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong, random passwords with customizable options.',
    icon: KeyRound,
    href: '/tools/password-generator',
    category: 'Web Utilities',
    displayCategory: 'Other Tools',
    keywords: ['password', 'security', 'generator', 'secure', 'random']
  },
  {
    id: 'ip-address-info',
    name: 'IP Address Information',
    description: 'Get information about an IP address, including location and ISP.',
    icon: Network,
    href: '/tools/ip-address-info',
    category: 'Web Utilities',
    displayCategory: 'Other Tools',
    keywords: ['ip', 'address', 'location', 'isp', 'network', 'geolocation']
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in your text.',
    icon: Baseline,
    href: '/tools/word-counter',
    category: 'Text & AI Tools',
    displayCategory: 'AI Write',
    keywords: ['text', 'analysis', 'word count', 'character count', 'sentence count', 'paragraph count']
  },
  {
    id: 'internet-speed-tester',
    name: 'Internet Speed Test',
    description: 'Estimate your download speed and network latency. Upload speed test not available.',
    icon: Gauge,
    href: '/tools/internet-speed-tester',
    category: 'Web Utilities',
    displayCategory: 'Other Tools',
    keywords: ['internet speed', 'download', 'latency', 'ping', 'bandwidth', 'connection test']
  },
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    description: 'Convert text to various cases like uppercase, lowercase, title case, etc.',
    icon: CaseSensitive,
    href: '/tools/text-case-converter',
    category: 'Text & AI Tools',
    displayCategory: 'AI Write',
    keywords: ['text', 'case', 'converter', 'uppercase', 'lowercase', 'title case', 'sentence case']
  },
  {
    id: 'base64-encoder-decoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 strings back to text.',
    icon: Binary,
    href: '/tools/base64-encoder-decoder',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['base64', 'encode', 'decode', 'binary', 'text', 'converter', 'ascii', 'utf8']
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    description: 'Encode text to URL-safe format or decode URL-encoded strings.',
    icon: LinkIcon,
    href: '/tools/url-encoder-decoder',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['url', 'encode', 'decode', 'percent encoding', 'uri', 'query string']
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, and HSL formats.',
    icon: Palette,
    href: '/tools/color-converter',
    category: 'Web Utilities', // Could be Converter or Other
    displayCategory: 'Other Tools',
    keywords: ['color', 'converter', 'hex', 'rgb', 'hsl', 'picker', 'palette']
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between various units of measurement like length, weight, temperature.',
    icon: ArrowRightLeft,
    href: '/tools/unit-converter',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['unit', 'converter', 'measurement', 'length', 'weight', 'temperature', 'metric', 'imperial']
  },
  {
    id: 'number-system-converter',
    name: 'Number System Converter',
    description: 'Convert numbers between binary, octal, decimal, and hexadecimal systems.',
    icon: Calculator,
    href: '/tools/number-system-converter',
    category: 'Data Converters', // Or Calculators
    displayCategory: 'Converter Tools',
    keywords: ['number', 'system', 'converter', 'binary', 'octal', 'decimal', 'hexadecimal', 'base']
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum style placeholder text for your projects.',
    icon: ClipboardList,
    href: '/tools/lorem-ipsum-generator',
    category: 'Text & AI Tools',
    displayCategory: 'AI Write',
    isFeaturedCategory: true, // For header
    keywords: ['lorem ipsum', 'placeholder', 'text', 'generator', 'dummy text', 'latin']
  },
  {
    id: 'csv-to-json-converter',
    name: 'CSV to JSON Converter',
    description: 'Convert CSV data to JSON format. Upload a CSV file for conversion.',
    icon: FileCode2,
    href: '/tools/csv-to-json',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['csv', 'json', 'converter', 'data transformation', 'file conversion']
  },
  {
    id: 'json-to-xml-converter',
    name: 'JSON to XML Converter (AI Assisted)',
    description: 'Convert JSON data structures into XML format using AI-assisted transformation.',
    icon: FileCode2,
    href: '/tools/json-to-xml',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['json', 'xml', 'converter', 'data transformation', 'ai', 'file conversion']
  },
  {
    id: 'xml-to-json-converter',
    name: 'XML to JSON Converter (AI Assisted)',
    description: 'Convert XML data structures into JSON format using AI-assisted transformation.',
    icon: FileCode2,
    href: '/tools/xml-to-json',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['xml', 'json', 'converter', 'data transformation', 'ai', 'file conversion']
  },
  {
    id: 'csv-to-xml-converter',
    name: 'CSV to XML Converter (AI Assisted)',
    description: 'Convert CSV data into XML format using AI-assisted transformation. Paste or upload CSV.',
    icon: FileCode2,
    href: '/tools/csv-to-xml',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['csv', 'xml', 'converter', 'data transformation', 'ai', 'file conversion']
  },
  {
    id: 'csv-to-excel-converter',
    name: 'CSV to Excel Converter',
    description: 'Convert CSV files to Excel (.xlsx) format directly in your browser.',
    icon: FileSpreadsheet,
    href: '/tools/csv-to-excel',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['csv', 'excel', 'xlsx', 'converter', 'spreadsheet', 'data conversion']
  },
  {
    id: 'excel-to-csv-converter',
    name: 'Excel to CSV Converter',
    description: 'Convert sheets from Excel files (.xlsx, .xls) into CSV format.',
    icon: FileSpreadsheet,
    href: '/tools/excel-to-csv',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['excel', 'csv', 'xlsx', 'xls', 'converter', 'spreadsheet', 'data extraction']
  },
  {
    id: 'split-excel-file',
    name: 'Split Excel File by Sheet',
    description: 'Split an Excel workbook into separate files, one for each sheet.',
    icon: Scissors,
    href: '/tools/split-excel-file',
    category: 'File Management',
    displayCategory: 'Other Tools', // Grouping for the filter bar
    keywords: ['excel', 'split', 'sheet', 'workbook', 'xlsx', 'xls', 'separate']
  },
  {
    id: 'xml-to-excel-converter',
    name: 'XML to Excel Converter (AI Assisted)',
    description: 'Upload XML. AI attempts to extract tabular data, which is then converted to an Excel (.xlsx) file.',
    icon: DatabaseZap,
    href: '/tools/xml-to-excel',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['xml', 'excel', 'xlsx', 'converter', 'data extraction', 'ai', 'table']
  },
  {
    id: 'excel-to-xml-converter',
    name: 'Excel to XML Converter (AI Assisted)',
    description: 'Upload an Excel file. Data from the first sheet will be converted to XML format using AI.',
    icon: DatabaseZap,
    href: '/tools/excel-to-xml',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['excel', 'xml', 'converter', 'data extraction', 'ai', 'table', 'xlsx']
  },
  {
    id: 'json-formatter-validator',
    name: 'JSON Formatter & Validator',
    description: 'Format and validate JSON strings. Beautify your JSON for readability.',
    icon: Braces,
    href: '/tools/json-formatter-validator',
    category: 'Data Converters',
    displayCategory: 'Converter Tools',
    keywords: ['json', 'formatter', 'validator', 'linter', 'pretty print', 'beautifier', 'viewer']
  },
  {
    id: 'file-size-calculator',
    name: 'File Size Calculator',
    description: 'Convert file sizes between Bytes, KB, MB, GB, TB, and PB (1KB = 1024 Bytes).',
    icon: HardDrive,
    href: '/tools/file-size-calculator',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['file size', 'bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'converter', 'calculator', 'storage']
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Format and beautify your HTML code for better readability.',
    icon: CodeXml,
    href: '/tools/html-formatter',
    category: 'Text & AI Tools', // or Web Utilities
    displayCategory: 'AI Write',
    keywords: ['html', 'formatter', 'beautifier', 'code', 'markup', 'format', 'pretty print']
  },
  {
    id: 'loan-calculator',
    name: 'Loan Calculator',
    description: 'Estimate your monthly loan payments, total interest, and see an amortization schedule.',
    icon: CircleDollarSign,
    href: '/tools/loan-calculator',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['loan', 'mortgage', 'finance', 'payment', 'interest', 'amortization', 'calculator']
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate age based on a given birth date, showing years, months, and days.',
    icon: Cake,
    href: '/tools/age-calculator',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['age', 'birthday', 'date', 'calculator', 'years', 'months', 'days']
  },
  {
    id: 'investment-roi-calculator',
    name: 'Investment ROI Calculator',
    description: 'Calculate the Return on Investment (ROI) for an investment.',
    icon: TrendingUp,
    href: '/tools/investment-roi-calculator',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['roi', 'investment', 'return', 'profit', 'loss', 'finance', 'calculator']
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) and understand your weight category.',
    icon: HeartPulse,
    href: '/tools/bmi-calculator',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['bmi', 'body mass index', 'health', 'weight', 'fitness', 'calculator']
  },
  {
    id: 'salary-converter',
    name: 'Salary Converter',
    description: 'Convert between hourly, weekly, monthly, and annual salary rates.',
    icon: DollarSign,
    href: '/tools/salary-converter',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['salary', 'wage', 'income', 'pay', 'converter', 'hourly', 'annual', 'finance']
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    description: 'Calculate the future value of an investment with compound interest and optional annual contributions.',
    icon: Landmark,
    href: '/tools/compound-interest-calculator',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['compound interest', 'investment', 'savings', 'future value', 'finance', 'calculator', 'interest rate']
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, find what percentage X is of Y, and percentage changes.',
    icon: Percent,
    href: '/tools/percentage-calculator',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['percentage', 'percent', 'calculator', 'math', 'finance', 'discount', 'increase', 'decrease']
  },
  {
    id: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    description: 'Calculate sales tax and total price based on amount and tax rate.',
    icon: Receipt,
    href: '/tools/sales-tax-calculator',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['sales tax', 'tax', 'vat', 'gst', 'calculator', 'price', 'finance']
  },
  {
    id: 'income-tax-calculator',
    name: 'Simple Income Tax Calculator',
    description: 'Estimate income tax based on a simplified progressive tax bracket system.',
    icon: FileTextIcon,
    href: '/tools/income-tax-calculator',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['income tax', 'tax brackets', 'taxation', 'finance', 'calculator', 'salary']
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    description: 'Calculate simple interest earned and total amount on a principal.',
    icon: LineChart,
    href: '/tools/simple-interest-calculator',
    category: 'Calculators',
    displayCategory: 'Other Tools',
    keywords: ['simple interest', 'interest', 'finance', 'investment', 'savings', 'calculator']
  },
  {
    id: 'split-csv',
    name: 'Split CSV File',
    description: 'Split a large CSV file into multiple smaller CSV files based on number of rows.',
    icon: SplitSquareHorizontal,
    href: '/tools/split-csv',
    category: 'File Management',
    displayCategory: 'Other Tools', // Grouping for the filter bar
    keywords: ['csv', 'split', 'chunk', 'data processing', 'file utility']
  }
];

export const POPULAR_TOOLS_CONFIG: Array<Pick<Tool, 'id' | 'name' | 'description' | 'href' | 'icon'> & { displayCategory: ToolCategory, filterCategories: ToolCategory[] }> = [
  {
    id: 'lorem-ipsum-generator', // Essay Writer
    name: 'Essay Writer',
    description: 'Easily create an essay with AI.',
    icon: Sparkles, // Using Sparkles as per "AI Write"
    href: '/tools/lorem-ipsum-generator',
    displayCategory: 'AI Write',
    filterCategories: ['AI Write', 'Text & AI Tools'],
  },
  {
    id: 'ai-detector', // Content Improver
    name: 'Content Improver',
    description: 'Improve your content.',
    icon: Sparkles,
    href: '/tools/ai-detector',
    displayCategory: 'AI Write',
    filterCategories: ['AI Write', 'Text & AI Tools'],
  },
  {
    id: 'lorem-ipsum-generator', // Paragraph Writer - re-using for now
    name: 'Paragraph Writer',
    description: 'Paragraph Writer.',
    icon: Sparkles,
    href: '/tools/lorem-ipsum-generator',
    displayCategory: 'AI Write',
    filterCategories: ['AI Write', 'Text & AI Tools'],
  },
  {
    id: 'ai-image-background-remover',
    name: 'Remove Background...',
    description: 'Easily Remove the Background from an image.',
    icon: Eraser,
    href: '/tools/image-background-remover',
    displayCategory: 'Image Tools',
    filterCategories: ['Image Tools'],
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Merge 2 or more PDF files into a single PDF file.',
    icon: Combine,
    href: '/tools/merge-pdf',
    displayCategory: 'PDF Tools',
    filterCategories: ['PDF Tools'],
  },
  {
    id: 'rotate-pdf-pages', // Edit PDF
    name: 'Edit PDF',
    description: 'Free PDF Editor.',
    icon: FileTextIcon, // Generic PDF icon
    href: '/tools/rotate-pdf-pages', // Or any other PDF editing tool
    displayCategory: 'PDF Tools',
    filterCategories: ['PDF Tools'],
  },
  {
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'AI Image Generator.',
    icon: ImageIconLucide,
    href: '/tools/ai-image-generator',
    displayCategory: 'Image Tools',
    filterCategories: ['Image Tools'],
  },
  {
    id: 'pdf-to-word-text-extraction', // PDF to JPG - using PDF to Text for now
    name: 'PDF to JPG',
    description: 'Convert PDF to JPG and download each page as an image.',
    icon: FileImage, // Icon for image related PDF tool
    href: '/tools/pdf-to-word-converter', // No direct PDF to JPG, use a related one
    displayCategory: 'PDF Tools',
    filterCategories: ['PDF Tools', 'Converter Tools'], // Relevant to both
  },
];

export const FILTER_CATEGORIES: Array<{ name: ToolCategory, icon: LucideIcon, mapping?: ToolCategory[] }> = [
    { name: 'All Tools', icon: LayoutGrid },
    { name: 'PDF Tools', icon: FileTextIcon, mapping: ['PDF Tools'] },
    { name: 'Video Tools', icon: VideoIcon, mapping: ['Video Tools'] }, // Placeholder, no tools yet
    { name: 'Image Tools', icon: ImageIconLucide, mapping: ['Image Tools'] },
    { name: 'Converter Tools', icon: Replace, mapping: ['Data Converters', 'File Management'] }, // Grouping
    { name: 'Other Tools', icon: Settings2, mapping: ['Web Utilities', 'Calculators'] }, // Grouping
    { name: 'AI Write', icon: Sparkles, mapping: ['Text & AI Tools'] },
];
