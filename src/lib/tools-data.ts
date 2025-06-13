
import type { Tool, ToolCategory, TinyWowCategoryCardData } from '@/types/tool';
import {
  QrCode, FileImage, Scaling, Replace, KeyRound, Network, Baseline, Mic, Gauge, CaseSensitive, Binary, Link as LinkIcon, Palette, ArrowRightLeft, Calculator, ClipboardList, FileCode2, FileSpreadsheet, Braces, HardDrive, CodeXml, CircleDollarSign, Cake, TrendingUp, HeartPulse, DollarSign, Landmark, Percent, Receipt, FileText as FileTextIconLucide, LineChart, Combine, Sheet, FileText, Presentation, Unlock, RotateCw, Trash2, Scissors, Image as ImageIconLucide, Eraser, ScanText, ZoomIn, ScanSearch, SplitSquareHorizontal, DatabaseZap, Volume2, Video as VideoIconLucide, Folder, PenTool, Sparkles, LayoutGrid, Box, Settings2, Clapperboard, Shuffle, GanttChartSquare, Users, FileCog, Wrench, Grip, Type as TypeIcon
} from 'lucide-react';

// Maps to ToolCategory in types/tool.ts for internal categorization
type FunctionalToolCategory =
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools'
  | 'Data Converters'
  | 'Calculators'
  | 'Web Utilities'
  | 'File Management'
  | 'Video Tools';

interface FunctionalTool extends Omit<Tool, 'category'> {
  category: FunctionalToolCategory;
  // Header category for dropdowns (PDF, Image, Write, Video, File)
  headerCategory: 'PDF' | 'Image' | 'Write' | 'Video' | 'File' | 'Other';
}


