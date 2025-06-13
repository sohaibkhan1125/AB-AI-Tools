
'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PopularToolCard from '@/components/popular-tool-card';
import { TOOLS_DATA, POPULAR_TOOLS_CONFIG, FILTER_CATEGORIES_CONFIG } from '@/lib/tools-data';
import type { Tool, ToolCategory } from '@/types/tool';
import { LayoutGrid } from 'lucide-react'; // Default icon for "All Tools"

type ActiveFilterValue = 'all' | ToolCategory | 'AI Write Filter' | 'Converter Tools Filter' | 'Other Tools Filter';


export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<ActiveFilterValue>('all');
  const allToolsSectionRef = useRef<HTMLDivElement>(null);

  const displayedTools = useMemo(() => {
    if (activeFilter === 'all') {
      // Show popular tools first, then the rest, avoiding duplicates
      const popularIds = new Set(POPULAR_TOOLS_CONFIG.map(pt => pt.id));
      const otherTools = TOOLS_DATA.filter(t => !popularIds.has(t.id));
      return [...POPULAR_TOOLS_CONFIG, ...otherTools];
    }

    const currentFilterConfig = FILTER_CATEGORIES_CONFIG.find(f => f.filterValue === activeFilter);
    if (currentFilterConfig && currentFilterConfig.mappedCategories) {
      return TOOLS_DATA.filter(tool => 
        currentFilterConfig.mappedCategories?.includes(tool.category as ToolCategory)
      );
    }
    // Fallback for direct functional category match if no mapping (e.g. PDF Tools, Image Tools)
    return TOOLS_DATA.filter(tool => tool.category === activeFilter);
  }, [activeFilter]);

  const handleFilterClick = (filterValue: ActiveFilterValue) => {
    setActiveFilter(filterValue);
  };
  
  const handleExploreAllClick = () => {
    setActiveFilter('all');
    // Scroll to the main tools list if needed, though with filters it might not be necessary
    // allToolsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      {/* Filter Bar */}
      <section className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {FILTER_CATEGORIES_CONFIG.map((filter) => (
            <Button
              key={filter.label}
              variant={activeFilter === filter.filterValue ? 'default' : 'outline'}
              onClick={() => handleFilterClick(filter.filterValue as ActiveFilterValue)}
              className="text-xs sm:text-sm px-3 py-1.5 h-auto sm:px-4 sm:py-2"
            >
              <filter.icon className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {filter.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Tools Grid - uses PopularToolCard for all */}
      <section id="tools-grid" className="container mx-auto px-4">
        {displayedTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayedTools.map((tool: Tool) => ( // Cast to Tool if POPULAR_TOOLS_CONFIG items don't perfectly match Tool
              <PopularToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10 text-lg">
            No tools found for "{activeFilter}". Try a different filter.
          </p>
        )}
      </section>
      
      {/* "Add more tools" button / Explore All Button */}
      <section className="text-center mt-10 mb-8">
         <Button
            variant="default"
            size="lg"
            onClick={handleExploreAllClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
          >
            Explore All {TOOLS_DATA.length}+ Tools
        </Button>
      </section>

      {/* This ref is for potential scrolling, can be removed if not used by ExploreAll */}
      <div ref={allToolsSectionRef}></div>

    </div>
  );
}
