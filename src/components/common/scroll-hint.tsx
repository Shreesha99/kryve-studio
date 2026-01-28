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
  const hintRef = useRef<HTMLButtonElement>(null);
  const wheelRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    // Animate the scroll wheel moving up and down
    gsap.to(wheel, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: 'power1.inOut',
    });
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
        ref={hintRef}
        onClick={handleClick}
        aria-label="Scroll to next section"
        className="group transition-opacity duration-300 hover:opacity-70"
      >
        <svg
          width="28"
          height="48"
          viewBox="0 0 28 48"
          className="stroke-current text-muted-foreground transition-colors duration-300 group-hover:text-primary"
        >
          <rect
            x="1"
            y="1"
            width="26"
            height="46"
            rx="13"
            strokeWidth="2"
            fill="none"
          />
          <rect
            ref={wheelRef}
            x="12"
            y="10"
            width="4"
            height="8"
            rx="2"
            fill="currentColor"
            className="fill-current"
          />
        </svg>
      </button>
    </div>
  );
}
