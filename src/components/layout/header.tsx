
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Menu, X, Search as SearchIconLucide, Moon, ChevronDown, Share2 } from 'lucide-react';
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
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HEADER_DROPDOWN_CATEGORIES, TOOLS_DATA } from '@/lib/tools-data';
import type { Tool } from '@/types/tool';

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
  
  const groupedToolsForMobile = useMemo(() => {
    return TOOLS_DATA.reduce((acc, tool) => {
      const category = tool.headerCategory || 'Other'; 
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {} as GroupedTools);
  }, []);

  // Define the order for mobile menu categories if needed, or use Object.keys(groupedToolsForMobile)
  const mobileMenuAccordionCategories: Array<Tool['headerCategory'] | 'Other'> = ['PDF', 'Image', 'Write', 'Video', 'File', 'Other'];


  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}#popular-tools-section`;
      if(isMobileMenuOpen) setIsMobileMenuOpen(false);
    }
  };

  if (!isMounted) {
    // Simplified skeleton or null during SSR/hydration mismatch prevention
    return (
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-[70px] flex items-center justify-between">
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
    <header className="bg-card border-b border-border/80 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-[70px] flex items-center justify-between gap-4">
        <Logo />

        {/* Desktop Centered Navigation with Dropdowns */}
        <nav className="hidden md:flex items-center gap-1">
          {HEADER_DROPDOWN_CATEGORIES.map((category) => (
            <DropdownMenu key={category.name}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-foreground/80 hover:text-primary px-3 py-2">
                  {category.name} <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>{category.name} Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {category.tools.slice(0, 7).map((tool) => ( 
                  <DropdownMenuItem key={tool.id} asChild>
                    <Link href={tool.href} className="flex items-center gap-2 text-sm">
                      <tool.icon className="h-4 w-4 text-muted-foreground" />
                      {tool.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {category.tools.length > 7 && (
                   <DropdownMenuItem asChild>
                     <Link href={`/#popular-tools-section?filter=${category.name}`} className="text-primary text-sm font-medium hover:underline p-2 text-center block">
                       View all {category.name.toLowerCase()} tools...
                     </Link>
                   </DropdownMenuItem>
                )}
                 {category.tools.length === 0 && category.name !== 'Video' && ( // Show "No tools" except for Video for now
                   <DropdownMenuItem disabled className="text-sm text-muted-foreground p-2">No tools yet</DropdownMenuItem>
                 )}
                  {category.name === 'Video' && category.tools.length === 0 && (
                     <DropdownMenuItem disabled className="text-sm text-muted-foreground p-2">Video tools coming soon!</DropdownMenuItem>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>

        {/* Desktop Right side elements */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Toggle theme (visual only)">
            <Moon className="h-5 w-5 text-foreground/70 hover:text-primary" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Share">
            <Share2 className="h-5 w-5 text-foreground/70 hover:text-primary" />
          </Button>
          <form onSubmit={handleSearchSubmit} className="relative w-48">
            <SearchIconLucide className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 h-9 rounded-md bg-secondary text-sm focus:bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4">
            <Link href="/">Sign In</Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-2">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0 flex flex-col bg-card">
              <SheetHeader className="p-4 border-b">
                 <div className="flex justify-between items-center">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} passHref>
                      <Logo />
                    </Link>
                   <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                         <X className="h-6 w-6" />
                         <span className="sr-only">Close menu</span>
                       </Button>
                   </SheetClose>
                 </div>
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
                  {mobileMenuAccordionCategories.map((categoryKey) => {
                    const categoryTools = groupedToolsForMobile[categoryKey] || [];
                    if (categoryTools.length === 0 && categoryKey !== 'Video') return null; 

                    return (
                      <AccordionItem value={categoryKey || 'other'} key={categoryKey || 'other'}>
                        <AccordionTrigger className="text-base hover:no-underline py-3">
                          <span className="flex items-center">
                            {categoryKey} Tools
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-0">
                          <div className="flex flex-col gap-1 pl-4">
                            {categoryTools.length > 0 ? (
                              categoryTools.slice(0,10).map((tool) => (
                                <SheetClose asChild key={tool.id}>
                                  <NavLink
                                    href={tool.href}
                                    className="py-2 text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
                                  >
                                    <tool.icon className="h-4 w-4" />
                                    {tool.name}
                                  </NavLink>
                                </SheetClose>
                              ))
                            ) : (
                              <p className="py-2 text-sm text-muted-foreground italic">
                                {categoryKey === 'Video' ? "Video tools coming soon!" : "No tools yet."}
                              </p>
                            )}
                             {categoryTools.length > 10 && (
                               <SheetClose asChild>
                                <NavLink href={`/#popular-tools-section?filter=${categoryKey}`}
                                  className="py-2 text-sm text-primary font-medium hover:underline"
                                  >
                                  View all {categoryKey} tools...
                                </NavLink>
                              </SheetClose>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
                <div className="mt-6 pt-6 border-t space-y-1">
                    <SheetClose asChild>
                        <NavLink href="/" className="block py-2.5 px-2 text-base hover:bg-accent rounded-md">
                           Sign In
                        </NavLink>
                    </SheetClose>
                    <div className="flex items-center gap-2 py-2.5 px-2 text-base text-foreground/80 hover:bg-accent rounded-md cursor-pointer" aria-label="Toggle theme (visual only)">
                        <Moon className="h-5 w-5" /> Theme
                    </div>
                    <div className="flex items-center gap-2 py-2.5 px-2 text-base text-foreground/80 hover:bg-accent rounded-md cursor-pointer" aria-label="Share">
                        <Share2 className="h-5 w-5" /> Share
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
