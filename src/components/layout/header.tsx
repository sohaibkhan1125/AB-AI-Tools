
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Menu, X, Search as SearchIconLucide, Sun, ChevronDown } from 'lucide-react'; // Renamed Search to avoid conflict
import Link from 'next/link';
import Logo from './logo';
import NavLink from './nav-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TOOLS_DATA, HEADER_CATEGORY_ORDER as importedHeaderCategories } from '@/lib/tools-data';
import type { Tool, ToolCategory } from '@/types/tool';

interface GroupedTools {
  [category: string]: Tool[];
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const groupedTools = useMemo(() => {
    return TOOLS_DATA.reduce((acc, tool) => {
      const category = tool.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {} as GroupedTools);
  }, []);
  
  // Use importedHeaderCategories directly
  const headerCategoriesForMobile = useMemo(() => {
    return importedHeaderCategories.filter(categoryName => groupedTools[categoryName] && groupedTools[categoryName].length > 0);
  }, [groupedTools]);


  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now, this will just log or you can redirect to a search results page if you build one
      // Or, if on homepage, it could trigger a filter. Since this is a global header,
      // a redirect or dedicated search page is more appropriate.
      // Let's link to the homepage tools section for now.
      window.location.href = `/#tools-section?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };


  if (!isMounted) {
    // Basic skeleton or simplified header for SSR/initial mount
    return (
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Logo />
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>
    );
  }


  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Logo />

        {/* Desktop: Centered Search Bar */}
        <div className="hidden md:flex flex-grow justify-center items-center max-w-xl">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <SearchIconLucide className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="w-full pl-10 pr-4 py-2 rounded-md shadow-sm bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Desktop: Right side elements */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-label="Toggle theme (visual only)">
            <Sun className="h-5 w-5" />
          </Button>
          <Button variant="default" asChild>
            <Link href="/">Sign In</Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0 flex flex-col bg-card">
              <SheetHeader className="p-4 border-b">
                <SheetTitle asChild>
                   <div className="flex justify-between items-center">
                     <div onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer">
                        <Logo />
                     </div>
                     <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                           <X className="h-6 w-6" />
                           <span className="sr-only">Close menu</span>
                         </Button>
                     </SheetClose>
                   </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto p-4">
                 <form onSubmit={handleSearchSubmit} className="w-full relative mb-4">
                    <SearchIconLucide className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search tools..."
                      className="w-full pl-10 pr-4 py-2 rounded-md shadow-sm bg-background"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                <Accordion type="multiple" className="w-full">
                  {headerCategoriesForMobile.map((categoryName) => (
                    <AccordionItem value={categoryName} key={categoryName}>
                      <AccordionTrigger className="text-base hover:no-underline py-3">
                        <span className="flex items-center">
                          {categoryName}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-0">
                        <div className="flex flex-col gap-1 pl-4">
                          {groupedTools[categoryName]?.length > 0 ? (
                            groupedTools[categoryName]?.map((tool) => (
                              <SheetClose key={tool.id} asChild>
                                <NavLink
                                  href={tool.href}
                                  className="py-2 text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <tool.icon className="h-4 w-4" />
                                  {tool.name}
                                </NavLink>
                              </SheetClose>
                            ))
                          ) : (
                            <p className="py-2 text-sm text-muted-foreground italic">No tools yet.</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-6 pt-6 border-t space-y-2">
                     <SheetClose asChild>
                        <NavLink href="/" className="block py-2 px-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                           Sign In
                        </NavLink>
                    </SheetClose>
                    <div className="flex items-center gap-2 py-2 px-2 text-base text-foreground/80 cursor-pointer" aria-label="Toggle theme (visual only)">
                        <Sun className="h-5 w-5" /> Theme (Visual)
                    </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
