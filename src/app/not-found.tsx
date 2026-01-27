'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { Button } from '@/components/ui/button';

function NotFoundBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = gsap.utils.toArray<HTMLDivElement>(
      '.floating-element',
      container
    );

    elements.forEach((el) => {
      gsap.to(el, {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        scale: 'random(0.8, 1.2)',
        opacity: 'random(0.5, 1)',
        duration: 'random(10, 20)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
    >
      <div className="absolute -left-10 top-1/4 h-24 w-24 rounded-full bg-primary/5 floating-element" />
      <div className="absolute -right-10 bottom-1/4 h-32 w-32 rounded-full bg-primary/5 floating-element" />
      <div className="absolute left-1/3 top-1/3 h-16 w-16 rounded-full bg-primary/5 floating-element" />
    </div>
  );
}

export default function NotFound() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.2,
      defaults: { ease: 'power3.out' },
    });

    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0, scale: 1.1 },
      { y: 0, opacity: 1, scale: 1, duration: 1 }
    )
      .fromTo(
        paragraphRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.7'
      )
      .fromTo(
        buttonRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.7'
      );
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 text-center">
        <NotFoundBackground />
        <div className="relative z-10">
          <h1
            ref={titleRef}
            className="font-headline text-8xl font-bold tracking-tighter text-primary sm:text-9xl md:text-[10rem] lg:text-[12rem]"
          >
            404
          </h1>
          <p
            ref={paragraphRef}
            className="mt-4 text-lg text-muted-foreground md:text-xl"
          >
            Oops! The page you are looking for has been lost in space.
          </p>
          <div ref={buttonRef} className="mt-8">
            <Button asChild size="lg">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
