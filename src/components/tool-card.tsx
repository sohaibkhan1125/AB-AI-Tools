
import Link from 'next/link';
import type { Tool } from '@/types/tool';
import { Card, CardContent } from '@/components/ui/card'; // Removed unused Card components

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const IconComponent = tool.icon;
  return (
    <Link href={tool.href} passHref legacyBehavior>
      <a className="block group h-full">
        <Card className="h-full hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden border border-border/70">
          <CardContent className="p-4 flex flex-col items-start text-left h-full">
            <div className="bg-primary/10 p-2 rounded-md inline-flex mb-3">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
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
