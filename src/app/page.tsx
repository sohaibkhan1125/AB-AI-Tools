
'use client';

import { useState, useMemo } from 'react';
import ToolSearch from '@/components/tool-search';
import ToolCard from '@/components/tool-card';
import { TOOLS_DATA } from '@/lib/tools-data';
import type { Tool, ToolCategory } from '@/types/tool';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText as PdfIcon, Image as ImageIcon, Video, Folder as FileIcon, Sparkles as WriteIcon, Settings2, LucideIcon, Search as SearchIcon } from 'lucide-react';

// Hero Section for Homepage
const HomepageHeroSection = () => (
  <section className="py-16 sm:py-20 text-center bg-gradient-to-b from-background to-primary/5 rounded-lg mb-12">
    <div className="container mx-auto px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline text-primary mb-4">
        Free Tools to Make Everything Simple
      </h1>
      <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto">
        We offer PDF, video, image and other online tools to make your life easier
      </p>
    </div>
  </section>
);

interface CategoryDisplayInfo {
  title: ToolCategory;
  displayTitle?: string; // For "AI Write" vs "Text & AI Tools"
  subtitle: string;
  icon: LucideIcon;
  searchLink?: string; // e.g. "#tools-section" or specific query
}

const categoryDisplayConfig: CategoryDisplayInfo[] = [
  { title: 'PDF Tools', subtitle: 'Solve Your PDF Problems', icon: PdfIcon, searchLink: '#tools-section' },
  { title: 'Image Tools', subtitle: 'Solve Your Image Problems', icon: ImageIcon, searchLink: '#tools-section' },
  { title: 'Video Tools', subtitle: 'Solve Your Video Problems', icon: Video, searchLink: '#tools-section' },
  { title: 'Text & AI Tools', displayTitle: 'AI Write', subtitle: 'Solve Your Text Problems', icon: WriteIcon, searchLink: '#tools-section' },
  { title: 'File Management', displayTitle: 'File Tools', subtitle: 'Solve Your File Problems', icon: FileIcon, searchLink: '#tools-section' },
];

interface FeaturedToolInfo {
  name: string;
  toolId?: string; // To find the actual tool from TOOLS_DATA
  icon: LucideIcon;
  href?: string; // Direct link if toolId is not used or for external links
  isPlaceholder?: boolean;
}

const featuredToolsConfig: FeaturedToolInfo[] = [
  { name: 'PDF Creator', toolId: 'image-to-pdf', icon: PdfIcon },
  { name: 'Remove BG', toolId: 'ai-image-background-remover', icon: ImageIcon },
  { name: 'Mute Video', icon: Video, isPlaceholder: true }, // Placeholder
  { name: 'Paragraph Writer', toolId: 'lorem-ipsum-generator', icon: WriteIcon },
  { name: 'Split Excel', toolId: 'split-excel-file', icon: FileIcon },
];


export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const allToolsCount = TOOLS_DATA.length;

  const getToolCountForCategory = (category: ToolCategory): number => {
    return TOOLS_DATA.filter(tool => tool.category === category).length;
  };
  
  const getActualTool = (toolId?: string): Tool | undefined => {
    if (!toolId) return undefined;
    return TOOLS_DATA.find(t => t.id === toolId);
  };


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
      
      {/* Categories Section */}
      <section className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryDisplayConfig.map((catInfo) => {
            const toolCount = getToolCountForCategory(catInfo.title);
            const IconComponent = catInfo.icon;
            return (
              <Card key={catInfo.title} className="shadow-md hover:shadow-lg transition-shadow bg-card">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="h-7 w-7 text-primary" />
                    <CardTitle className="text-xl font-semibold">{catInfo.displayTitle || catInfo.title}</CardTitle>
                  </div>
                  <CardDescription>{catInfo.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">{toolCount > 0 ? `${toolCount}+ tools` : "Coming Soon"}</p>
                  {catInfo.searchLink && toolCount > 0 && (
                     <Button variant="ghost" size="sm" asChild className="text-primary hover:bg-primary/10">
                      <Link href={catInfo.searchLink}>Search <SearchIcon className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {featuredToolsConfig.map((ftInfo) => {
            const actualTool = getActualTool(ftInfo.toolId);
            const IconComponent = ftInfo.icon;
            const toolName = actualTool?.name || ftInfo.name;
            const href = actualTool?.href || (ftInfo.isPlaceholder ? "#" : "/");
            
            return (
              <Link key={ftInfo.name} href={href} className={`group block ${ftInfo.isPlaceholder ? 'opacity-60 pointer-events-none' : ''}`}>
                <Card className="text-center p-4 hover:bg-primary/5 transition-colors h-full flex flex-col items-center justify-center">
                   <IconComponent className="h-8 w-8 text-primary mb-2" />
                   <p className="text-sm font-medium text-foreground">
                     Featured Tool: <span className="group-hover:underline">{toolName}</span>
                   </p>
                   {ftInfo.isPlaceholder && <p className="text-xs text-muted-foreground">(Coming Soon)</p>}
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
      
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
