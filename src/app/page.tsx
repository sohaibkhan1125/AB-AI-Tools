
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import TinyWowCategoryCard from '@/components/tiny-wow-category-card';
import PopularToolCardV2 from '@/components/popular-tool-card-v2'; 
import FeaturedToolStripCard from '@/components/featured-tool-strip-card';
import { TOOLS_DATA, TINY_WOW_CATEGORIES, POPULAR_TOOLS_FILTER_CATEGORIES, FEATURED_TOOLS_STRIP_DATA } from '@/lib/tools-data';
import type { Tool, FunctionalToolCategory } from '@/types/tool';
import { Users, FileCog, Wrench, Search as SearchIconLucide, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const TopBanner = () => (
  <div className="bg-primary text-primary-foreground py-2.5 text-center text-sm font-medium">
    Free. No Sign-Up Required. No Limits. {' '}
    <Link href="/about" className="underline hover:opacity-80">Read More</Link>
  </div>
);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all'); 
  const featuredStripRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const filterFromUrl = params.get('filter');
      const queryFromUrl = params.get('q');

      if (filterFromUrl && POPULAR_TOOLS_FILTER_CATEGORIES.find(f => f.filterKey === filterFromUrl)) {
        setActiveFilter(filterFromUrl);
      }
      if (queryFromUrl) {
        setSearchQuery(queryFromUrl);
      }
      
      if (filterFromUrl || queryFromUrl) {
        const toolsSection = document.getElementById('popular-tools-section');
        if (toolsSection) {
          requestAnimationFrame(() => {
            toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      }
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toolsSection = document.getElementById('popular-tools-section');
    if (toolsSection && searchQuery.trim()) {
        requestAnimationFrame(() => {
            toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
  };

  const filteredPopularTools = useMemo(() => {
    let toolsToFilter = TOOLS_DATA;

    if (activeFilter !== 'all') {
      const currentFilterConfig = POPULAR_TOOLS_FILTER_CATEGORIES.find(f => f.filterKey === activeFilter);
      if (currentFilterConfig && currentFilterConfig.mappedCategories.length > 0) {
        toolsToFilter = TOOLS_DATA.filter(tool => 
          currentFilterConfig.mappedCategories.includes(tool.functionalCategory as FunctionalToolCategory)
        );
      } else if (currentFilterConfig) { 
        toolsToFilter = TOOLS_DATA.filter(tool => tool.functionalCategory === activeFilter);
      }
    }
    
    if (!searchQuery.trim()) {
      return toolsToFilter;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return toolsToFilter.filter(tool =>
      (tool.popularCardName || tool.name).toLowerCase().includes(lowerCaseQuery) ||
      (tool.popularCardDescription || tool.description).toLowerCase().includes(lowerCaseQuery) ||
      (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerCaseQuery))) ||
      (tool.popularDisplayCategory || tool.functionalCategory).toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, activeFilter]);
  
  const stats = [
    { id: 'users', label: 'Active Users', value: '1.2M+', icon: Users },
    { id: 'conversions', label: 'Files Processed', value: '10M+', icon: FileCog },
    { id: 'tools', label: 'Online Tools', value: `${TOOLS_DATA.length}+`, icon: Wrench },
  ];

  const scrollFeaturedStrip = (direction: 'left' | 'right') => {
    if (featuredStripRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      featuredStripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isMounted) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-background">
      <TopBanner />

      {/* Hero Section */}
      <section className="bg-card py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Free Tools to Make <span className="bg-[hsl(var(--hero-highlight-bg-hsl))] text-[hsl(var(--hero-highlight-fg-hsl))] px-2 py-1 rounded-md">Everything</span> Simple
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            We provide a suite of free online tools including PDF tools, image editing, video utilities, AI writing aids, and file converters. All accessible without sign-up.
          </p>
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative">
            <SearchIconLucide className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              type="search"
              placeholder="Search for a tool (e.g., PDF to Word, Remove Background...)"
              className="w-full pl-14 pr-32 sm:pr-36 py-3 text-base rounded-full shadow-md h-16 focus:ring-2 focus:ring-primary border-border/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tools"
            />
            <Button 
              type="submit" 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-11 rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Tool Category Cards Section (TinyWow Style) */}
      <section className="py-12 md:py-16 bg-background" id="tool-categories">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6">
            {TINY_WOW_CATEGORIES.map((category) => (
              <TinyWowCategoryCard key={category.id} card={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Row */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-card p-6 rounded-lg shadow-sm">
                <stat.icon className="h-10 w-10 text-primary mb-3 mx-auto" />
                <p className="text-2xl md:text-3xl font-semibold text-primary">{stat.value}</p>
                <p className="text-sm text-foreground/90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-16 md:py-20 bg-background" id="popular-tools-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Our Most Popular Tools
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            We present the best of the best. All free, no catch.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {POPULAR_TOOLS_FILTER_CATEGORIES.map((category) => (
              <Button
                key={category.filterKey}
                variant={activeFilter === category.filterKey ? 'default' : 'outline'}
                onClick={() => setActiveFilter(category.filterKey)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm transition-all duration-150 ease-in-out",
                  activeFilter === category.filterKey ? "shadow-md" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <category.icon className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>

          {filteredPopularTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {filteredPopularTools.map((tool: Tool) => (
                <PopularToolCardV2 key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-lg">
              No tools found matching "{searchQuery || activeFilter}". Try a different search or filter.
            </p>
          )}
        </div>
      </section>

      {/* Featured Tools Strip Section */}
      <section className="py-16 md:py-20 bg-secondary/20 dark:bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            Free Tools You’d Usually Pay For
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            No Limits, No Sign-Up – Here’s our featured tools
          </p>
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card hover:bg-card/90 shadow-md hidden md:flex"
              onClick={() => scrollFeaturedStrip('left')}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div 
              ref={featuredStripRef} 
              className="flex overflow-x-auto space-x-6 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent"
            >
              {FEATURED_TOOLS_STRIP_DATA.map((tool) => (
                <div key={tool.id} className="snap-center shrink-0 first:pl-2 last:pr-2 md:first:pl-0 md:last:pr-0">
                  <FeaturedToolStripCard tool={tool} />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card hover:bg-card/90 shadow-md hidden md:flex"
              onClick={() => scrollFeaturedStrip('right')}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}


