
import Link from 'next/link';
import type { TinyWowCategoryCardData, TinyWowCategoryKey } from '@/types/tool';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TinyWowCategoryCardProps {
  card: TinyWowCategoryCardData;
}

const getCategoryStyleClasses = (categoryKey: TinyWowCategoryKey) => {
  // Tailwind classes cannot be fully dynamically constructed with string interpolation for HSL variables.
  // We must map the key to the full class string.
  switch (categoryKey) {
    case 'pdf':
      return {
        pastelBg: 'bg-[hsl(var(--category-pdf-pastel-bg-hsl))]',
        pastelHoverBg: 'hover:bg-[hsl(var(--category-pdf-pastel-bg-hover-hsl))]',
        vibrantText: 'text-[hsl(var(--category-pdf-main-hsl))]',
        vibrantIconBg: 'bg-[hsl(var(--category-pdf-main-hsl))]',
      };
    case 'image':
      return {
        pastelBg: 'bg-[hsl(var(--category-image-pastel-bg-hsl))]',
        pastelHoverBg: 'hover:bg-[hsl(var(--category-image-pastel-bg-hover-hsl))]',
        vibrantText: 'text-[hsl(var(--category-image-main-hsl))]',
        vibrantIconBg: 'bg-[hsl(var(--category-image-main-hsl))]',
      };
    case 'video':
      return {
        pastelBg: 'bg-[hsl(var(--category-video-pastel-bg-hsl))]',
        pastelHoverBg: 'hover:bg-[hsl(var(--category-video-pastel-bg-hover-hsl))]',
        vibrantText: 'text-[hsl(var(--category-video-main-hsl))]',
        vibrantIconBg: 'bg-[hsl(var(--category-video-main-hsl))]',
      };
    case 'ai-write':
      return {
        pastelBg: 'bg-[hsl(var(--category-ai-write-pastel-bg-hsl))]',
        pastelHoverBg: 'hover:bg-[hsl(var(--category-ai-write-pastel-bg-hover-hsl))]',
        vibrantText: 'text-[hsl(var(--category-ai-write-main-hsl))]',
        vibrantIconBg: 'bg-[hsl(var(--category-ai-write-main-hsl))]',
      };
    case 'file':
      return {
        pastelBg: 'bg-[hsl(var(--category-file-pastel-bg-hsl))]',
        pastelHoverBg: 'hover:bg-[hsl(var(--category-file-pastel-bg-hover-hsl))]',
        vibrantText: 'text-[hsl(var(--category-file-main-hsl))]',
        vibrantIconBg: 'bg-[hsl(var(--category-file-main-hsl))]',
      };
    default: // Fallback to 'other' or a default style
      return {
        pastelBg: 'bg-[hsl(var(--category-other-pastel-bg-hsl))]',
        pastelHoverBg: 'hover:bg-[hsl(var(--category-other-pastel-bg-hover-hsl))]',
        vibrantText: 'text-[hsl(var(--category-other-main-hsl))]',
        vibrantIconBg: 'bg-[hsl(var(--category-other-main-hsl))]',
      };
  }
};


const TinyWowCategoryCard = ({ card }: TinyWowCategoryCardProps) => {
  const IconComponent = card.icon;
  const styles = getCategoryStyleClasses(card.categoryKey);

  return (
    <Link href={card.href} passHref legacyBehavior>
      <a className="block group h-full">
        <Card className={cn(
          "h-full rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out overflow-hidden flex flex-col",
          styles.pastelBg,
          styles.pastelHoverBg 
        )}>
          <CardContent className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-3">
              <div className={cn(
                "p-2 rounded-md",
                styles.vibrantIconBg, // Vibrant background for icon
                'bg-opacity-20' // Make it a tint
              )}>
                <IconComponent className={cn("h-6 w-6", styles.vibrantText)} />
              </div>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                styles.vibrantText, // Vibrant text for label
                styles.vibrantIconBg, // Use icon bg for label background too
                'bg-opacity-10 dark:bg-opacity-20' // Lighter tint for label background
                )}>
                {card.label}
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-1 text-slate-800 dark:text-slate-100">
                {card.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                {card.subtitle}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[hsl(var(--border))] dark:border-opacity-30">
              <p className="text-xs text-slate-500 dark:text-slate-400">Featured Tool:</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate group-hover:underline">
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
