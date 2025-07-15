
import { TOOLS_DATA } from '@/lib/tools-data';
import ToolCard from '@/components/tool-card';
import { FileText } from 'lucide-react';

export default function PdfToolsPage() {
  const pdfTools = TOOLS_DATA.filter(
    (tool) => tool.functionalCategory === 'PDF Tools'
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-[hsl(var(--category-pdf-bg-light-hsl))] p-4 rounded-full mx-auto mb-4">
            <FileText className="h-12 w-12 text-[hsl(var(--category-pdf-text-hsl))]" />
        </div>
        <h1 className="text-4xl font-bold font-headline">PDF Tools</h1>
        <p className="text-lg text-muted-foreground mt-2">
          A complete suite of tools to manage and manipulate your PDF files.
        </p>
      </div>
      
      {pdfTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No PDF tools are available at the moment.
        </p>
      )}
    </div>
  );
}
