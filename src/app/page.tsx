
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ToolSearch from '@/components/tool-search';
import ToolCard from '@/components/tool-card';
import { TOOLS_DATA } from '@/lib/tools-data';
import type { Tool, ToolCategory } from '@/types/tool';
import {
  FileText as PdfIcon,
  Image as ImageIconLucide,
  Clapperboard as VideoIconLucide,
  Sparkles as AiWriteIcon,
  Folder as FileToolsIcon,
  ChevronRight,
  Users, BarChart3, CheckCircle, Settings2, Wrench, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CATEGORY_DISPLAY_CONFIG: Array<{
  name: ToolCategory;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  toolCount?: string;
  href: string;
}> = [
  { name: 'PDF Tools', title: 'PDF Tools', subtitle: 'Solve Your PDF Problems', icon: PdfIcon, toolCount: '30+', href: '/#tools-section' },
  { name: 'Image Tools', title: 'Image Tools', subtitle: 'Solve Your Image Problems', icon: ImageIconLucide, toolCount: '10+', href: '/#tools-section' },
  { name: 'Video Tools', title: 'Video Tools', subtitle: 'Solve Your Video Problems', icon: VideoIconLucide, toolCount: '10+', href: '/#tools-section' },
  { name: 'Text & AI Tools', title: 'AI Write', subtitle: 'Solve Your Text Problems', icon: AiWriteIcon, toolCount: '10+', href: '/#tools-section' },
  { name: 'File Management', title: 'File Tools', subtitle: 'Solve Your File Problems', icon: FileToolsIcon, toolCount: '15+', href: '/#tools-section' },
];

const FEATURED_TOOLS_DISPLAY_CONFIG = [
  { name: 'PDF Creator', href: '/tools/image-to-pdf', icon: PdfIcon, category: 'PDF Tools' },
  { name: 'Remove BG', href: '/tools/image-background-remover', icon: ImageIconLucide, category: 'Image Tools' },
  { name: 'Mute Video', href: '#!', icon: VideoIconLucide, category: 'Video Tools', comingSoon: true },
  { name: 'Paragraph Writer', href: '/tools/lorem-ipsum-generator', icon: AiWriteIcon, category: 'AI Write' },
  { name: 'Split Excel', href: '/tools/split-excel-file', icon: FileToolsIcon, category: 'File Tools' },
];

const STATS_CONFIG = [
  { value: "1M+", label: "Active Users", icon: Users },
  { value: "10M+", label: "Converted Files", icon: Settings2 },
  { value: "200+", label: "Online Tools", icon: Wrench },
  { value: "500k+", label: "PDFs Created", icon: CheckCircle },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    if (!lowerSearchQuery) return TOOLS_DATA;
    return TOOLS_DATA.filter((tool) =>
      tool.name.toLowerCase().includes(lowerSearchQuery) ||
      tool.description.toLowerCase().includes(lowerSearchQuery) ||
      (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchQuery))) ||
      tool.category.toLowerCase().includes(lowerSearchQuery)
    );
  }, [searchQuery]);

  const ToolCategoryCard: React.FC<{config: typeof CATEGORY_DISPLAY_CONFIG[0]}> = ({ config }) => {
    const actualToolCount = useMemo(() => {
      if (config.name === 'Video Tools' && TOOLS_DATA.filter(tool => tool.category === config.name).length === 0) {
        return "Soon"; // If Video Tools category has no actual tools, show "Soon"
      }
      const count = TOOLS_DATA.filter(tool => tool.category === config.name).length;
      return `${count}${count === 1 ? ' tool' : ' tools'}`;
    }, [config.name]);

    return (
      <Link href={config.href} passHref legacyBehavior>
        <a className="block group">
          <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out h-full">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 p-2.5 rounded-lg mr-3">
                  <config.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-md sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{config.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">{config.subtitle}</p>
              <p className="text-xs text-primary font-medium">
                {actualToolCount}
              </p>
            </CardContent>
          </Card>
        </a>
      </Link>
    );
  };

  const FeaturedToolDisplayCard: React.FC<{config: typeof FEATURED_TOOLS_DISPLAY_CONFIG[0]}> = ({ config }) => (
     <Link href={config.comingSoon ? '#!' : config.href} passHref legacyBehavior>
        <a className={`block group ${config.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}`}>
          <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out h-full">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center mb-2">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  <config.icon className="h-4 w-4 text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{config.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground">{config.category}</p>
              {config.comingSoon && <p className="text-xs text-amber-500 mt-1">Coming Soon</p>}
            </CardContent>
          </Card>
        </a>
      </Link>
  );

  const StatCard: React.FC<{config: typeof STATS_CONFIG[0]}> = ({ config }) => (
    <Card className="bg-card/50">
      <CardContent className="p-4 text-center">
        <config.icon className="h-8 w-8 text-primary mx-auto mb-2" />
        <p className="text-2xl font-bold text-foreground">{config.value}</p>
        <p className="text-xs text-muted-foreground">{config.label}</p>
      </CardContent>
    </Card>
  );


  return (
    <div className="space-y-10 md:space-y-16">
      <section className="text-center pt-8 md:pt-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-primary mb-3">
          Free Tools to Make Everything Simple
        </h1>
        <p className="text-md sm:text-lg text-foreground/80 max-w-2xl mx-auto">
          We offer PDF, video, image and other online tools to make your life easier
        </p>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CATEGORY_DISPLAY_CONFIG.map((catConfig) => (
            <ToolCategoryCard key={catConfig.name} config={catConfig} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6 font-headline text-primary">
          Featured Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
           {FEATURED_TOOLS_DISPLAY_CONFIG.map((toolConfig) => (
            <FeaturedToolDisplayCard key={toolConfig.name} config={toolConfig} />
          ))}
        </div>
      </section>
      
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS_CONFIG.map((stat) => (
            <StatCard key={stat.label} config={stat} />
          ))}
        </div>
      </section>


      <section id="tools-section" className="py-12 bg-muted/20 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 font-headline text-primary">
            Our Tools ({TOOLS_DATA.length})
          </h2>
          <ToolSearch onSearchChange={setSearchQuery} placeholder="Search from all our tools..." />
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTools.map((tool: Tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10 text-lg">
              No tools found matching "{searchQuery}".
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
