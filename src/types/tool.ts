
import type { LucideIcon } from 'lucide-react';

export type ToolCategory =
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools' // Functional category for "AI Write" filter
  | 'Data Converters' // Functional category for "Converter Tools" filter
  | 'Calculators' // Part of "Other Tools" filter
  | 'Web Utilities' // Part of "Other Tools" filter
  | 'File Management' // Part of "Other Tools" or "Converter Tools" filter
  | 'Video Tools'
  | 'AI Write' // Display category from prompt
  | 'Converter Tools' // Display/Filter category from prompt
  | 'Other Tools'; // Display/Filter category from prompt


export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  keywords?: string[];
  category: ToolCategory; // Functional category
  isFeaturedCategory?: boolean; // For header checkmarks
  displayCategory?: string; // For card display, e.g., "AI Write"
  isPopular?: boolean; // To identify initially "popular" tools
  cardName?: string; // Override name for popular card
  cardDescription?: string; // Override description for popular card
}
