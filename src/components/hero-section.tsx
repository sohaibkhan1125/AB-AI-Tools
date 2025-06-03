import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 sm:py-24 rounded-lg shadow-md mb-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline text-primary mb-6">
          Welcome to Tool Hub
        </h1>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
          Your one-stop destination for handy online utilities. Boost your productivity with our collection of simple and effective tools.
        </p>
        <div className="relative aspect-video max-w-4xl mx-auto mb-8 rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="https://placehold.co/1200x675.png" 
              alt="Abstract representation of tools and technology"
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint="tools technology"
            />
        </div>
        <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="#tools-section">Explore Tools</Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
