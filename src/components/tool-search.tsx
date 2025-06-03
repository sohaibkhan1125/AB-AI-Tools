'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ToolSearchProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

const ToolSearch = ({ onSearchChange, placeholder = "Search tools..." }: ToolSearchProps) => {
  return (
    <div className="relative mb-8 sm:mb-12 max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 text-base rounded-md shadow-sm focus:ring-2 focus:ring-primary"
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search tools"
      />
    </div>
  );
};

export default ToolSearch;
