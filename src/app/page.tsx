'use client';

import { useState, useMemo } from 'react';
import HeroSection from '@/components/hero-section';
import ToolSearch from '@/components/tool-search';
import ToolCard from '@/components/tool-card';
import { TOOLS_DATA } from '@/lib/tools-data';
import type { Tool } from '@/types/tool';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

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
      <HeroSection />
      
      <section id="tools-section" className="py-8">
        <h2 className="text-3xl font-bold text-center mb-4 font-headline">Our Tools</h2>
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
