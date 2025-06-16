
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { FeaturedStripTool, FunctionalToolCategory } from '@/types/tool';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedToolStripCardProps {
  tool: FeaturedStripTool;
}

const getCategoryBgLightClass = (category: FunctionalToolCategory | undefined): string => {
  switch (category) {
    case 'PDF Tools':
      return 'bg-[hsl(var(--category-pdf-bg-light-hsl))]';
    case 'Image Tools':
      return 'bg-[hsl(var(--category-image-bg-light-hsl))]';
    case 'Video Tools':
      return 'bg-[hsl(var(--category-video-bg-light-hsl))]';
    case 'Text & AI Tools':
      return 'bg-[hsl(var(--category-ai-write-bg-light-hsl))]';
    case 'Data Converters':
    case 'Calculators':
    case 'Web Utilities':
    case 'File Management':
    default:
      return 'bg-[hsl(var(--category-other-bg-light-hsl))]';
  }
};

const getCategoryTextClass = (category: FunctionalToolCategory | undefined): string => {
  switch (category) {
    case 'PDF Tools':
      return 'text-[hsl(var(--category-pdf-text-hsl))]';
    case 'Image Tools':
      return 'text-[hsl(var(--category-image-text-hsl))]';
    case 'Video Tools':
      return 'text-[hsl(var(--category-video-text-hsl))]';
    case 'Text & AI Tools':
      return 'text-[hsl(var(--category-ai-write-text-hsl))]';
    case 'Data Converters':
    case 'Calculators':
    case 'Web Utilities':
    case 'File Management':
    default:
      return 'text-[hsl(var(--category-other-text-hsl))]';
  }
};


const FeaturedToolStripCard = ({ tool }: FeaturedToolStripCardProps) => {
  const imageBgClass = getCategoryBgLightClass(tool.functionalCategory);
  const learnMoreColorClass = getCategoryTextClass(tool.functionalCategory);

  return (
    <Card className="w-64 sm:w-72 flex-shrink-0 snap-start rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out overflow-hidden group bg-card border-border">
      <CardContent className="p-0 flex flex-col h-full">
        <div className={cn("h-40 w-full relative overflow-hidden", imageBgClass )}>
          <Image
            src={tool.imageSrc}
            alt={tool.imageAlt}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={tool.dataAiHint}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-foreground mb-1 leading-tight">
            {tool.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-grow">
            {tool.description}
          </p>
          <Button variant="link" asChild className={cn("p-0 h-auto self-start hover:underline", learnMoreColorClass)}>
            <Link href={tool.href}>
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedToolStripCard;
