
import type { Tool } from '@/types/tool';
import { QrCode, FileImage, Scaling, Replace, KeyRound, Network } from 'lucide-react';

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

