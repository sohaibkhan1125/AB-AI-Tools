
'use client';

import { useState, useMemo } from 'react';
import ToolSearch from '@/components/tool-search';
import ToolCard from '@/components/tool-card';
import { TOOLS_DATA } from '@/lib/tools-data';
import type { Tool } from '@/types/tool';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Image as ImageIconLucide, Video as VideoIcon, Sparkles as SparklesIcon, Folder as FolderIcon, Users, FileUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// 1. Existing Hero Section
const HomepageHeroSection = () => (
  <section className="py-16 sm:py-20 text-center bg-gradient-to-b from-background to-primary/5 rounded-lg mb-12">
    <div className="container mx-auto px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline text-primary mb-4">
        AI Tools Hub
      </h1>
      <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto">
        Free Tools to Make Everything Simple. We offer PDF, video, image and other online tools to make your life easier.
      </p>
    </div>
  </section>
);

// 2. New Tool Categories Section Data
const categoryData = [
  { title: "PDF Tools", description: "Solve Your PDF Problems", count: "30+", icon: FileText, href: "/#tools-section", iconHolderBg: "bg-blue-100 dark:bg-blue-800/30", iconColor: "text-blue-600 dark:text-blue-400", searchFilter: "PDF" },
  { title: "Image Tools", description: "Solve Your Image Problems", count: "10+", icon: ImageIconLucide, href: "/#tools-section", iconHolderBg: "bg-purple-100 dark:bg-purple-800/30", iconColor: "text-purple-600 dark:text-purple-400", searchFilter: "Image" },
  { title: "Video Tools", description: "Solve Your Video Problems", count: "10+", icon: VideoIcon, href: "/#tools-section", iconHolderBg: "bg-green-100 dark:bg-green-800/30", iconColor: "text-green-600 dark:text-green-400", searchFilter: "Video" },
  { title: "AI Write", description: "Solve Your Text Problems", count: "10+", icon: SparklesIcon, href: "/#tools-section", iconHolderBg: "bg-yellow-100 dark:bg-yellow-800/30", iconColor: "text-yellow-600 dark:text-yellow-400", searchFilter: "Text AI Write" },
  { title: "File Tools", description: "Solve Your File Problems", count: "15+", icon: FolderIcon, href: "/#tools-section", iconHolderBg: "bg-red-100 dark:bg-red-800/30", iconColor: "text-red-600 dark:text-red-400", searchFilter: "File Management Data Converters" },
];

const ToolCategoriesSection = ({ onCategoryClick }: { onCategoryClick: (filter: string) => void }) => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      {/* Removed "Explore Our Tool Categories" heading to match prompt implicitly showing categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryData.map((category) => (
          <Card key={category.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card border">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-3 ${category.iconHolderBg}`}>
                 <category.icon className={`h-8 w-8 ${category.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-foreground font-headline">{category.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
              <p className="text-xs font-medium text-primary/80 mb-3">{category.count} tools</p>
              <Button variant="link" size="sm" onClick={() => onCategoryClick(category.searchFilter)} className="text-primary group-hover:underline p-0 h-auto text-xs">
                Search <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// 3. New Featured Tools Section Data
const featuredToolsData = [
  { name: "PDF Creator", href: "/tools/image-to-pdf", icon: FileText },
  { name: "Remove BG", href: "/tools/image-background-remover", icon: ImageIconLucide },
  { name: "Mute Video", href: "#", icon: VideoIcon, isComingSoon: true },
  { name: "Paragraph Writer", href: "/tools/lorem-ipsum-generator", icon: SparklesIcon },
  { name: "Split Excel", href: "/tools/split-excel-file", icon: FolderIcon },
];

const FeaturedToolsSection = () => (
  <section className="py-12 bg-muted/20">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-8 font-headline">Featured Tools</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
        {featuredToolsData.map((tool) => (
          <Link key={tool.name} href={tool.isComingSoon ? "#" : tool.href} passHref>
            <div className={`h-full flex flex-col items-center justify-center p-4 text-center shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg bg-card border ${tool.isComingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
              <div className="p-2 bg-primary/10 rounded-full mb-2">
                <tool.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{tool.name}</h3>
              {tool.isComingSoon && <span className="text-xs text-amber-500">(Coming Soon)</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

// 4. New Stats Section
const StatsSection = () => (
  <section className="py-16 bg-primary/5">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <Users className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">1M+</p>
          <p className="text-xs text-muted-foreground uppercase">Active Users</p>
        </div>
        <div>
          <FileUp className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">10m</p>
          <p className="text-xs text-muted-foreground uppercase">Converted Files</p>
        </div>
        <div>
          <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">200+</p>
          <p className="text-xs text-muted-foreground uppercase">Online Tools</p>
        </div>
        <div>
          <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">500k</p>
          <p className="text-xs text-muted-foreground uppercase">PDFs Created</p>
        </div>
      </div>
    </div>
  </section>
);

// Main Page Component
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const allToolsCountDisplay = "45+"; // As per prompt

  const filteredTools = useMemo(() => {
    if (!searchQuery) {
      return TOOLS_DATA;
    }
    const lowerSearchQuery = searchQuery.toLowerCase();
    const searchTerms = lowerSearchQuery.split(/\s+/).filter(term => term.length > 0); // Split search query into terms

    return TOOLS_DATA.filter((tool) => {
      // Check if any search term matches tool name, description, category, or keywords
      return searchTerms.some(term => 
        tool.name.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        tool.category.toLowerCase().includes(term) || // Added category search
        (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(term)))
      );
    });
  }, [searchQuery]);

  const handleCategorySearch = (filter: string) => {
    setSearchQuery(filter);
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-0"> {/* Reduce top-level space for more compact layout */}
      <HomepageHeroSection />
      <ToolCategoriesSection onCategoryClick={handleCategorySearch} />
      <FeaturedToolsSection />
      <StatsSection />
      
      <section id="tools-section" className="py-12">
        <h2 className="text-3xl font-bold text-center mb-4 font-headline">Our Tools ({allToolsCountDisplay})</h2>
        <p className="text-lg text-muted-foreground text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
          Explore our full suite of utilities. Find the right tool for your task.
        </p>
        <ToolSearch onSearchChange={setSearchQuery} placeholder={searchQuery || "Search from 45+ tools..."} />

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool: Tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">
            No tools found matching your search criteria. Try a different search term.
          </p>
        )}
      </section>
    </div>
  );
}
