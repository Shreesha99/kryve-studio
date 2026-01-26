'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroContent() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      const headline = heroRef.current.querySelector('h1');
      const paragraph = heroRef.current.querySelector('p');
      const buttonWrapper = heroRef.current.querySelector('.button-wrapper');

      gsap.set([headline, paragraph, buttonWrapper], { opacity: 0, y: 30 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(headline, { opacity: 1, y: 0, duration: 1 })
        .to(paragraph, { opacity: 1, y: 0, duration: 1 }, '-=0.7')
        .to(buttonWrapper, { opacity: 1, y: 0, duration: 0.8 }, '-=0.7');
    }
  }, []);

  return (
    <div ref={heroRef} className="mx-auto max-w-4xl text-center">
      <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
        A Partnership in Pixels & Performance.
      </h1>
      <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
        Kryve is a founder-led studio obsessed with creating unified digital
        experiences. We bridge the gap between design and development, ensuring
        artistry and engineering perform in perfect harmony to bring your
        vision to life.
      </p>
      <div className="button-wrapper mt-8">
        <Button size="lg" asChild>
          <Link href="#work">Our Work</Link>
        </Button>
      </div>
    </div>
  );
}
