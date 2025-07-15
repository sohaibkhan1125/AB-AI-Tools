
import { TOOLS_DATA } from '@/lib/tools-data';
import ToolCard from '@/components/tool-card';
import { Type as TypeIcon } from 'lucide-react';

export default function AiWriteToolsPage() {
  const aiWriteTools = TOOLS_DATA.filter(
    (tool) => tool.functionalCategory === 'Text & AI Tools'
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-[hsl(var(--category-ai-write-bg-light-hsl))] p-4 rounded-full mx-auto mb-4">
            <TypeIcon className="h-12 w-12 text-[hsl(var(--category-ai-write-text-hsl))]" />
        </div>
        <h1 className="text-4xl font-bold font-headline">AI Write Tools</h1>
        <p className="text-lg text-muted-foreground mt-2">
          A complete suite of tools to help you write and analyze text.
        </p>
      </div>
      
      {aiWriteTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {aiWriteTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No AI Write tools are available at the moment.
        </p>
      )}
    </div>
  );
}
