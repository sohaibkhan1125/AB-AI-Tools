
import type { LucideIcon } from 'lucide-react';

// Categories for Header Dropdowns & internal functional grouping
export type ToolCategory =
  | 'PDF'
  | 'Image'
  | 'Write' // Corresponds to "AI Write Tools" or "Text & AI Tools" functionally
  | 'Video'
  | 'File'  // Corresponds to "File Management" or some "Data Converters"
  | 'Converter' // New for "Converter Tools" filter
  | 'Other'     // New for "Other Tools" filter

  // Functional categories used in TOOLS_DATA for more precise grouping
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools' // Maps to "Write" or "AI Write"
  | 'Data Converters' // Maps to "Converter"
  | 'Calculators'     // Maps to "Other"
  | 'Web Utilities'   // Maps to "Other"
  | 'File Management' // Maps to "File" or "Other"
  | 'Video Tools';    // Maps to "Video"

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  keywords?: string[];
  category: ToolCategory; // This should be the more granular functional category
  headerCategory?: 'PDF' | 'Image' | 'Write' | 'Video' | 'File'; // For top nav dropdowns
  
  // For Popular Tool Card display
  isPopular?: boolean; // Flag if it's a candidate for "popular" section
  popularCardName?: string; // Custom name for the popular card
  popularCardDescription?: string; // Custom description for the popular card
  popularDisplayCategory?: string; // Text to show on card, e.g., "AI Write", "Pdf Tools"
  categoryLabelColorClass?: string; // Tailwind class for category label on popular card e.g. text-[hsl(var(--category-label-pdf))]
  iconBgClass?: string; // Tailwind class for icon background on popular card e.g. bg-purple-100/50
}

// Specific type for the 5 homepage category cards (TinyWow style)
export interface TinyWowCategoryCardData {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  label: string; // e.g., "45+ tools"
  featuredToolName: string;
  href: string; 
  bgColorClass: string; 
  textColorClass: string; 
}
