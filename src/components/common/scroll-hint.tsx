'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from './smooth-scroll-provider';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export function ScrollHint({
  className,
  scrollTo,
}: {
  className?: string;
  scrollTo: string;
}) {
  const lenis = useLenis();
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dots = gsap.utils.toArray<HTMLDivElement>('.scroll-dot', containerRef.current);
    if (!dots.length) return;

    gsap.set(dots, { opacity: 0, y: -10 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    tl.to(dots, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.2,
      ease: 'power2.out',
    }).to(dots, {
      opacity: 0,
      y: 10,
      duration: 0.4,
      stagger: 0.2,
      ease: 'power2.in',
    }, '+=0.5');

    return () => {
      tl.kill();
    }
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(scrollTo, {
        duration: 2,
        ease: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // easeOutExpo
      });
    } else {
      const targetElement = document.querySelector(scrollTo);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div className={cn('absolute bottom-8 left-1/2 z-30 -translate-x-1/2', className)}>
      <button
        ref={containerRef}
        onClick={handleClick}
        aria-label="Scroll to next section"
        className="group flex flex-col items-center gap-2 p-2 transition-opacity duration-300 hover:opacity-70"
      >
        <div className="scroll-dot h-1.5 w-1.5 rounded-full bg-muted-foreground transition-colors group-hover:bg-primary" />
        <div className="scroll-dot h-1.5 w-1.5 rounded-full bg-muted-foreground transition-colors group-hover:bg-primary" />
        <div className="scroll-dot h-1.5 w-1.5 rounded-full bg-muted-foreground transition-colors group-hover:bg-primary" />
      </button>
    </div>
  );
}
