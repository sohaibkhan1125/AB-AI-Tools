'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { HTMLProps } from 'react';
import { cn } from '@/lib/utils';

interface NavLinkProps extends HTMLProps<HTMLAnchorElement> {
  href: string;
}

const NavLink = ({ href, children, className, ...props }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        'text-sm sm:text-base font-medium transition-colors hover:text-primary',
        isActive ? 'text-primary' : 'text-foreground/80',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
