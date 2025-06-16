
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

export type TinyWowCategoryKey = 'pdf' | 'image' | 'video' | 'ai-write' | 'file';


export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  keywords?: string[];
  functionalCategory: FunctionalToolCategory; 
  headerCategory?: 'PDF' | 'Image' | 'Write' | 'Video' | 'File' | 'Other';
  
  isPopular?: boolean; 
  popularCardName?: string; 
  popularCardDescription?: string; 
  popularDisplayCategory?: string; 
}

// Specific type for the 5 homepage category cards (TinyWow style)
export interface TinyWowCategoryCardData {
  id: string; // Corresponds to categoryKey for simplicity now
  title: string;
  subtitle: string;
  icon: LucideIcon;
  label: string; 
  featuredToolName: string;
  href: string; 
  categoryKey: TinyWowCategoryKey; // Used to derive pastel background and vibrant accents
}

// Specific type for the "Featured Tools Strip"
export interface FeaturedStripTool {
  id: string;
  name: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  functionalCategory: FunctionalToolCategory; 
  dataAiHint: string;
}
