import type { Tool } from '@/types/tool';
import { QrCode, FileImage, FileText } from 'lucide-react';

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
    icon: FileImage, // Using FileImage for simplicity, could be a custom combined icon
    href: '/tools/image-to-pdf',
    keywords: ['image', 'pdf', 'converter', 'jpg', 'png']
  },
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
