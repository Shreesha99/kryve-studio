'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';

function NotFoundBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const shapes = gsap.utils.toArray<SVGPathElement>('.morph-shape', svgRef.current);
    
    shapes.forEach((shape, index) => {
      const morphTarget = shape.getAttribute('data-morph-target');
      if (!morphTarget) return;
      
      const morphTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        delay: index * 1.5,
      });

      morphTl.to(shape, {
        attr: { d: morphTarget },
        duration: 8,
        ease: 'sine.inOut'
      });
      
      gsap.to(shape, {
        x: `random(-50, 50, true)`,
        y: `random(-50, 50, true)`,
        rotation: `random(-60, 60, true)`,
        transformOrigin: '50% 50%',
        duration: 20,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: index
      })
    });
    
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden opacity-5">
      <svg ref={svgRef} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <path
          className="morph-shape"
          transform="translate(200 150) scale(1.5)"
          fill="hsl(var(--primary))"
          d="M107.4,22.6C128.2,43.4,128.2,77.4,107.4,98.2C86.6,119,52.6,119,31.8,98.2C11,77.4,11,43.4,31.8,22.6C52.6,1.8,86.6,1.8,107.4,22.6Z"
          data-morph-target="M112.5,43.3C122.8,66.5,112.3,94,91.9,104.5C71.5,115,41.9,108.5,21.5,91.8C1.1,75.1,-9.4,48.5,10.9,31.8C31.3,15.1,61.9,8.5,82.3,18.8C102.7,29.1,102.1,19.9,112.5,43.3Z"
        />
        <path
          className="morph-shape"
          transform="translate(calc(100% - 200px), calc(100% - 150px)) scale(1.2)"
          fill="hsl(var(--primary))"
          d="M21,0 L79,0 L100,21 L100,79 L79,100 L21,100 L0,79 L0,21 Z"
          data-morph-target="M36.3,4.3L82.6,21.8L93.3,71.2L50.8,95.7L5.7,76.5L2.8,26.8L36.3,4.3Z"
        />
      </svg>
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
    </div>
  );
}
