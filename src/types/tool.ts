
import type { LucideIcon } from 'lucide-react';

export type ToolCategory =
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools'
  | 'Data Converters' // Main category for filter
  | 'Converter Tools'   // Display category for card
  | 'Calculators'
  | 'Web Utilities'
  | 'File Management'
  | 'Video Tools'
  | 'Other Tools'       // Display category for card & filter for grouped tools
  | 'AI Write';         // Display category for card

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  keywords?: string[];
  category: ToolCategory; // Primary functional category
  displayCategory?: ToolCategory; // For display on cards, matching prompt
  isFeaturedCategory?: boolean;
}
