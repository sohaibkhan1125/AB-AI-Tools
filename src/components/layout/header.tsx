
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Menu, X, Search as SearchIcon, Sun, Check, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Logo from './logo';
import NavLink from './nav-link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TOOLS_DATA } from '@/lib/tools-data';
import type { Tool, ToolCategory } from '@/types/tool';

interface GroupedTools {
  [category: string]: Tool[];
}

// Define the order of categories for display
const CATEGORY_ORDER: ToolCategory[] = [
  'PDF Tools',
  'Image Tools',
  'Text & AI Tools',
  'Data Converters',
  'Calculators',
  'File Management',
  'Web Utilities',
];

// Categories to feature with a checkmark
const FEATURED_CATEGORIES: ToolCategory[] = [
  'PDF Tools',
  'Text & AI Tools',
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

  const sortedCategories = useMemo(() => {
    return CATEGORY_ORDER.filter(categoryName => groupedTools[categoryName]);
  }, [groupedTools]);


  if (!isMounted) {
    // Render a simplified version or null during server render and initial client render
    // to avoid hydration mismatches with dropdowns/sheet if they depend on client-side state for open/close
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
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-0 flex-grow justify-start pl-4">
          {sortedCategories.map((categoryName) => (
            <DropdownMenu key={categoryName}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2 lg:px-3 text-sm">
                  {categoryName}
                  {FEATURED_CATEGORIES.includes(categoryName as ToolCategory) && (
                    <Check className="ml-1 h-4 w-4 text-green-500" />
                  )}
                  <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 max-h-96 overflow-y-auto">
                {groupedTools[categoryName]?.map((tool) => (
                  <DropdownMenuItem key={tool.id} asChild>
                    <Link href={tool.href} className="flex items-center gap-2">
                      <tool.icon className="h-4 w-4 text-muted-foreground" />
                      {tool.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>

        {/* Desktop Right Links & Icons */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="link" asChild className="text-xs px-2 text-foreground/70 hover:text-primary">
            <Link href="/contact">Want To Remove Ads & Captcha?</Link>
          </Button>
          <Button variant="link" asChild className="text-sm px-2">
            <Link href="/contact">Support Us</Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Toggle theme (visual only)">
            <Sun className="h-5 w-5" />
          </Button>
           <Button variant="ghost" size="icon" asChild>
            <Link href="/#tools-section" aria-label="Search tools">
              <SearchIcon className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="text-sm px-3 py-1 h-auto">
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
                <Accordion type="multiple" className="w-full">
                  {sortedCategories.map((categoryName) => (
                    <AccordionItem value={categoryName} key={categoryName}>
                      <AccordionTrigger className="text-base hover:no-underline py-3">
                        <span className="flex items-center">
                          {categoryName}
                          {FEATURED_CATEGORIES.includes(categoryName as ToolCategory) && (
                            <Check className="ml-2 h-4 w-4 text-green-500" />
                          )}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-0">
                        <div className="flex flex-col gap-1 pl-4">
                          {groupedTools[categoryName]?.map((tool) => (
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
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-6 pt-6 border-t space-y-2">
                    <SheetClose asChild>
                        <NavLink href="/#tools-section" className="flex items-center gap-2 py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                            <SearchIcon className="h-5 w-5" /> Search Tools
                        </NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                        <NavLink href="/contact" className="block py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                           Want To Remove Ads & Captcha?
                        </NavLink>
                    </SheetClose>
                     <SheetClose asChild>
                        <NavLink href="/contact" className="block py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                           Support Us
                        </NavLink>
                    </SheetClose>
                     <SheetClose asChild>
                        <NavLink href="/" className="block py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                           Sign In
                        </NavLink>
                    </SheetClose>
                    <div className="flex items-center gap-2 py-2 text-base text-foreground/80 cursor-pointer" aria-label="Toggle theme (visual only)">
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
