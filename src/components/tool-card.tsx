
import Link from 'next/link';
import type { Tool, FunctionalToolCategory } from '@/types/tool';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
}

const getCategoryStyles = (category: FunctionalToolCategory | undefined) => {
  switch (category) {
    case 'PDF Tools':
      return {
        iconBg: 'bg-[hsl(var(--category-pdf-bg-light-hsl))]',
        iconText: 'text-[hsl(var(--category-pdf-text-hsl))]',
      };
    case 'Image Tools':
      return {
        iconBg: 'bg-[hsl(var(--category-image-bg-light-hsl))]',
        iconText: 'text-[hsl(var(--category-image-text-hsl))]',
      };
    case 'Video Tools':
      return {
        iconBg: 'bg-[hsl(var(--category-video-bg-light-hsl))]',
        iconText: 'text-[hsl(var(--category-video-text-hsl))]',
      };
    case 'Text & AI Tools': 
      return {
        iconBg: 'bg-[hsl(var(--category-ai-write-bg-light-hsl))]',
        iconText: 'text-[hsl(var(--category-ai-write-text-hsl))]',
      };
    case 'Data Converters':
    case 'Calculators':
    case 'Web Utilities':
    case 'File Management':
    default: 
      return {
        iconBg: 'bg-[hsl(var(--category-other-bg-light-hsl))]',
        iconText: 'text-[hsl(var(--category-other-text-hsl))]',
      };
  }
};


const ToolCard = ({ tool }: ToolCardProps) => {
  const IconComponent = tool.icon;
  const categoryStyles = getCategoryStyles(tool.functionalCategory);

  return (
    <Link href={tool.href} passHref legacyBehavior>
      <a className="block group h-full">
        <Card className="h-full hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden border border-border bg-card hover:border-primary/50">
          <CardContent className="p-4 flex flex-col items-start text-left h-full">
            <div className={cn(
              "p-2.5 rounded-lg inline-flex mb-3",
              categoryStyles.iconBg
            )}>
              <IconComponent className={cn("h-6 w-6", categoryStyles.iconText)} />
            </div>
            <h3 className="text-md font-semibold text-card-foreground group-hover:text-primary transition-colors mb-1 leading-tight">
              {tool.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 flex-grow">
              {tool.description}
            </p>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
};

export default ToolCard;
