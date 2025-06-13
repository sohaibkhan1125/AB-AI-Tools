
import type { LucideIcon } from 'lucide-react';

export type ToolCategory =
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools'
  | 'Data Converters'
  | 'Calculators'
  | 'Web Utilities'
  | 'File Management'
  | 'Video Tools'; // Kept from a previous state that this revert shouldn't affect negatively

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  keywords?: string[];
  category: ToolCategory;
  isFeaturedCategory?: boolean;
}
