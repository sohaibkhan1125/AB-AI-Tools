
'use client';

import { useState, useMemo } from 'react';
import ToolSearch from '@/components/tool-search';
import ToolCard from '@/components/tool-card';
import { TOOLS_DATA } from '@/lib/tools-data';
import type { Tool } from '@/types/tool';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  FileText, Image as ImageIconLucide, Video as VideoIcon, Sparkles as SparklesIcon, 
  Folder as FolderIcon, Users, FileUp, CheckCircle, ArrowRight, LayoutGrid, 
  Replace as ConverterIcon, Box as OtherIcon, PenTool as AIWriteIcon, 
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Hero Section (remains similar)
const HomepageHeroSection = () => (
  <section className="py-12 sm:py-16 text-center bg-gradient-to-b from-background to-primary/5 rounded-lg mb-8">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-primary mb-3">
        AI Tools Hub
      </h1>
      <p className="text-md sm:text-lg text-foreground/80 max-w-2xl mx-auto">
        Free Tools to Make Everything Simple. We offer PDF, video, image and other online tools to make your life easier.
      </p>
    </div>
  </section>
);

// Tool Categories Section (as per previous update, will be removed/replaced by filter bar)
// Stats Section (as per previous update, will be removed)
// Featured Tools Section (as per previous update, will be removed)

// New Filter Categories for the top bar
const filterCategories = [
  { name: 'All Tools', icon: LayoutGrid, internalCategory: 'All Tools' },
  { name: 'Pdf Tools', icon: FileText, internalCategory: 'PDF Tools' },
  { name: 'Video Tools', icon: VideoIcon, internalCategory: 'Video Tools' },
  { name: 'Image Tools', icon: ImageIconLucide, internalCategory: 'Image Tools' },
  { name: 'Converter Tools', icon: ConverterIcon, internalCategory: 'Data Converters' }, // Maps to Data Converters
  { name: 'Other Tools', icon: OtherIcon, internalCategory: 'Other Tools' },       // Groups Calculators, Web Utilities, File Management
  { name: 'AI Write', icon: AIWriteIcon, internalCategory: 'Text & AI Tools' },   // Maps to Text & AI Tools
];


// Main Page Component
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Tools'); // Internal category name or "All Tools"

  const filteredTools = useMemo(() => {
    let toolsToDisplay = TOOLS_DATA;

    // 1. Filter by category
    if (activeFilter !== 'All Tools') {
      if (activeFilter === 'Other Tools') {
        toolsToDisplay = toolsToDisplay.filter(tool => 
          ['Calculators', 'Web Utilities', 'File Management'].includes(tool.category)
        );
      } else {
        // For direct category matches like "PDF Tools", "Image Tools", "Video Tools"
        // For "Converter Tools" (maps to 'Data Converters')
        // For "AI Write" (maps to 'Text & AI Tools')
        toolsToDisplay = toolsToDisplay.filter(tool => tool.category === activeFilter);
      }
    }

    // 2. Filter by search query (on name, description, keywords, and now also internal category for broader match)
    if (searchQuery) {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const searchTerms = lowerSearchQuery.split(/\s+/).filter(term => term.length > 0);

      toolsToDisplay = toolsToDisplay.filter((tool) => {
        return searchTerms.some(term =>
          tool.name.toLowerCase().includes(term) ||
          tool.description.toLowerCase().includes(term) ||
          tool.category.toLowerCase().includes(term) || // search on internal category
          (tool.displayCategory && tool.displayCategory.toLowerCase().includes(term)) || // search on displayCategory
          (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(term)))
        );
      });
    }
    return toolsToDisplay;
  }, [searchQuery, activeFilter]);

  const handleFilterClick = (internalCategoryName: string) => {
    setActiveFilter(internalCategoryName);
    setSearchQuery(''); // Reset search when changing filter
    // Scroll to tools section if needed
    const toolsSection = document.getElementById('tools-grid-section');
    if (toolsSection) {
      // toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Function to handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="space-y-0">
      <HomepageHeroSection />
      
      {/* New Category Filter Bar */}
      <section id="category-filters" className="mb-8 sticky top-[calc(var(--header-height,64px)+1px)] bg-background/95 backdrop-blur-sm z-40 py-3 border-b">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-3">
            {filterCategories.map((cat) => {
              const isActive = activeFilter === cat.internalCategory;
              return (
                <Button
                  key={cat.name}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleFilterClick(cat.internalCategory)}
                  className={cn(
                    "flex-shrink-0 h-9 px-3 py-1.5 rounded-full text-xs sm:text-sm",
                    isActive ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <cat.icon className={cn("h-4 w-4 mr-1.5", isActive ? "text-primary-foreground/90" : "text-primary/70")} />
                  {cat.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="tools-grid-section" className="py-8">
        <div className="container mx-auto px-4">
          {/* Search bar can be added here if needed, but the prompt image doesn't show one directly above the grid */}
          {/* <ToolSearch onSearchChange={setSearchQuery} placeholder="Search tools..." /> */}

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredTools.map((tool: Tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10 text-lg">
              No tools found matching "{activeFilter === 'All Tools' ? searchQuery : `${activeFilter} ${searchQuery ? `and "${searchQuery}"` : ''}`}".
            </p>
          )}

          {/* "All Tools" button at the bottom, shown only if a filter is active */}
          {activeFilter !== 'All Tools' && (
            <div className="mt-12 text-center">
              <Button 
                variant="default" 
                size="lg" 
                onClick={() => handleFilterClick('All Tools')}
                className="rounded-full shadow-lg px-6 py-3"
              >
                <LayoutGrid className="mr-2 h-5 w-5" /> View All Tools
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Floating Scroll to Top Button */}
      <Button 
        onClick={scrollToTop} 
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full p-0 shadow-xl"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-6 w-6"/>
      </Button>

    </div>
  );
}
