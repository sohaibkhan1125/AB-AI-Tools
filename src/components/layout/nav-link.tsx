
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { HTMLProps } from 'react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react'; // Import hooks

interface NavLinkProps extends HTMLProps<HTMLAnchorElement> {
  href: string;
}

const NavLink = ({ href, children, className, ...props }: NavLinkProps) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate the actual active state
  const actualIsActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        'text-sm sm:text-base font-medium transition-colors hover:text-primary',
        // Apply active styles only if mounted and actually active.
        // Otherwise, default to inactive style for server render and initial client render.
        isMounted && actualIsActive ? 'text-primary' : 'text-foreground/80',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
