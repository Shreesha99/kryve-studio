import Image from 'next/image';
import { AboutImage } from '@/lib/placeholder-images';
import { AnimateOnScroll } from '../common/animate-on-scroll';

export function About() {
  return (
    <section id="about" className="w-full bg-secondary py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col justify-center space-y-6">
            <AnimateOnScroll>
              <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                We are Kryve, a digital studio that blends creativity with technology.
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay="200ms">
              <p className="text-lg text-muted-foreground">
                Our philosophy is simple: create digital experiences that are not only beautiful but also intuitive and effective. We are a team of designers, developers, and strategists passionate about pushing the boundaries of what's possible on the web.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay="400ms">
              <p className="text-lg text-muted-foreground">
                From brand identity to complex web applications, we approach every project with meticulous attention to detail and a commitment to excellence. We believe in collaboration, transparency, and building lasting partnerships with our clients.
              </p>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll className="flex items-center justify-center" delay="300ms">
             <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-2xl lg:h-96">
                <Image
                    src={AboutImage.imageUrl}
                    alt={AboutImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={AboutImage.imageHint}
                />
                <div className="absolute inset-0 bg-primary/30"></div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
