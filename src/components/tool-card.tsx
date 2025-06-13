
import Link from 'next/link';
import type { Tool } from '@/types/tool';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const IconComponent = tool.icon;
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <CardHeader className="flex-row items-center gap-4 pb-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg font-semibold leading-tight">{tool.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm line-clamp-3">{tool.description}</CardDescription>
        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            Category: {tool.category}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" asChild className="w-full">
          <Link href={tool.href}>Open Tool &rarr;</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
