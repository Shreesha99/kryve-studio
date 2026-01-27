'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.2,
      defaults: { ease: 'power3.out' },
    });

    if (titleRef.current && paragraphRef.current && buttonRef.current) {
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
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 text-center">
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
            Oops! This page must have been abducted by aliens. Let's beam you back to safety.
          </p>
          <div ref={buttonRef} className="mt-8">
            <Button asChild size="lg">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
