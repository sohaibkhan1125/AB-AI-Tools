
import Link from 'next/link';
import type { Tool } from '@/types/tool';
import { Card, CardContent } from '@/components/ui/card'; // Removed CardHeader, CardTitle, CardDescription, Button

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const IconComponent = tool.icon;
  return (
    <Link href={tool.href} className="group block h-full">
      <Card className="h-full flex flex-col p-4 hover:shadow-md transition-shadow duration-200 ease-in-out border border-border hover:border-primary/30 rounded-lg">
        <CardContent className="flex items-start gap-3 p-0 flex-grow"> {/* Use items-start for vertical alignment if content heights vary */}
          <div className="flex-shrink-0 bg-primary/10 p-2.5 rounded-md mt-1"> {/* Adjusted padding and margin */}
            <IconComponent className="h-5 w-5 text-primary" /> {/* Slightly smaller icon */}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
              {tool.name}
            </h3>
            {tool.displayCategory && (
              <p className="text-xs text-primary/80 mt-0.5 mb-1"> {/* Category below title */}
                {tool.displayCategory}
              </p>
            )}
            <p className="text-xs text-muted-foreground leading-snug">
              {tool.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;
