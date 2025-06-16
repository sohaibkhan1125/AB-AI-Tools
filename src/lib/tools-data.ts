
import type { Tool, TinyWowCategoryCardData, FunctionalToolCategory, FeaturedStripTool } from '@/types/tool';
import {
  QrCode, FileImage, Scaling, Replace, KeyRound, Network, Baseline, Mic, Gauge, CaseSensitive, Binary, Link as LinkIcon, Palette, ArrowRightLeft, Calculator, ClipboardList, FileCode2, FileSpreadsheet, Braces, HardDrive, CodeXml, CircleDollarSign, Cake, TrendingUp, HeartPulse, DollarSign, Landmark, Percent, Receipt, FileText as FileTextIconLucide, LineChart, Combine, Sheet, FileText, Presentation, Unlock, RotateCw, Trash2, Scissors, Image as ImageIconLucide, Eraser, ScanText, ZoomIn, ScanSearch, SplitSquareHorizontal, DatabaseZap, Volume2, Video as VideoIconLucide, Folder, PenTool, Sparkles, LayoutGrid, Box, Settings2, Clapperboard, Shuffle, GanttChartSquare, Users, FileCog, Wrench, Grip, Type as TypeIcon, ListFilter, ArrowLeftRight
} from 'lucide-react';


interface AppTool extends Tool {
  functionalCategory: FunctionalToolCategory; 
}

