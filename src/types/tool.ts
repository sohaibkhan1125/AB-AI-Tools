
import type { LucideIcon } from 'lucide-react';

// Categories for Header Dropdowns & internal functional grouping
export type ToolCategory =
  | 'PDF'
  | 'Image'
  | 'Write' // Corresponds to "AI Write Tools" or "Text & AI Tools" functionally
  | 'Video'
  | 'File'  // Corresponds to "File Management" or some "Data Converters"
  | 'Converter' 
  | 'Other'     

  // Functional categories used in TOOLS_DATA for more precise grouping
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools' 
  | 'Data Converters' 
  | 'Calculators'     
  | 'Web Utilities'   
  | 'File Management' 
  | 'Video Tools';    

export type FunctionalToolCategory =
  | 'PDF Tools'
  | 'Image Tools'
  | 'Text & AI Tools'
  | 'Data Converters'
  | 'Calculators'
  | 'Web Utilities'
  | 'File Management'
  | 'Video Tools';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  keywords?: string[];
  category: FunctionalToolCategory; 
  headerCategory?: 'PDF' | 'Image' | 'Write' | 'Video' | 'File' | 'Other';
  
  // For Popular Tool Card display (TinyWow style grid)
  isPopular?: boolean; 
  popularCardName?: string; 
  popularCardDescription?: string; 
  popularDisplayCategory?: string; 
  categoryLabelColorClass?: string; 
  iconBgClass?: string; 
}

// Specific type for the 5 homepage category cards (TinyWow style)
export interface TinyWowCategoryCardData {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  label: string; 
  featuredToolName: string;
  href: string; 
  bgColorClass: string; 
  textColorClass: string; 
}

// Specific type for the "Featured Tools Strip"
export interface FeaturedStripTool {
  id: string;
  name: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  imageBgClass: string; // e.g., 'bg-purple-100/80 dark:bg-purple-500/20'
  dataAiHint: string;
}
