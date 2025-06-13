
import Link from 'next/link';
import type { Tool } from '@/types/tool'; // Using the main Tool type
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface PopularToolCardProps {
  tool: Tool; // Uses the extended Tool type which includes cardName, cardDescription etc.
}

const PopularToolCard = ({ tool }: PopularToolCardProps) => {
  const IconComponent = tool.icon;
  const name = tool.cardName || tool.name;
  const description = tool.cardDescription || tool.description;
  const displayCategory = tool.displayCategory || tool.category;

  return (
    <Link href={tool.href} passHref legacyBehavior>
      <a className="block group h-full">
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden">
          <CardContent className="p-4 flex-grow flex">
            <div className="flex items-start gap-4 w-full">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-primary/10 p-3 rounded-lg inline-flex">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-medium text-primary/80 mb-0.5 uppercase tracking-wider">
                  {displayCategory}
                </p>
                <h3 className="text-base sm:text-md font-semibold text-foreground group-hover:text-primary transition-colors truncate" title={name}>
                  {name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1" title={description}>
                  {description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
};

export default PopularToolCard;
