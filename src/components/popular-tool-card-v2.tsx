
'use client';

import Link from 'next/link';
import type { Tool as AppTool, FunctionalToolCategory } from '@/types/tool'; 
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PopularToolCardProps {
  tool: AppTool;
}

const getCategoryStyles = (category: FunctionalToolCategory | undefined) => {
  switch (category) {
    case 'PDF Tools':
      return {
        iconBg: 'bg-[hsl(var(--category-pdf-bg-light-hsl))]',
        iconText: 'text-[hsl(var(--category-pdf-text-hsl))]',
        labelText: 'text-[hsl(var(--category-pdf-text-hsl))]',
      };
    case 'Image Tools':
      return {
        iconBg: 'bg-[hsl(var(--category-image-bg-light-hsl))]',
        iconText: 'text-[hsl(var(--category-image-text-hsl))]',
        labelText: 'text-[hsl(var(--category-image-text-hsl))]',
      };
    case 'Video Tools':
      return {
        iconBg: 'bg-[hsl(var(--category-video-bg-light-hsl))]',
        iconText: 'text-[hsl(var(--category-video-text-hsl))]',
        labelText: 'text-[hsl(var(--category-video-text-hsl))]',
      };
    case 'Text & AI Tools': // "AI Write"
      return {
        iconBg: 'bg-[hsl(var(--category-ai-write-bg-light-hsl))]',
        iconText: 'text-[hsl(var(--category-ai-write-text-hsl))]',
        labelText: 'text-[hsl(var(--category-ai-write-text-hsl))]',
      };
    case 'Data Converters':
    case 'Calculators':
    case 'Web Utilities':
    case 'File Management':
    default: // Default to "Other" category colors (Teal)
      return {
        iconBg: 'bg-[hsl(var(--category-other-bg-light-hsl))]',
        iconText: 'text-[hsl(var(--category-other-text-hsl))]',
        labelText: 'text-[hsl(var(--category-other-text-hsl))]',
      };
  }
};

const PopularToolCardV2 = ({ tool }: PopularToolCardProps) => {
  const IconComponent = tool.icon;
  const name = tool.popularCardName || tool.name;
  const description = tool.popularCardDescription || tool.description;
  const displayCategory = tool.popularDisplayCategory || tool.functionalCategory; // Use functionalCategory for color mapping

  const categoryStyles = getCategoryStyles(tool.functionalCategory);

  return (
    <Link href={tool.href} passHref legacyBehavior>
      <a className="block group h-full">
        <Card className="flex flex-col h-full bg-card text-card-foreground rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden border border-border">
          <CardContent className="p-4 flex-grow">
            <div className="flex items-center mb-2.5">
              <div className={cn(
                  "p-1.5 rounded-md mr-3 inline-flex items-center justify-center",
                  categoryStyles.iconBg
                )}>
                <IconComponent className={cn("h-5 w-5", categoryStyles.iconText)} />
              </div>
              <span 
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide",
                  categoryStyles.labelText
                )}
              >
                {displayCategory}
              </span>
            </div>
            <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors mb-1 leading-tight truncate" title={name}>
              {name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1" title={description}>
              {description}
            </p>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
};

export default PopularToolCardV2;
