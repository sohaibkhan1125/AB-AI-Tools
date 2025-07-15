
import { TOOLS_DATA } from '@/lib/tools-data';
import ToolCard from '@/components/tool-card';
import { Image as ImageIconLucide } from 'lucide-react';

export default function ImageToolsPage() {
  const imageTools = TOOLS_DATA.filter(
    (tool) => tool.functionalCategory === 'Image Tools'
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-[hsl(var(--category-image-bg-light-hsl))] p-4 rounded-full mx-auto mb-4">
            <ImageIconLucide className="h-12 w-12 text-[hsl(var(--category-image-text-hsl))]" />
        </div>
        <h1 className="text-4xl font-bold font-headline">Image Tools</h1>
        <p className="text-lg text-muted-foreground mt-2">
          A complete suite of tools to edit, convert, and generate images.
        </p>
      </div>
      
      {imageTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {imageTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No Image tools are available at the moment.
        </p>
      )}
    </div>
  );
}