export const TOOLS_DATA: AppTool[] = [
  // PDF Tools
  {
    id: 'image-to-pdf', name: 'Image to PDF Converter', description: 'Convert JPG, PNG, etc. to PDF.', icon: FileImage, href: '/tools/image-to-pdf', functionalCategory: 'PDF Tools', headerCategory: 'PDF',
    popularCardName: 'Image to PDF', popularCardDescription: 'Convert various image formats to PDF files.', popularDisplayCategory: 'Pdf Tools', isPopular: true,
  },
  {
    id: 'merge-pdf', name: 'Merge PDF Files', description: 'Combine multiple PDF files into one.', icon: Combine, href: '/tools/merge-pdf', functionalCategory: 'PDF Tools', headerCategory: 'PDF',
    popularCardName: 'Merge PDF', popularCardDescription: 'Merge 2 or more PDF files into a single PDF file.', popularDisplayCategory: 'Pdf Tools', isPopular: true,
  },
  {
    id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove password protection (password must be known).', icon: Unlock, href: '/tools/unlock-pdf', functionalCategory: 'PDF Tools', headerCategory: 'PDF',
  },
  {
    id: 'rotate-pdf-pages', name: 'Rotate PDF Pages', description: 'Rotate pages in a PDF document.', icon: RotateCw, href: '/tools/rotate-pdf-pages', functionalCategory: 'PDF Tools', headerCategory: 'PDF',
  },
  {
    id: 'delete-pdf-pages', name: 'PDF Page Deleter', description: 'Remove specific pages from your PDF.', icon: Trash2, href: '/tools/pdf-page-deleter', functionalCategory: 'PDF Tools', headerCategory: 'PDF',
    popularCardName: 'Edit PDF', popularCardDescription: 'Free PDF Editor - delete or modify pages.', popularDisplayCategory: 'Pdf Tools', isPopular: true,
  },
  {
    id: 'extract-pdf-pages', name: 'Extract PDF Pages', description: 'Extract pages from a PDF into a new document.', icon: Scissors, href: '/tools/extract-pdf-pages', functionalCategory: 'PDF Tools', headerCategory: 'PDF',
  },
  {
    id: 'pdf-page-to-csv', name: 'PDF Page to CSV', description: 'Extract table from first PDF page to CSV.', icon: Sheet, href: '/tools/pdf-page-to-csv', functionalCategory: 'PDF Tools', headerCategory: 'PDF',
  },
  {
    id: 'pdf-to-word-text-extraction', name: 'PDF to Word (Text Extraction)', description: 'Extract text from PDF (first page) for Word.', icon: FileText, href: '/tools/pdf-to-word-converter', functionalCategory: 'PDF Tools', headerCategory: 'PDF',
    popularCardName: 'PDF to JPG', popularCardDescription: 'Convert PDF to JPG and download each page as an image.', popularDisplayCategory: 'Pdf Tools', isPopular: true, 
  },
  {
    id: 'pdf-to-presentation-content-extractor', name: 'PDF to Presentation Content', description: 'Extract text from PDF for presentation slides.', icon: Presentation, href: '/tools/pdf-to-presentation-content-extractor', functionalCategory: 'PDF Tools', headerCategory: 'PDF',
  },

  // Image Tools
  {
    id: 'image-resizer', name: 'Image Resizer', description: 'Adjust dimensions of your images.', icon: Scaling, href: '/tools/image-resizer', functionalCategory: 'Image Tools', headerCategory: 'Image',
  },
  {
    id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG images to JPG format.', icon: Replace, href: '/tools/png-to-jpg', functionalCategory: 'Image Tools', headerCategory: 'Image',
  },
  {
    id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG images to PNG format.', icon: Replace, href: '/tools/jpg-to-png', functionalCategory: 'Image Tools', headerCategory: 'Image',
  },
  {
    id: 'webp-to-jpg', name: 'WEBP to JPG', description: 'Convert WEBP images to JPG format.', icon: Replace, href: '/tools/webp-to-jpg', functionalCategory: 'Image Tools', headerCategory: 'Image',
  },
  {
    id: 'webp-to-png', name: 'WEBP to PNG', description: 'Convert WEBP images to PNG format.', icon: Replace, href: '/tools/webp-to-png', functionalCategory: 'Image Tools', headerCategory: 'Image',
  },
  {
    id: 'ai-image-generator', name: 'AI Image Generator', description: 'Create unique images from text prompts.', icon: ImageIconLucide, href: '/tools/ai-image-generator', functionalCategory: 'Image Tools', headerCategory: 'Image',
    popularCardName: 'AI Image Generator', popularCardDescription: 'AI Image Generator.', popularDisplayCategory: 'Image Tools', isPopular: true,
  },
  {
    id: 'image-background-remover', name: 'AI Background Remover', description: 'Remove background from images using AI.', icon: Eraser, href: '/tools/image-background-remover', functionalCategory: 'Image Tools', headerCategory: 'Image',
    popularCardName: 'Remove Background...', popularCardDescription: 'Easily Remove the Background from an image.', popularDisplayCategory: 'Image Tools', isPopular: true,
  },
  {
    id: 'ai-image-upscaler', name: 'AI Image Upscaler', description: 'Increase image resolution with AI (Experimental).', icon: ZoomIn, href: '/tools/ai-image-upscaler', functionalCategory: 'Image Tools', headerCategory: 'Image',
  },

  // Text & AI Tools (Write)
  {
    id: 'image-to-text-converter', name: 'Image to Text (OCR)', description: 'Extract text from images.', icon: ScanText, href: '/tools/image-to-text-converter', functionalCategory: 'Text & AI Tools', headerCategory: 'Write',
  },
  {
    id: 'ai-detector', name: 'AI Text Detector', description: 'Estimate if text is AI-generated.', icon: ScanSearch, href: '/tools/ai-detector', functionalCategory: 'Text & AI Tools', headerCategory: 'Write',
    popularCardName: 'Content Improver', popularCardDescription: 'Improve your content.', popularDisplayCategory: 'AI Write', isPopular: true, 
  },
  {
    id: 'voice-to-text', name: 'Voice to Text', description: 'Convert speech to text via AI.', icon: Volume2, href: '/tools/voice-to-text', functionalCategory: 'Text & AI Tools', headerCategory: 'Write',
  },
  {
    id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, etc.', icon: Baseline, href: '/tools/word-counter', functionalCategory: 'Text & AI Tools', headerCategory: 'Write',
  },
  {
    id: 'text-case-converter', name: 'Text Case Converter', description: 'Convert text to different cases.', icon: CaseSensitive, href: '/tools/text-case-converter', functionalCategory: 'Text & AI Tools', headerCategory: 'Write',
  },
  {
    id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text.', icon: ClipboardList, href: '/tools/lorem-ipsum-generator', functionalCategory: 'Text & AI Tools', headerCategory: 'Write',
    popularCardName: 'Essay Writer', popularCardDescription: 'Easily create an essay with AI.', popularDisplayCategory: 'AI Write', isPopular: true, 
  },
  {
    id: 'html-formatter', name: 'HTML Formatter', description: 'Format and beautify HTML code.', icon: CodeXml, href: '/tools/html-formatter', functionalCategory: 'Text & AI Tools', headerCategory: 'Write',
    popularCardName: 'Paragraph Writer', popularCardDescription: 'Paragraph Writer.', popularDisplayCategory: 'AI Write', isPopular: true, 
  },
  
  // Data Converters
  {
    id: 'base64-encoder-decoder', name: 'Base64 Encoder/Decoder', description: 'Encode/Decode Base64 strings.', icon: Binary, href: '/tools/base64-encoder-decoder', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'url-encoder-decoder', name: 'URL Encoder/Decoder', description: 'Encode/Decode URL strings.', icon: LinkIcon, href: '/tools/url-encoder-decoder', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'number-system-converter', name: 'Number System Converter', description: 'Convert between number systems.', icon: Calculator, href: '/tools/number-system-converter', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'csv-to-json-converter', name: 'CSV to JSON', description: 'Convert CSV data to JSON.', icon: FileCode2, href: '/tools/csv-to-json', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'json-to-xml-converter', name: 'JSON to XML (AI)', description: 'Convert JSON to XML using AI.', icon: FileCode2, href: '/tools/json-to-xml', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'xml-to-json-converter', name: 'XML to JSON (AI)', description: 'Convert XML to JSON using AI.', icon: FileCode2, href: '/tools/xml-to-json', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'csv-to-xml-converter', name: 'CSV to XML (AI)', description: 'Convert CSV to XML using AI.', icon: FileCode2, href: '/tools/csv-to-xml', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'csv-to-excel-converter', name: 'CSV to Excel', description: 'Convert CSV to Excel (.xlsx).', icon: FileSpreadsheet, href: '/tools/csv-to-excel', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'excel-to-csv-converter', name: 'Excel to CSV', description: 'Convert Excel sheets to CSV.', icon: FileSpreadsheet, href: '/tools/excel-to-csv', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'xml-to-excel-converter', name: 'XML to Excel (AI)', description: 'Convert XML to Excel via AI.', icon: DatabaseZap, href: '/tools/xml-to-excel', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'excel-to-xml-converter', name: 'Excel to XML (AI)', description: 'Convert Excel to XML via AI.', icon: DatabaseZap, href: '/tools/excel-to-xml', functionalCategory: 'Data Converters', headerCategory: 'File',
  },
  {
    id: 'json-formatter-validator', name: 'JSON Formatter', description: 'Format & Validate JSON strings.', icon: Braces, href: '/tools/json-formatter-validator', functionalCategory: 'Data Converters', headerCategory: 'File',
  },

  // File Management
  {
    id: 'split-excel-file', name: 'Split Excel File by Sheet', description: 'Split Excel into separate files per sheet.', icon: Scissors, href: '/tools/split-excel-file', functionalCategory: 'File Management', headerCategory: 'File',
  },
  {
    id: 'split-csv', name: 'Split CSV File', description: 'Split large CSV into smaller files.', icon: SplitSquareHorizontal, href: '/tools/split-csv', functionalCategory: 'File Management', headerCategory: 'File',
  },

  // Web Utilities
  {
    id: 'qr-code-scanner', name: 'QR Code Scanner', description: 'Scan QR codes with your camera.', icon: QrCode, href: '/tools/qr-code-scanner', functionalCategory: 'Web Utilities', headerCategory: 'Other',
  },
  {
    id: 'password-generator', name: 'Password Generator', description: 'Create strong, random passwords.', icon: KeyRound, href: '/tools/password-generator', functionalCategory: 'Web Utilities', headerCategory: 'Other',
  },
  {
    id: 'ip-address-info', name: 'IP Address Information', description: 'Get info about an IP address.', icon: Network, href: '/tools/ip-address-info', functionalCategory: 'Web Utilities', headerCategory: 'Other',
  },
  {
    id: 'internet-speed-tester', name: 'Internet Speed Test', description: 'Estimate your internet speed.', icon: Gauge, href: '/tools/internet-speed-tester', functionalCategory: 'Web Utilities', headerCategory: 'Other',
  },
  {
    id: 'color-converter', name: 'Color Converter', description: 'Convert HEX, RGB, HSL colors.', icon: Palette, href: '/tools/color-converter', functionalCategory: 'Web Utilities', headerCategory: 'Other',
  },

  // Calculators
  {
    id: 'file-size-calculator', name: 'File Size Calculator', description: 'Convert B, KB, MB, GB, TB.', icon: HardDrive, href: '/tools/file-size-calculator', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'loan-calculator', name: 'Loan Calculator', description: 'Estimate loan payments.', icon: CircleDollarSign, href: '/tools/loan-calculator', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'age-calculator', name: 'Age Calculator', description: 'Calculate age from birth date.', icon: Cake, href: '/tools/age-calculator', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'investment-roi-calculator', name: 'Investment ROI Calculator', description: 'Calculate Return on Investment.', icon: TrendingUp, href: '/tools/investment-roi-calculator', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate Body Mass Index.', icon: HeartPulse, href: '/tools/bmi-calculator', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'salary-converter', name: 'Salary Converter', description: 'Convert hourly to annual salary.', icon: DollarSign, href: '/tools/salary-converter', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'compound-interest-calculator', name: 'Compound Interest Calculator', description: 'Calculate compound interest.', icon: Landmark, href: '/tools/compound-interest-calculator', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'percentage-calculator', name: 'Percentage Calculator', description: 'Calculate various percentages.', icon: Percent, href: '/tools/percentage-calculator', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'sales-tax-calculator', name: 'Sales Tax Calculator', description: 'Calculate sales tax and total.', icon: Receipt, href: '/tools/sales-tax-calculator', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'income-tax-calculator', name: 'Income Tax Calculator', description: 'Estimate income tax (simplified).', icon: FileTextIconLucide, href: '/tools/income-tax-calculator', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'simple-interest-calculator', name: 'Simple Interest Calculator', description: 'Calculate simple interest.', icon: LineChart, href: '/tools/simple-interest-calculator', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
  {
    id: 'unit-converter', name: 'Unit Converter', description: 'Convert length, weight, temp.', icon: ArrowLeftRight, href: '/tools/unit-converter', functionalCategory: 'Calculators', headerCategory: 'Other',
  },
];


// For TinyWow-style homepage category cards
export const TINY_WOW_CATEGORIES: TinyWowCategoryCardData[] = [
  {
    id: 'pdf', title: 'PDF Tools', subtitle: 'Solve Your PDF Problems', icon: FileText, label: `${TOOLS_DATA.filter(t => t.functionalCategory === 'PDF Tools').length}+ tools`, featuredToolName: 'PDF Creator', href: '/#popular-tools-section?filter=PDF Tools', bgColorClass: 'bg-[hsl(var(--category-pdf-main-hsl))]', textColorClass: 'text-white' // Using main purple
  },
  {
    id: 'image', title: 'Image Tools', subtitle: 'Solve Your Image Problems', icon: ImageIconLucide, label: `${TOOLS_DATA.filter(t => t.functionalCategory === 'Image Tools').length}+ tools`, featuredToolName: 'Remove Background', href: '/#popular-tools-section?filter=Image Tools', bgColorClass: 'bg-[hsl(var(--category-image-main-hsl))]', textColorClass: 'text-white' // Using main orange-red
  },
  {
    id: 'video', title: 'Video Tools', subtitle: 'Solve Your Video Problems', icon: VideoIconLucide, label: `${TOOLS_DATA.filter(t => t.functionalCategory === 'Video Tools').length}+ tools`, featuredToolName: 'Mute Video', href: '/#popular-tools-section?filter=Video Tools', bgColorClass: 'bg-[hsl(var(--category-video-main-hsl))]', textColorClass: 'text-white' // Using main pink-red
  },
  {
    id: 'ai-write', title: 'AI Write Tools', subtitle: 'Solve Your Text Problems', icon: TypeIcon, label: `${TOOLS_DATA.filter(t => t.functionalCategory === 'Text & AI Tools').length}+ tools`, featuredToolName: 'Essay Writer', href: '/#popular-tools-section?filter=AI Write', bgColorClass: 'bg-[hsl(var(--category-ai-write-main-hsl))]', textColorClass: 'text-white' // Using main blue-violet
  },
  {
    id: 'file', title: 'File Tools', subtitle: 'Solve Your File Problems', icon: Folder, label: `${TOOLS_DATA.filter(t => t.functionalCategory === 'File Management' || t.functionalCategory === 'Data Converters').length}+ tools`, featuredToolName: 'Split Excel', href: '/#popular-tools-section?filter=Converter Tools', bgColorClass: 'bg-[hsl(var(--category-other-main-hsl))]', textColorClass: 'text-white' // Using main teal
  },
];

// For Header Navigation Dropdowns
export const HEADER_DROPDOWN_CATEGORIES: Array<{ name: Tool['headerCategory'], tools: AppTool[] }> = [
  { name: 'PDF', tools: TOOLS_DATA.filter(tool => tool.headerCategory === 'PDF') },
  { name: 'Image', tools: TOOLS_DATA.filter(tool => tool.headerCategory === 'Image') },
  { name: 'Write', tools: TOOLS_DATA.filter(tool => tool.headerCategory === 'Write') },
  { name: 'Video', tools: TOOLS_DATA.filter(tool => tool.headerCategory === 'Video') },
  { name: 'File', tools: TOOLS_DATA.filter(tool => tool.headerCategory === 'File') },
];

// For "Popular Tools" section filter pills
export const POPULAR_TOOLS_FILTER_CATEGORIES = [
  { name: 'All Tools', filterKey: 'all', icon: LayoutGrid, mappedCategories: [] as FunctionalToolCategory[] },
  { name: 'PDF Tools', filterKey: 'PDF Tools', icon: FileText, mappedCategories: ['PDF Tools'] as FunctionalToolCategory[] },
  { name: 'Video Tools', filterKey: 'Video Tools', icon: VideoIconLucide, mappedCategories: ['Video Tools'] as FunctionalToolCategory[] },
  { name: 'Image Tools', filterKey: 'Image Tools', icon: ImageIconLucide, mappedCategories: ['Image Tools'] as FunctionalToolCategory[] },
  { name: 'Converter Tools', filterKey: 'Converter Tools', icon: Shuffle, mappedCategories: ['Data Converters'] as FunctionalToolCategory[] },
  { name: 'Other Tools', filterKey: 'Other Tools', icon: Settings2, mappedCategories: ['Calculators', 'Web Utilities', 'File Management', 'Other Tools'] as FunctionalToolCategory[] }, // Added 'Other Tools'
  { name: 'AI Write', filterKey: 'AI Write', icon: PenTool, mappedCategories: ['Text & AI Tools'] as FunctionalToolCategory[] },
];

// Data for the new "Featured Tools Strip"
export const FEATURED_TOOLS_STRIP_DATA: FeaturedStripTool[] = [
  {
    id: 'image-background-remover', 
    name: 'Photo Cleanup AI',
    description: 'Use AI to remove unwanted objects or enhance details.',
    href: '/tools/image-background-remover',
    imageSrc: 'https://placehold.co/300x200.png',
    imageAlt: 'Photo Cleanup AI preview',
    functionalCategory: 'Image Tools',
    dataAiHint: 'photo edit cleanup',
  },
  {
    id: 'delete-pdf-pages', 
    name: 'Advanced PDF Editor',
    description: 'Easily modify, delete pages, and manage your PDF files.',
    href: '/tools/pdf-page-deleter',
    imageSrc: 'https://placehold.co/300x200.png',
    imageAlt: 'Advanced PDF Editor preview',
    functionalCategory: 'PDF Tools',
    dataAiHint: 'pdf document editor',
  },
  {
    id: 'lorem-ipsum-generator', 
    name: 'Instant AI Writer',
    description: 'Generate creative text, essays, and articles in seconds.',
    href: '/tools/lorem-ipsum-generator',
    imageSrc: 'https://placehold.co/300x200.png',
    imageAlt: 'Instant AI Writer preview',
    functionalCategory: 'Text & AI Tools',
    dataAiHint: 'ai writing assistant',
  },
  {
    id: 'video-converter-placeholder', 
    name: 'Ultimate Video Converter',
    description: 'Convert video files between various formats quickly.',
    href: '#', 
    imageSrc: 'https://placehold.co/300x200.png',
    imageAlt: 'Video Converter preview',
    functionalCategory: 'Video Tools', // Assigning a category
    dataAiHint: 'video format conversion',
  },
  {
    id: 'ai-image-generator', 
    name: 'Creative Image Studio',
    description: 'Generate stunning visuals and artwork from text prompts.',
    href: '/tools/ai-image-generator',
    imageSrc: 'https://placehold.co/300x200.png',
    imageAlt: 'AI Image Studio preview',
    functionalCategory: 'Image Tools',
    dataAiHint: 'ai image art',
  },
];
