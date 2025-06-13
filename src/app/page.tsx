
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ToolCard from '@/components/tool-card';
import { TOOLS_DATA, HEADER_CATEGORY_ORDER } from '@/lib/tools-data';
import type { Tool, ToolCategory } from '@/types/tool';
import { Users, FileCog, Wrench, Eye, TrendingUp, Download as DownloadIcon, Search } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import ToolSearch from '@/components/tool-search';


interface GroupedTools {
  [category: string]: Tool[];
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check for search query in URL on mount (e.g., from header search redirect)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryFromUrl = params.get('q');
      if (queryFromUrl) {
        setSearchQuery(queryFromUrl);
      }
    }
  }, []);


  const groupedTools = useMemo(() => {
    return TOOLS_DATA.reduce((acc, tool) => {
      const category = tool.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {} as GroupedTools);
  }, []);

  const getCategoryHeading = (category: ToolCategory): string => {
    if (category === 'Text & AI Tools') return 'AI Write Tools';
    // Add other mappings if needed
    return category;
  };

  // Stats data - placeholders
  const stats = [
    { id: 'users', label: 'Active Users', value: '1.2M+', icon: Users },
    { id: 'conversions', label: 'Files Converted', value: '10M+', icon: FileCog },
    { id: 'tools', label: 'Online Tools', value: `${TOOLS_DATA.length}+`, icon: Wrench },
  ];
  
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return TOOLS_DATA;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return TOOLS_DATA.filter(tool =>
      tool.name.toLowerCase().includes(lowerCaseQuery) ||
      tool.description.toLowerCase().includes(lowerCaseQuery) ||
      (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerCaseQuery))) ||
      tool.category.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);
  
  const filteredGroupedTools = useMemo(() => {
    return filteredTools.reduce((acc, tool) => {
      const category = tool.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {} as GroupedTools);
  }, [filteredTools]);


  if (!isMounted) {
    // You can render a loading state or a basic skeleton here
    return <div className="container mx-auto px-4 py-8 text-center">Loading tools...</div>;
  }

  return (
    <div className="space-y-12 md:space-y-20">
      {/* Hero Section */}
      <section className="bg-primary/10 py-16 md:py-24 rounded-lg shadow-sm text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4 font-headline">
            Free Online Tools to Simplify Your Tasks
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
            Access a suite of PDF, image, video, and AI tools instantly. No sign-up required, no limits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
              <Link href="#tools-section">
                <span>Explore All Tools</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-sm">
              <Link href="#popular-tools">
                <span>Most Popular</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-card p-6 rounded-lg shadow-sm border border-border/70 flex flex-col items-center">
              <stat.icon className="h-10 w-10 text-primary mb-3" />
              <p className="text-2xl md:text-3xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Search Bar for all tools */}
       <section className="container mx-auto px-4" id="tools-section">
        <ToolSearch 
          onSearchChange={setSearchQuery}
          placeholder="Search all tools (e.g., 'pdf merge', 'image resize', 'AI')..."
        />
      </section>


      {/* Tools Grid by Category */}
      <section className="container mx-auto px-4 space-y-10">
         {HEADER_CATEGORY_ORDER.map((categoryName) => {
          const toolsInCategory = filteredGroupedTools[categoryName] || [];
           // Only render category if it has tools after filtering, or if it's "Video Tools" (always show)
          if (toolsInCategory.length === 0 && categoryName !== "Video Tools" && searchQuery.trim()) {
            return null; // Don't show empty categories when searching
          }
          // If not searching, and category is empty (except Video Tools), maybe skip too
          if (toolsInCategory.length === 0 && categoryName !== "Video Tools" && !searchQuery.trim()) {
             // return null; // Or show a "coming soon" for non-video empty cats
          }

          return (
            <div key={categoryName} id={categoryName === "PDF Tools" ? "popular-tools" : undefined}>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 font-headline border-b pb-3">
                {getCategoryHeading(categoryName)}
              </h2>
              {toolsInCategory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {toolsInCategory.map((tool: Tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  {searchQuery.trim() 
                    ? `No tools found in ${getCategoryHeading(categoryName)} for "${searchQuery}".`
                    : (categoryName === "Video Tools" ? "Video tools coming soon!" : `No tools currently in this category.`)}
                </p>
              )}
            </div>
          );
        })}
         {filteredTools.length === 0 && searchQuery.trim() && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Tools Found</h3>
            <p className="text-muted-foreground">
              Your search for "{searchQuery}" did not match any tools. Try a different keyword.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
