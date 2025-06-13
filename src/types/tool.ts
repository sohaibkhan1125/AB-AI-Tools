
import type { LucideIcon } from 'lucide-react';

export type ToolCategory =
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools' // Functional category, maps to "AI Write Tools" display
  | 'Data Converters' 
  | 'Calculators' 
  | 'Web Utilities' 
  | 'File Management' 
  | 'Video Tools'; // New category as per mockup

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  keywords?: string[];
  category: ToolCategory; // Functional category
}
