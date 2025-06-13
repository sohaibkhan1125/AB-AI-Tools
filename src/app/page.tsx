
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ToolSearch from '@/components/tool-search';
import ToolCard from '@/components/tool-card';
import { TOOLS_DATA } from '@/lib/tools-data';
import type { Tool, ToolCategory } from '@/types/tool';
import { 
  FileText, Image as ImageIconLucide, Video as VideoIcon, Sparkles as SparklesIcon, 
  Folder as FolderIcon, Users, FileUp, CheckCircle, ArrowRight, ChevronUp,
  User, UploadCloud, FileSliders, FileDigit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Simpler Hero Section
const HomepageHeroSection = () => (
  <section className="py-12 sm:py-16 text-center bg-gradient-to-b from-background to-primary/5 rounded-lg mb-8">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-primary mb-3">
        Free Tools to Make Everything Simple
      </h1>
      <p className="text-md sm:text-lg text-foreground/80 max-w-2xl mx-auto">
        We offer PDF, video, image and other online tools to make your life easier.
      </p>
    </div>
  </section>
);

// Section for categories
const ToolCategoriesSection = () => {
  const categories: { name: string; description: string; icon: React.ElementType; toolCount: string; bgColorClass: string; textColorClass: string; borderColorClass: string; href: string }[] = [
    { name: 'PDF Tools', description: 'Solve Your PDF Problems', icon: FileText, toolCount: '30+', bgColorClass: 'bg-red-50 dark:bg-red-900/20', textColorClass: 'text-red-600 dark:text-red-400', borderColorClass: 'border-red-200 dark:border-red-700', href:"/tools/image-to-pdf" },
    { name: 'Image Tools', description: 'Solve Your Image Problems', icon: ImageIconLucide, toolCount: '30+', bgColorClass: 'bg-blue-50 dark:bg-blue-900/20', textColorClass: 'text-blue-600 dark:text-blue-400', borderColorClass: 'border-blue-200 dark:border-blue-700', href: "/tools/image-resizer" },
    { name: 'Video Tools', description: 'Solve Your Video Problems', icon: VideoIcon, toolCount: '10+', bgColorClass: 'bg-green-50 dark:bg-green-900/20', textColorClass: 'text-green-600 dark:text-green-400', borderColorClass: 'border-green-200 dark:border-green-700', href: "/" }, // Placeholder link
    { name: 'AI Write', description: 'Solve Your Text Problems', icon: SparklesIcon, toolCount: '10+', bgColorClass: 'bg-purple-50 dark:bg-purple-900/20', textColorClass: 'text-purple-600 dark:text-purple-400', borderColorClass: 'border-purple-200 dark:border-purple-700', href:"/tools/lorem-ipsum-generator" },
    { name: 'File Tools', description: 'Solve Your File Problems', icon: FolderIcon, toolCount: '15+', bgColorClass: 'bg-yellow-50 dark:bg-yellow-900/20', textColorClass: 'text-yellow-600 dark:text-yellow-400', borderColorClass: 'border-yellow-200 dark:border-yellow-700', href:"/tools/split-excel-file" },
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link key={category.name} href={category.href} passHref>
              <Card className={`shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl border ${category.borderColorClass} ${category.bgColorClass} cursor-pointer h-full flex flex-col`}>
                <CardHeader className="flex-row items-center gap-4 pb-3">
                  <category.icon className={`h-8 w-8 ${category.textColorClass}`} />
                  <CardTitle className={`text-xl font-semibold ${category.textColorClass}`}>{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-foreground/70 mb-2">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-muted-foreground">{category.toolCount} tools</p>
                    <Button variant="link" size="sm" className={`${category.textColorClass} p-0 h-auto`}>Search <ArrowRight className="ml-1 h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Section for Featured Tools
const FeaturedToolsSection = () => {
  const featuredTools: { name: string; icon: React.ElementType, href: string, comingSoon?: boolean }[] = [
    { name: 'PDF Creator', icon: FileUp, href: '/tools/image-to-pdf' },
    { name: 'Remove BG', icon: ImageIconLucide, href: '/tools/image-background-remover' },
    { name: 'Mute Video', icon: VideoIcon, href: '/', comingSoon: true },
    { name: 'Paragraph Writer', icon: SparklesIcon, href: '/tools/lorem-ipsum-generator' },
    { name: 'Split Excel', icon: FileSliders, href: '/tools/split-excel-file' },
  ];

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-8 font-headline">Featured Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {featuredTools.map(tool => (
            <Link key={tool.name} href={tool.comingSoon ? "#" : tool.href} passHref>
              <Card className={cn(
                "text-center p-4 hover:shadow-md transition-shadow duration-200 rounded-lg cursor-pointer",
                tool.comingSoon && "opacity-50 cursor-not-allowed"
              )}>
                <tool.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">{tool.name}</p>
                {tool.comingSoon && <p className="text-xs text-amber-600 dark:text-amber-400">Coming Soon</p>}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Section for Stats
const StatsSection = () => {
  const stats = [
    { value: '1M+', label: 'Active Users', icon: User },
    { value: '10M+', label: 'Converted Files', icon: UploadCloud },
    { value: '200+', label: 'Online Tools', icon: CheckCircle },
    { value: '500k+', label: 'PDFs Created', icon: FileDigit },
  ];
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(stat => (
            <div key={stat.label} className="p-4 bg-card border rounded-lg shadow-sm">
              <stat.icon className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery) {
      return TOOLS_DATA;
    }
    const lowerSearchQuery = searchQuery.toLowerCase();
    return TOOLS_DATA.filter((tool) =>
      tool.name.toLowerCase().includes(lowerSearchQuery) ||
      tool.description.toLowerCase().includes(lowerSearchQuery) ||
      tool.category.toLowerCase().includes(lowerSearchQuery) ||
      (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchQuery)))
    );
  }, [searchQuery]);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="space-y-0"> {/* Remove default space-y-12 */}
      <HomepageHeroSection />
      <ToolCategoriesSection />
      <FeaturedToolsSection />
      <StatsSection />
      
      <section id="tools-section" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 font-headline">Our Tools ({TOOLS_DATA.length}+)</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
            Explore our comprehensive suite of tools designed to simplify your digital tasks.
          </p>
          <ToolSearch onSearchChange={setSearchQuery} placeholder="Search for any tool..." />
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTools.map((tool: Tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10 text-lg">
              No tools found matching "{searchQuery}". Try a different search term.
            </p>
          )}
        </div>
      </section>
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
