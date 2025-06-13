
import type { LucideIcon } from 'lucide-react';

export type ToolCategory =
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools'
  | 'Data Converters'
  | 'Calculators'
  | 'Web Utilities'
  | 'File Management'
  | 'Video Tools'; // Added Video Tools

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  keywords?: string[];
  category: ToolCategory;
  isFeaturedCategory?: boolean; // To determine if the category itself is "featured" for the header checkmark
}
