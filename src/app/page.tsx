
'use client';

import { useState, useMemo } from 'react';
import ToolSearch from '@/components/tool-search';
import ToolCard from '@/components/tool-card';
import { TOOLS_DATA } from '@/lib/tools-data';
import type { Tool } from '@/types/tool';

// Hero Section for Homepage (Restored to simpler version)
const HomepageHeroSection = () => (
  <section className="py-16 sm:py-20 text-center bg-gradient-to-b from-background to-primary/5 rounded-lg mb-12">
    <div className="container mx-auto px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline text-primary mb-4">
        AI Tools Hub
      </h1>
      <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto">
        Discover a powerful suite of AI-driven online tools designed to simplify your tasks and boost productivity. Free, easy to use, and no limits.
      </p>
    </div>
  </section>
);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const allToolsCount = TOOLS_DATA.length;

  const filteredTools = useMemo(() => {
    if (!searchQuery) {
      return TOOLS_DATA;
    }
    return TOOLS_DATA.filter((tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [searchQuery]);

  return (
    <div className="space-y-12">
      <HomepageHeroSection />
      
      <section id="tools-section" className="py-8">
        <h2 className="text-3xl font-bold text-center mb-4 font-headline">Our Tools ({allToolsCount})</h2>
        <p className="text-lg text-muted-foreground text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
          Discover a range of utilities designed to simplify your tasks. More tools coming soon!
        </p>
        <ToolSearch onSearchChange={setSearchQuery} />

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool: Tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">
            No tools found matching your search criteria.
          </p>
        )}
      </section>
    </div>
  );
}