export const TOOLS_DATA: FunctionalTool[] = [
  // PDF Tools
  {
    id: 'image-to-pdf', name: 'Image to PDF Converter', description: 'Convert JPG, PNG, etc. to PDF.', icon: FileImage, href: '/tools/image-to-pdf', category: 'PDF Tools', headerCategory: 'PDF', keywords: ['image', 'pdf', 'converter'],
  },
  {
    id: 'merge-pdf', name: 'Merge PDF Files', description: 'Combine multiple PDF files into one.', icon: Combine, href: '/tools/merge-pdf', category: 'PDF Tools', headerCategory: 'PDF', keywords: ['pdf', 'merge'],
  },
  {
    id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove password protection (password must be known).', icon: Unlock, href: '/tools/unlock-pdf', category: 'PDF Tools', headerCategory: 'PDF', keywords: ['pdf', 'unlock'],
  },
  {
    id: 'rotate-pdf-pages', name: 'Rotate PDF Pages', description: 'Rotate pages in a PDF document.', icon: RotateCw, href: '/tools/rotate-pdf-pages', category: 'PDF Tools', headerCategory: 'PDF', keywords: ['pdf', 'rotate'],
  },
  {
    id: 'delete-pdf-pages', name: 'PDF Page Deleter', description: 'Remove specific pages from your PDF.', icon: Trash2, href: '/tools/pdf-page-deleter', category: 'PDF Tools', headerCategory: 'PDF', keywords: ['pdf', 'delete pages'],
  },
  {
    id: 'extract-pdf-pages', name: 'Extract PDF Pages', description: 'Extract pages from a PDF into a new document.', icon: Scissors, href: '/tools/extract-pdf-pages', category: 'PDF Tools', headerCategory: 'PDF', keywords: ['pdf', 'extract'],
  },
  {
    id: 'pdf-page-to-csv', name: 'PDF Page to CSV', description: 'Extract table from first PDF page to CSV.', icon: Sheet, href: '/tools/pdf-page-to-csv', category: 'PDF Tools', headerCategory: 'PDF', keywords: ['pdf', 'csv', 'table'],
  },
  {
    id: 'pdf-to-word-text-extraction', name: 'PDF to Word (Text Extraction)', description: 'Extract text from PDF (first page) for Word.', icon: FileText, href: '/tools/pdf-to-word-converter', category: 'PDF Tools', headerCategory: 'PDF', keywords: ['pdf', 'word', 'text'],
  },
  {
    id: 'pdf-to-presentation-content-extractor', name: 'PDF to Presentation Content', description: 'Extract text from PDF for presentation slides.', icon: Presentation, href: '/tools/pdf-to-presentation-content-extractor', category: 'PDF Tools', headerCategory: 'PDF', keywords: ['pdf', 'slides'],
  },

  // Image Tools
  {
    id: 'image-resizer', name: 'Image Resizer', description: 'Adjust dimensions of your images.', icon: Scaling, href: '/tools/image-resizer', category: 'Image Tools', headerCategory: 'Image', keywords: ['image', 'resize'],
  },
  {
    id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG images to JPG format.', icon: Replace, href: '/tools/png-to-jpg', category: 'Image Tools', headerCategory: 'Image', keywords: ['png', 'jpg', 'converter'],
  },
  {
    id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG images to PNG format.', icon: Replace, href: '/tools/jpg-to-png', category: 'Image Tools', headerCategory: 'Image', keywords: ['jpg', 'png', 'converter'],
  },
  {
    id: 'webp-to-jpg', name: 'WEBP to JPG', description: 'Convert WEBP images to JPG format.', icon: Replace, href: '/tools/webp-to-jpg', category: 'Image Tools', headerCategory: 'Image', keywords: ['webp', 'jpg', 'converter'],
  },
  {
    id: 'webp-to-png', name: 'WEBP to PNG', description: 'Convert WEBP images to PNG format.', icon: Replace, href: '/tools/webp-to-png', category: 'Image Tools', headerCategory: 'Image', keywords: ['webp', 'png', 'converter'],
  },
  {
    id: 'ai-image-generator', name: 'AI Image Generator', description: 'Create unique images from text prompts.', icon: ImageIconLucide, href: '/tools/ai-image-generator', category: 'Image Tools', headerCategory: 'Image', keywords: ['ai', 'image', 'generator'],
  },
  {
    id: 'image-background-remover', name: 'AI Background Remover', description: 'Remove background from images using AI.', icon: Eraser, href: '/tools/image-background-remover', category: 'Image Tools', headerCategory: 'Image', keywords: ['background remover', 'ai'],
  },
  {
    id: 'ai-image-upscaler', name: 'AI Image Upscaler', description: 'Increase image resolution with AI (Experimental).', icon: ZoomIn, href: '/tools/ai-image-upscaler', category: 'Image Tools', headerCategory: 'Image', keywords: ['ai', 'upscale', 'image'],
  },

  // Text & AI Tools (mapped to "Write" in header)
  {
    id: 'image-to-text-converter', name: 'Image to Text (OCR)', description: 'Extract text from images.', icon: ScanText, href: '/tools/image-to-text-converter', category: 'Text & AI Tools', headerCategory: 'Write', keywords: ['ocr', 'text extraction'],
  },
  {
    id: 'ai-detector', name: 'AI Text Detector', description: 'Estimate if text is AI-generated.', icon: ScanSearch, href: '/tools/ai-detector', category: 'Text & AI Tools', headerCategory: 'Write', keywords: ['ai detector', 'gpt'],
  },
  {
    id: 'voice-to-text', name: 'Voice to Text', description: 'Convert speech to text via AI.', icon: Volume2, href: '/tools/voice-to-text', category: 'Text & AI Tools', headerCategory: 'Write', keywords: ['speech to text', 'transcription'],
  },
  {
    id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, etc.', icon: Baseline, href: '/tools/word-counter', category: 'Text & AI Tools', headerCategory: 'Write', keywords: ['word count', 'text analysis'],
  },
  {
    id: 'text-case-converter', name: 'Text Case Converter', description: 'Convert text to different cases.', icon: CaseSensitive, href: '/tools/text-case-converter', category: 'Text & AI Tools', headerCategory: 'Write', keywords: ['case converter', 'text tools'],
  },
  {
    id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text.', icon: ClipboardList, href: '/tools/lorem-ipsum-generator', category: 'Text & AI Tools', headerCategory: 'Write', keywords: ['lorem ipsum', 'placeholder'],
  },
  {
    id: 'html-formatter', name: 'HTML Formatter', description: 'Format and beautify HTML code.', icon: CodeXml, href: '/tools/html-formatter', category: 'Text & AI Tools', headerCategory: 'Write', keywords: ['html', 'formatter', 'code'],
  },

  // Data Converters (mapped to "File" or "Other" in header for simplicity, or its own category)
  {
    id: 'base64-encoder-decoder', name: 'Base64 Encoder/Decoder', description: 'Encode/Decode Base64 strings.', icon: Binary, href: '/tools/base64-encoder-decoder', category: 'Data Converters', headerCategory: 'File', keywords: ['base64', 'converter'],
  },
  {
    id: 'url-encoder-decoder', name: 'URL Encoder/Decoder', description: 'Encode/Decode URL strings.', icon: LinkIcon, href: '/tools/url-encoder-decoder', category: 'Data Converters', headerCategory: 'File', keywords: ['url', 'converter'],
  },
  {
    id: 'number-system-converter', name: 'Number System Converter', description: 'Convert between number systems.', icon: Calculator, href: '/tools/number-system-converter', category: 'Data Converters', headerCategory: 'File', keywords: ['number system', 'binary', 'hex'],
  },
  {
    id: 'csv-to-json-converter', name: 'CSV to JSON', description: 'Convert CSV data to JSON.', icon: FileCode2, href: '/tools/csv-to-json', category: 'Data Converters', headerCategory: 'File', keywords: ['csv', 'json', 'converter'],
  },
  {
    id: 'json-to-xml-converter', name: 'JSON to XML (AI)', description: 'Convert JSON to XML using AI.', icon: FileCode2, href: '/tools/json-to-xml', category: 'Data Converters', headerCategory: 'File', keywords: ['json', 'xml', 'ai'],
  },
  {
    id: 'xml-to-json-converter', name: 'XML to JSON (AI)', description: 'Convert XML to JSON using AI.', icon: FileCode2, href: '/tools/xml-to-json', category: 'Data Converters', headerCategory: 'File', keywords: ['xml', 'json', 'ai'],
  },
  {
    id: 'csv-to-xml-converter', name: 'CSV to XML (AI)', description: 'Convert CSV to XML using AI.', icon: FileCode2, href: '/tools/csv-to-xml', category: 'Data Converters', headerCategory: 'File', keywords: ['csv', 'xml', 'ai'],
  },
  {
    id: 'csv-to-excel-converter', name: 'CSV to Excel', description: 'Convert CSV to Excel (.xlsx).', icon: FileSpreadsheet, href: '/tools/csv-to-excel', category: 'Data Converters', headerCategory: 'File', keywords: ['csv', 'excel', 'xlsx'],
  },
  {
    id: 'excel-to-csv-converter', name: 'Excel to CSV', description: 'Convert Excel sheets to CSV.', icon: FileSpreadsheet, href: '/tools/excel-to-csv', category: 'Data Converters', headerCategory: 'File', keywords: ['excel', 'csv', 'xlsx'],
  },
  {
    id: 'xml-to-excel-converter', name: 'XML to Excel (AI)', description: 'Convert XML to Excel via AI.', icon: DatabaseZap, href: '/tools/xml-to-excel', category: 'Data Converters', headerCategory: 'File', keywords: ['xml', 'excel', 'ai'],
  },
  {
    id: 'excel-to-xml-converter', name: 'Excel to XML (AI)', description: 'Convert Excel to XML via AI.', icon: DatabaseZap, href: '/tools/excel-to-xml', category: 'Data Converters', headerCategory: 'File', keywords: ['excel', 'xml', 'ai'],
  },
  {
    id: 'json-formatter-validator', name: 'JSON Formatter', description: 'Format & Validate JSON strings.', icon: Braces, href: '/tools/json-formatter-validator', category: 'Data Converters', headerCategory: 'File', keywords: ['json', 'formatter'],
  },

  // File Management
  {
    id: 'split-excel-file', name: 'Split Excel File by Sheet', description: 'Split Excel into separate files per sheet.', icon: Scissors, href: '/tools/split-excel-file', category: 'File Management', headerCategory: 'File', keywords: ['excel', 'split sheet'],
  },
  {
    id: 'split-csv', name: 'Split CSV File', description: 'Split large CSV into smaller files.', icon: SplitSquareHorizontal, href: '/tools/split-csv', category: 'File Management', headerCategory: 'File', keywords: ['csv', 'split file'],
  },

  // Web Utilities (mapped to "Other" in header)
  {
    id: 'qr-code-scanner', name: 'QR Code Scanner', description: 'Scan QR codes with your camera.', icon: QrCode, href: '/tools/qr-code-scanner', category: 'Web Utilities', headerCategory: 'Other', keywords: ['qr code', 'scanner'],
  },
  {
    id: 'password-generator', name: 'Password Generator', description: 'Create strong, random passwords.', icon: KeyRound, href: '/tools/password-generator', category: 'Web Utilities', headerCategory: 'Other', keywords: ['password', 'security'],
  },
  {
    id: 'ip-address-info', name: 'IP Address Information', description: 'Get info about an IP address.', icon: Network, href: '/tools/ip-address-info', category: 'Web Utilities', headerCategory: 'Other', keywords: ['ip address', 'geolocation'],
  },
  {
    id: 'internet-speed-tester', name: 'Internet Speed Test', description: 'Estimate your internet speed.', icon: Gauge, href: '/tools/internet-speed-tester', category: 'Web Utilities', headerCategory: 'Other', keywords: ['speed test', 'internet'],
  },
  {
    id: 'color-converter', name: 'Color Converter', description: 'Convert HEX, RGB, HSL colors.', icon: Palette, href: '/tools/color-converter', category: 'Web Utilities', headerCategory: 'Other', keywords: ['color', 'converter', 'hex', 'rgb'],
  },

  // Calculators (mapped to "Other" in header)
  {
    id: 'file-size-calculator', name: 'File Size Calculator', description: 'Convert B, KB, MB, GB, TB.', icon: HardDrive, href: '/tools/file-size-calculator', category: 'Calculators', headerCategory: 'Other', keywords: ['file size', 'bytes'],
  },
  {
    id: 'loan-calculator', name: 'Loan Calculator', description: 'Estimate loan payments.', icon: CircleDollarSign, href: '/tools/loan-calculator', category: 'Calculators', headerCategory: 'Other', keywords: ['loan', 'amortization'],
  },
  {
    id: 'age-calculator', name: 'Age Calculator', description: 'Calculate age from birth date.', icon: Cake, href: '/tools/age-calculator', category: 'Calculators', headerCategory: 'Other', keywords: ['age', 'birthday'],
  },
  {
    id: 'investment-roi-calculator', name: 'Investment ROI Calculator', description: 'Calculate Return on Investment.', icon: TrendingUp, href: '/tools/investment-roi-calculator', category: 'Calculators', headerCategory: 'Other', keywords: ['roi', 'investment'],
  },
  {
    id: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate Body Mass Index.', icon: HeartPulse, href: '/tools/bmi-calculator', category: 'Calculators', headerCategory: 'Other', keywords: ['bmi', 'health'],
  },
  {
    id: 'salary-converter', name: 'Salary Converter', description: 'Convert hourly to annual salary.', icon: DollarSign, href: '/tools/salary-converter', category: 'Calculators', headerCategory: 'Other', keywords: ['salary', 'wage'],
  },
  {
    id: 'compound-interest-calculator', name: 'Compound Interest Calculator', description: 'Calculate compound interest.', icon: Landmark, href: '/tools/compound-interest-calculator', category: 'Calculators', headerCategory: 'Other', keywords: ['compound interest', 'savings'],
  },
  {
    id: 'percentage-calculator', name: 'Percentage Calculator', description: 'Calculate various percentages.', icon: Percent, href: '/tools/percentage-calculator', category: 'Calculators', headerCategory: 'Other', keywords: ['percentage', 'math'],
  },
  {
    id: 'sales-tax-calculator', name: 'Sales Tax Calculator', description: 'Calculate sales tax and total.', icon: Receipt, href: '/tools/sales-tax-calculator', category: 'Calculators', headerCategory: 'Other', keywords: ['sales tax', 'price'],
  },
  {
    id: 'income-tax-calculator', name: 'Income Tax Calculator', description: 'Estimate income tax (simplified).', icon: FileTextIconLucide, href: '/tools/income-tax-calculator', category: 'Calculators', headerCategory: 'Other', keywords: ['income tax', 'finance'],
  },
  {
    id: 'simple-interest-calculator', name: 'Simple Interest Calculator', description: 'Calculate simple interest.', icon: LineChart, href: '/tools/simple-interest-calculator', category: 'Calculators', headerCategory: 'Other', keywords: ['simple interest', 'finance'],
  },
  {
    id: 'unit-converter', name: 'Unit Converter', description: 'Convert length, weight, temp.', icon: ArrowRightLeft, href: '/tools/unit-converter', category: 'Calculators', headerCategory: 'Other', keywords: ['unit converter', 'measurement'],
  },
  
  // Video Tools (Placeholder - to be populated)
  // {
  //   id: 'video-compressor', name: 'Video Compressor', description: 'Reduce video file size.', icon: VideoIconLucide, href: '/tools/video-compressor', category: 'Video Tools', headerCategory: 'Video', keywords: ['video', 'compress'],
  // },
];


