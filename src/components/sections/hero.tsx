import { AnimateOnScroll } from '../common/animate-on-scroll';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section id="home" className="relative w-full overflow-hidden py-32 md:py-48 lg:py-64">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <AnimateOnScroll>
            <h1 className="font-headline text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl">
              A Partnership in Pixels & Performance.
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay="200ms">
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
              Kryve isn't just another digital studio. We are a founder-led team—a designer and a developer—obsessed with creating unified digital experiences where artistry and engineering perform in perfect harmony.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay="400ms" className="mt-8">
            <Button size="lg" asChild>
              <Link href="#work">Our Work</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
