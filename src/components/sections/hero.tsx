'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeroImage } from '@/lib/placeholder-images';

export function Hero() {
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!leftColRef.current || !rightColRef.current) return;
    
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    tl.fromTo(leftColRef.current.children, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2 }
    )
    .fromTo(rightColRef.current, 
      { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }, 
      { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4 }, 
      "-=1"
    );
  }, []);

  return (
    <section id="home" className="flex min-h-screen w-full items-center bg-secondary py-24 md:py-32 lg:py-0">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div ref={leftColRef} className="text-left">
            <h1 className="font-headline text-5xl font-semibold tracking-tighter sm:text-6xl md:text-7xl">
              Design is Feeling, Made Visual.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              We don't just build websites; we craft digital spaces where artistry and engineering converge. We believe the best experiences are born from a partnership that values both pixels and performance.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="#work">Explore Our Work</Link>
              </Button>
            </div>
          </div>
          <div ref={rightColRef} className="relative aspect-[4/5] w-full max-w-md justify-self-center lg:max-w-none">
             <Image
                src={HeroImage.imageUrl}
                alt={HeroImage.description}
                fill
                className="rounded-lg object-cover shadow-2xl"
                data-ai-hint={HeroImage.imageHint}
                priority
              />
          </div>
        </div>
      </div>
    </section>
  );
}
