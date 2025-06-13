
import Link from 'next/link';
import type { TinyWowCategoryCardData } from '@/types/tool';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TinyWowCategoryCardProps {
  card: TinyWowCategoryCardData;
}

const TinyWowCategoryCard = ({ card }: TinyWowCategoryCardProps) => {
  const IconComponent = card.icon;

  return (
    <Link href={card.href} passHref legacyBehavior>
      <a className="block group h-full">
        <Card className={cn(
          "h-full rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out overflow-hidden flex flex-col",
          card.bgColorClass,
          card.textColorClass
        )}>
          <CardContent className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-3">
              <div className={cn("p-2 rounded-md bg-white/20", card.textColorClass === 'text-black' ? 'bg-black/10' : 'bg-white/20')}>
                <IconComponent className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-white/25 rounded-full">
                {card.label}
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-1">
                {card.title}
              </h3>
              <p className="text-sm opacity-90 line-clamp-2">
                {card.subtitle}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/30">
              <p className="text-xs opacity-80">Featured Tool:</p>
              <p className="text-sm font-medium truncate group-hover:underline">
                {card.featuredToolName}
              </p>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
};

export default TinyWowCategoryCard;
