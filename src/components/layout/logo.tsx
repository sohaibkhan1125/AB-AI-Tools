import { Wrench } from 'lucide-react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <div className="bg-primary text-primary-foreground rounded-full p-1.5">
        <Wrench className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <span className="text-xl sm:text-2xl font-bold font-headline">
        <span className="text-foreground">Tiny</span><span className="text-primary">Wow</span>
      </span>
    </Link>
  );
};

export default Logo;
