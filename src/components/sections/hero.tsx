'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MorphingSvg } from '@/components/common/morphing-svg';
import { AnimatedGradient } from '../common/animated-gradient';
import { ScrollHint } from '@/components/common/scroll-hint';
import { Sparkles } from 'lucide-react';

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [isSvgReady, setIsSvgReady] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out', duration: 1.2 },
      delay: 1,
    });

    // Animate each line of the headline from a masked container
    const headlineSpans = gsap.utils.toArray('span', headlineRef.current);

    tl.fromTo(
      headlineSpans,
      { yPercent: 120 },
      { yPercent: 0, stagger: 0.1, duration: 1.2, ease: 'power3.out' }
    )
      .fromTo(
        paragraphRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.8'
      )
      .fromTo(
        buttonRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.8'
      )
      .fromTo(
        svgRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.94,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          onComplete: () => {
            setIsSvgReady(true);
          },
        },
        '-=0.9'
      )
      .fromTo(
        hintRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.5'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-background py-24 md:py-32 lg:py-0"
    >
      <AnimatedGradient className="opacity-20 dark:opacity-10" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="text-left">
            <h1
              ref={headlineRef}
              className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-7xl"
            >
              <div className="overflow-hidden py-1">
                <span className="inline-block">
                  Engineering{' '}
                  <span className="inline-block cursor-pointer rounded-full border border-foreground/50 px-4 py-1 transition-colors duration-300 ease-in-out hover:bg-foreground hover:text-background">
                    Elegance
                  </span>
                  .
                </span>
              </div>
              <div className="overflow-hidden py-1">
                <span className="inline-block">
                  Designing{' '}
                  <span className="inline-block cursor-pointer rounded-full border border-foreground/50 px-4 py-1 transition-colors duration-300 ease-in-out hover:bg-foreground hover:text-background">
                    Impact
                  </span>
                  .
                </span>
              </div>
            </h1>
            <p
              ref={paragraphRef}
              className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
            >
              We are a digital studio that blends visionary design with
              precision engineering to create web experiences that are not only
              beautiful, but brilliant. We partner with ambitious brands to
              transform complex challenges into elegant, impactful solutions
              that captivate users and drive results.
            </p>
            <div ref={buttonRef} className="mt-8">
              <Button size="lg" asChild>
                <Link href="#work">Explore Our Work</Link>
              </Button>
            </div>
            <div ref={hintRef} className="mt-6 opacity-0">
              <Button
                asChild
                variant="ghost"
                className="h-auto p-0 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
              >
                <Link href="/blog">
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                  <span>Psst! Check out our new AI tools on the blog.</span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div
              ref={svgRef}
              className="relative aspect-[4/3] w-full max-w-2xl justify-self-center overflow-hidden rounded-lg lg:max-w-none"
            >
              <MorphingSvg
                theme={resolvedTheme}
                isReadyToAnimate={isSvgReady}
              />
            </div>
          </div>
        </div>
      </div>
      <ScrollHint scrollTo="#about" />
    </section>
  );
}
