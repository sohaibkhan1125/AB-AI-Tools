import Link from 'next/link';
import type { Tool } from '@/types/tool';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const IconComponent = tool.icon;
  return (
    <Link href={tool.href} className="group block h-full">
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 ease-in-out border-border hover:border-primary/50">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {tool.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <CardDescription className="text-sm text-muted-foreground mb-4">
            {tool.description}
          </CardDescription>
          <Button variant="ghost" size="sm" className="self-start text-primary p-0 h-auto hover:bg-transparent group-hover:underline">
            Open Tool <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;
