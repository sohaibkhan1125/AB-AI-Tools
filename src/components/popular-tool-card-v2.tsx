
'use client';

import Link from 'next/link';
import type { Tool as AppTool } from '@/types/tool'; // Renamed to avoid conflict
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PopularToolCardProps {
  tool: AppTool;
}

const PopularToolCardV2 = ({ tool }: PopularToolCardProps) => {
  const IconComponent = tool.icon;
  // Use popularCardName/Description if available, otherwise fall back to tool.name/description
  const name = tool.popularCardName || tool.name;
  const description = tool.popularCardDescription || tool.description;
  // Use popularDisplayCategory if available, otherwise fall back to tool.category (or headerCategory)
  const displayCategory = tool.popularDisplayCategory || tool.headerCategory || tool.category;

  return (
    <Link href={tool.href} passHref legacyBehavior>
      <a className="block group h-full">
        <Card className={cn(
          "flex flex-col h-full text-[hsl(var(--popular-tool-card-fg))] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden",
          "bg-[hsl(var(--popular-tool-card-bg))]", // Apply new background
          "border border-[hsl(var(--popular-tool-card-border-color))]" // Apply new border color
        )}>
          <CardContent className="p-4 flex-grow">
            <div className="flex items-center mb-2.5">
              <div className={cn(
                  "p-1.5 rounded-md mr-3 inline-flex items-center justify-center",
                  tool.iconBgClass || "bg-primary/10"
                )}>
                <IconComponent className={cn("h-5 w-5", tool.categoryLabelColorClass || "text-primary")} />
              </div>
              <span 
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide",
                  tool.categoryLabelColorClass || "text-primary"
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
