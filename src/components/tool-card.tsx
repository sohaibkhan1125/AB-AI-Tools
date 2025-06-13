
import Link from 'next/link';
import type { Tool } from '@/types/tool';
import { Card, CardContent } from '@/components/ui/card';

interface ToolCardProps {
  tool: Tool;
}

// This is the standard tool card, used if an "All Tools" section is re-added.
// The current prompt focuses on PopularToolCardV2 for the main display.
const ToolCard = ({ tool }: ToolCardProps) => {
  const IconComponent = tool.icon;
  return (
    <Link href={tool.href} passHref legacyBehavior>
      <a className="block group h-full">
        <Card className="h-full hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden border border-border/70 bg-card hover:border-primary/50">
          <CardContent className="p-4 flex flex-col items-start text-left h-full">
            <div className="bg-primary/10 p-2.5 rounded-lg inline-flex mb-3">
              <IconComponent className="h-6 w-6 text-primary" />
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
