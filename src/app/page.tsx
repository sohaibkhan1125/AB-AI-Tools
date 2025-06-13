
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ToolCard from '@/components/tool-card';
import { TOOLS_DATA } from '@/lib/tools-data';
import type { Tool, ToolCategory } from '@/types/tool';
import { Users, FileCog, Wrench, Eye, TrendingUp, Download as DownloadIcon } from 'lucide-react'; // Added DownloadIcon
import React, { useMemo } from 'react'; // Added React for JSX types

// Define categories for homepage display
const HOMEPAGE_CATEGORIES_ORDER: ToolCategory[] = [
  'PDF Tools',
  'Image Tools',
  'Video Tools',
  'Text & AI Tools', // This will map to "AI Write Tools" heading
];

interface GroupedTools {
  [category: string]: Tool[];
}

export default function HomePage() {

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
              <Link href="#tools-section">Explore All Tools</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-sm">
              <Link href="#popular-tools">Most Popular</Link> {/* This ID will need to be added to a relevant section */}
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

      {/* Tools Grid by Category */}
      <section id="tools-section" className="container mx-auto px-4 space-y-10">
         {HOMEPAGE_CATEGORIES_ORDER.map((categoryName) => {
          const toolsInCategory = groupedTools[categoryName] || [];
          if (toolsInCategory.length === 0 && categoryName !== "Video Tools") { // Always show Video Tools heading even if empty
            // Optionally skip rendering the section if no tools, unless it's Video Tools
            // return null;
          }
          return (
            <div key={categoryName} id={categoryName === "PDF Tools" ? "popular-tools" : undefined}> {/* Example ID for "Most Popular" link */}
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
                  {categoryName === "Video Tools" ? "Video tools coming soon!" : `No tools available in this category yet.`}
                </p>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
