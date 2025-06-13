
import type { LucideIcon } from 'lucide-react';

export type ToolCategory =
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools'
  | 'Data Converters' // Will be displayed as "Converter Tools" in UI
  | 'Calculators'     // Will be grouped under "Other Tools" in UI
  | 'Web Utilities'   // Will be grouped under "Other Tools" in UI
  | 'File Management' // Will be grouped under "Other Tools" in UI
  | 'Video Tools'     // New category from image
  | 'Other Tools';    // New catch-all category for UI

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  keywords?: string[];
  category: ToolCategory; // Keep existing detailed categories for data
  displayCategory?: string; // For UI display, e.g. "AI Write"
  isFeaturedCategory?: boolean;
}

