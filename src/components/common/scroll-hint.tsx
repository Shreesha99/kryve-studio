'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { useLenis } from './smooth-scroll-provider';
import { Button } from '../ui/button';
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

  useEffect(() => {
    const hint = hintRef.current;
    if (!hint) return;

    // Gentle bobbing animation
    gsap.fromTo(hint,
      { y: -5 },
      {
        y: 5,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'sine.inOut'
      }
    );
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
    <div className={cn('absolute bottom-4 left-1/2 z-30 -translate-x-1/2', className)}>
      <Button
        ref={hintRef}
        variant="ghost"
        className="group rounded-full h-14 w-14"
        onClick={handleClick}
        aria-label="Scroll to next section"
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
      </Button>
    </div>
  );
}
