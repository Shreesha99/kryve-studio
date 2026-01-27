'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onAnimationComplete: () => void;
}

export function Preloader({ onAnimationComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (preloaderRef.current) {
            gsap.to(preloaderRef.current, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    if (preloaderRef.current) {
                        preloaderRef.current.style.display = 'none';
                    }
                    onAnimationComplete();
                }
            });
        }
      },
    });

    gsap.set(preloaderRef.current, { perspective: 800 });
    gsap.set(logoRef.current, { opacity: 0, y: 30 });
    if(progressBarRef.current) {
      gsap.set(progressBarRef.current, { scaleX: 0 });
    }

    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out',
    }, 0.5)
      .to(progressBarRef.current, {
          scaleX: 1,
          duration: 1.5,
          ease: 'power2.inOut'
      }, "<0.2");
  }, [onAnimationComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <h1
        ref={logoRef}
        className="font-headline text-5xl font-bold tracking-widest text-foreground"
      >
        ELYSIUM
      </h1>
      <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-muted">
        <div ref={progressBarRef} className="h-full w-full origin-left bg-primary" />
      </div>
    </div>
  );
}