export const HEADER_CATEGORY_ORDER: ToolCategory[] = [
  'PDF Tools',
  'Image Tools',
  'Text & AI Tools',
  'Video Tools',
  'File Management',
  'Data Converters',
  'Calculators',
  'Web Utilities'
];

// Data for TinyWow-style homepage category cards
export const TINY_WOW_CATEGORIES: TinyWowCategoryCardData[] = [
  {
    id: 'pdf',
    title: 'PDF Tools',
    subtitle: 'Solve Your PDF Problems',
    icon: FileText, // Lucide icon for PDF
    label: '45+ tools', // Matches TinyWow style
    featuredToolName: 'PDF Creator',
    href: '/#pdf-tools-section', // Placeholder link, could link to a filtered view or section
    bgColorClass: 'bg-[hsl(var(--card-pdf))]',
    textColorClass: 'text-[hsl(var(--card-pdf-foreground))]'
  },
  {
    id: 'image',
    title: 'Image Tools',
    subtitle: 'Solve Your Image Problems',
    icon: ImageIconLucide, // Lucide icon for Image
    label: '30+ tools',
    featuredToolName: 'Remove Background',
    href: '/#image-tools-section',
    bgColorClass: 'bg-[hsl(var(--card-image))]',
    textColorClass: 'text-[hsl(var(--card-image-foreground))]'
  },
  {
    id: 'video',
    title: 'Video Tools',
    subtitle: 'Solve Your Video Problems',
    icon: VideoIconLucide, // Lucide icon for Video
    label: '10+ tools',
    featuredToolName: 'Mute Video',
    href: '/#video-tools-section',
    bgColorClass: 'bg-[hsl(var(--card-video))]',
    textColorClass: 'text-[hsl(var(--card-video-foreground))]'
  },
  {
    id: 'ai-write',
    title: 'AI Write Tools',
    subtitle: 'Solve Your Text Problems',
    icon: TypeIcon, // Lucide icon for Writing/Text
    label: '10+ tools',
    featuredToolName: 'Essay Writer',
    href: '/#ai-write-tools-section',
    bgColorClass: 'bg-[hsl(var(--card-ai-write))]',
    textColorClass: 'text-[hsl(var(--card-ai-write-foreground))]'
  },
  {
    id: 'file',
    title: 'File Tools',
    subtitle: 'Solve Your File Problems',
    icon: Folder, // Lucide icon for Files
    label: '15+ tools',
    featuredToolName: 'Split Excel',
    href: '/#file-tools-section',
    bgColorClass: 'bg-[hsl(var(--card-file))]',
    textColorClass: 'text-[hsl(var(--card-file-foreground))]'
  },
];

// For Header Navigation Dropdowns - using simplified categories from prompt
export const HEADER_DROPDOWN_CATEGORIES: Array<{ name: 'PDF' | 'Image' | 'Write' | 'Video' | 'File', tools: FunctionalTool[] }> = [
  { name: 'PDF', tools: TOOLS_DATA.filter(tool => tool.headerCategory === 'PDF') },
  { name: 'Image', tools: TOOLS_DATA.filter(tool => tool.headerCategory === 'Image') },
  { name: 'Write', tools: TOOLS_DATA.filter(tool => tool.headerCategory === 'Write') },
  { name: 'Video', tools: TOOLS_DATA.filter(tool => tool.headerCategory === 'Video') }, // Will be empty if no video tools
  { name: 'File', tools: TOOLS_DATA.filter(tool => tool.headerCategory === 'File') },
];

export const ALL_TOOLS_CATEGORY_FOR_HEADER = { name: 'All Tools', tools: TOOLS_DATA };

