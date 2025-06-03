import { Wrench } from 'lucide-react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Wrench className="h-7 w-7 sm:h-8 sm:w-8" />
      <span className="text-xl sm:text-2xl font-semibold font-headline">Tool Hub</span>
    </Link>
  );
};

export default Logo;
