
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import type { ToolCategory } from '@/types/tool'; // Assuming ToolCategory type exists
import { Card, CardContent } from '@/components/ui/card'; // Card and CardContent used, CardHeader/Title/Description/Footer are not for this compact design

interface PopularToolCardProps {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  displayCategory: ToolCategory; // Category text to display on the card
}

const PopularToolCard = ({ name, description, href, icon: Icon, displayCategory }: PopularToolCardProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <a className="block h-full group">
        <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 ease-in-out border border-border hover:border-primary/50 group-hover:scale-[1.02]">
          <CardContent className="p-4 sm:p-5 flex flex-col items-start flex-grow">
            <div className="flex items-center w-full mb-2">
              <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg mr-3 sm:mr-4">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-grow">
                <p className="text-xs sm:text-sm font-medium text-primary/80 mb-0.5">{displayCategory}</p>
                <h3 className="text-base sm:text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  {name}
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed mt-1">
              {description}
            </p>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
};

export default PopularToolCard;
