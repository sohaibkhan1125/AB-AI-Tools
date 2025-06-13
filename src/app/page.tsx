
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ToolSearch from '@/components/tool-search';
import ToolCard from '@/components/tool-card';
import PopularToolCard from '@/components/popular-tool-card'; // New component
import { TOOLS_DATA, POPULAR_TOOLS_CONFIG, FILTER_CATEGORIES } from '@/lib/tools-data';
import type { Tool, ToolCategory } from '@/types/tool';
import { ArrowDown, FileText as FileTextIcon, Image as ImageIconLucide, Video as VideoIcon, Replace, Settings2, Sparkles, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterCategory, setActiveFilterCategory] = useState<ToolCategory>('All Tools');

  const popularToolsToDisplay = useMemo(() => {
    return POPULAR_TOOLS_CONFIG.filter(pt => {
      const matchesSearch = !searchQuery || 
                            pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pt.displayCategory.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilterCategory === 'All Tools') return matchesSearch;
      
      const filterCategoryDetail = FILTER_CATEGORIES.find(fc => fc.name === activeFilterCategory);
      const matchesFilter = filterCategoryDetail?.mapping 
        ? pt.filterCategories.some(toolCat => filterCategoryDetail.mapping?.includes(toolCat))
        : pt.filterCategories.includes(activeFilterCategory);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilterCategory]);

  const allToolsFiltered = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return TOOLS_DATA.filter((tool) => {
      const matchesSearch = !searchQuery ||
        tool.name.toLowerCase().includes(lowerSearchQuery) ||
        tool.description.toLowerCase().includes(lowerSearchQuery) ||
        (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchQuery))) ||
        tool.category.toLowerCase().includes(lowerSearchQuery) ||
        (tool.displayCategory && tool.displayCategory.toLowerCase().includes(lowerSearchQuery));

      if (activeFilterCategory === 'All Tools') return matchesSearch;
      
      const filterCategoryDetail = FILTER_CATEGORIES.find(fc => fc.name === activeFilterCategory);
      const primaryCategoryMatches = filterCategoryDetail?.mapping 
        ? filterCategoryDetail.mapping.includes(tool.category)
        : tool.category === activeFilterCategory;

      return matchesSearch && primaryCategoryMatches;
    });
  }, [searchQuery, activeFilterCategory]);

  const scrollToAllTools = () => {
    document.getElementById('all-tools-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-10 md:space-y-16">
      <section className="text-center pt-8 md:pt-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-primary mb-3">
          Our Most Popular Tools
        </h1>
        <p className="text-md sm:text-lg text-foreground/80 max-w-2xl mx-auto">
          We present the best of the best. All free, no catch
        </p>
      </section>

      <section>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 md:mb-12">
            {FILTER_CATEGORIES.map((filter) => (
              <Button
                key={filter.name}
                variant={activeFilterCategory === filter.name ? 'default' : 'outline'}
                onClick={() => setActiveFilterCategory(filter.name)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
              >
                <filter.icon className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {filter.name}
              </Button>
            ))}
          </div>

           <ToolSearch onSearchChange={setSearchQuery} placeholder="Search popular or all tools..." />

          {popularToolsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {popularToolsToDisplay.map((toolConfig) => {
                 const toolData = TOOLS_DATA.find(td => td.id === toolConfig.id);
                 if (!toolData) return null; // Should not happen if config is correct
                 return (
                    <PopularToolCard
                        key={toolConfig.id + '-' + toolConfig.name} // Ensure unique key if same tool appears twice
                        name={toolConfig.name}
                        description={toolConfig.description}
                        href={toolConfig.href}
                        icon={toolConfig.icon}
                        displayCategory={toolConfig.displayCategory as ToolCategory} // Cast as per your type
                    />
                 );
              })}
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-10 text-lg">
              No popular tools found matching "{searchQuery}" {activeFilterCategory !== 'All Tools' ? `in category "${activeFilterCategory}"` : ''}.
            </p>
          )}

          <div className="text-center mt-8 md:mt-12">
            <Button
              size="lg"
              variant="default"
              onClick={scrollToAllTools}
              className="rounded-full px-8 py-3 text-base shadow-lg hover:shadow-xl transition-shadow"
            >
              <ArrowDown className="mr-2 h-5 w-5" />
              Explore All Tools
            </Button>
          </div>
        </div>
      </section>

      <section id="all-tools-section" className="py-12 bg-muted/20 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 font-headline text-primary">
            All Our Tools ({allToolsFiltered.length})
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
            Explore our comprehensive suite of tools. {activeFilterCategory !== 'All Tools' ? `Filtered by: ${activeFilterCategory}` : 'Use the search or filters above.'}
          </p>
          
          {allToolsFiltered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allToolsFiltered.map((tool: Tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10 text-lg">
              No tools found matching "{searchQuery}" {activeFilterCategory !== 'All Tools' ? `in category "${activeFilterCategory}"` : ''}.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
