
import { TOOLS_DATA } from '@/lib/tools-data';
import ToolCard from '@/components/tool-card';
import { Folder } from 'lucide-react';

export default function FileToolsPage() {
  const fileTools = TOOLS_DATA.filter(
    (tool) => tool.functionalCategory === 'File Management' || tool.functionalCategory === 'Data Converters'
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-[hsl(var(--category-file-bg-light-hsl))] p-4 rounded-full mx-auto mb-4">
            <Folder className="h-12 w-12 text-[hsl(var(--category-file-text-hsl))]" />
        </div>
        <h1 className="text-4xl font-bold font-headline">File Tools</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage and convert your data files with ease.
        </p>
      </div>
      
      {fileTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fileTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No File tools are available at the moment.
        </p>
      )}
    </div>
  );
}
