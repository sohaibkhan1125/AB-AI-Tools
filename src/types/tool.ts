
import type { LucideIcon } from 'lucide-react';

// Categories for Header Dropdowns & Filtering
export type ToolCategory =
  | 'PDF'
  | 'Image'
  | 'Write'
  | 'Video'
  | 'File'
  // Broader functional categories used for grouping internal tools,
  // some tools might map to the above simpler categories for display in header.
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools'
  | 'Data Converters'
  | 'Calculators'
  | 'Web Utilities'
  | 'File Management'
  | 'Video Tools'; // Ensure this matches functional category names if used

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  keywords?: string[];
  category: ToolCategory; // This will be the more granular functional category
}

// Specific type for the 5 homepage category cards (TinyWow style)
export interface TinyWowCategoryCardData {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  label: string; // e.g., "45+ tools"
  featuredToolName: string;
  href: string; // Link for the "View All [Category] Tools" or similar
  bgColorClass: string; // Tailwind class for background color
  textColorClass: string; // Tailwind class for text color
}
