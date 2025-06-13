
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import TinyWowCategoryCard from '@/components/tiny-wow-category-card';
import { TINY_WOW_CATEGORIES, TOOLS_DATA, HEADER_DROPDOWN_CATEGORIES } from '@/lib/tools-data';
import type { Tool, ToolCategory, TinyWowCategoryCardData } from '@/types/tool';
import { Users, FileCog, Wrench, Search, FileText, ImageIcon as ImageIconLucide, Video as VideoIconLucide, Type as TypeIcon, Folder } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import ToolCard from '@/components/tool-card'; // For the "All Tools" section

const TopBanner = () => (
  <div className="bg-primary text-primary-foreground py-2.5 text-center text-sm font-medium">
    Free. No Sign-Up Required. No Limits. {' '}
    <Link href="/about" className="underline hover:opacity-80">Read More</Link>
  </div>
);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For search simulation

  useEffect(() => {
    setIsMounted(true);
    // Check for search query in URL on mount (e.g., from header search redirect)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryFromUrl = params.get('q');
      if (queryFromUrl) {
        setSearchQuery(queryFromUrl);
        // Optionally, scroll to a specific section if query is present
        const toolsSection = document.getElementById('all-tools-section');
        if (toolsSection) {
          toolsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate search or filter tools
    // For now, just scrolls to the tools section if a query is entered
    setTimeout(() => {
      setIsLoading(false);
      const toolsSection = document.getElementById('all-tools-section');
      if (toolsSection && searchQuery.trim()) {
        toolsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const filteredAllTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return TOOLS_DATA;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return TOOLS_DATA.filter(tool =>
      tool.name.toLowerCase().includes(lowerCaseQuery) ||
      tool.description.toLowerCase().includes(lowerCaseQuery) ||
      (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerCaseQuery))) ||
      (tool.headerCategory && tool.headerCategory.toLowerCase().includes(lowerCaseQuery))
    );
  }, [searchQuery]);
  
  const stats = [
    { id: 'users', label: 'Active Users', value: '1.2M+', icon: Users },
    { id: 'conversions', label: 'Files Processed', value: '10M+', icon: FileCog },
    { id: 'tools', label: 'Online Tools', value: `${TOOLS_DATA.length}+`, icon: Wrench },
  ];


  if (!isMounted) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading tools...</div>;
  }

  return (
    <div className="flex flex-col">
      <TopBanner />

      {/* Hero Section */}
      <section className="bg-background py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Free Tools to Make <span className="bg-[hsl(var(--hero-highlight-bg))] text-[hsl(var(--hero-highlight-fg))] px-2 py-1 rounded-md">Everything</span> Simple
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            We provide a suite of free online tools including PDF tools, image editing, video utilities, AI writing aids, and file converters. All accessible without sign-up.
          </p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              type="search"
              placeholder="Search for a tool (e.g., PDF to Word, Remove Background...)"
              className="w-full pl-12 pr-32 sm:pr-36 py-3 text-base rounded-full shadow-md h-14 focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tools"
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Search'}
            </Button>
          </form>
        </div>
      </section>

      {/* Tool Category Cards Section */}
      <section className="py-12 md:py-16 bg-secondary/50" id="tool-categories">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6">
            {TINY_WOW_CATEGORIES.map((category) => (
              <TinyWowCategoryCard key={category.id} card={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Row (Optional - As per general good design, TinyWow doesn't have this prominently) */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-card p-6 rounded-lg shadow-sm border">
                <stat.icon className="h-10 w-10 text-primary mb-3 mx-auto" />
                <p className="text-2xl md:text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section for All Tools (if searched or scrolled to) */}
      <section className="py-12 md:py-16 bg-background" id="all-tools-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">
            {searchQuery.trim() ? `Search Results for "${searchQuery}"` : "All Our Tools"} ({filteredAllTools.length})
          </h2>
          {filteredAllTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredAllTools.map((tool: Tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-lg">
              No tools found matching your search criteria.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}
