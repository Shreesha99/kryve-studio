'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AnimatedGradient } from './animated-gradient';

interface PreloaderProps {
  onAnimationComplete: () => void;
}

export function Preloader({ onAnimationComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // A short delay before calling the completion handler to ensure the fade-out is smooth
        setTimeout(onAnimationComplete, 300);
      },
    });

    gsap.set(preloaderRef.current, { perspective: 800 });
    gsap.set(logoRef.current, { opacity: 0, y: 50, rotationX: -90 });

    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 1.2,
      ease: 'power3.out',
    })
      .to(
        logoRef.current,
        {
          opacity: 0,
          y: -50,
          duration: 0.8,
          ease: 'power3.in',
        },
        '+=0.8'
      )
      .to(preloaderRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          if (preloaderRef.current) {
            preloaderRef.current.style.display = 'none';
          }
          onAnimationComplete();
        },
      });
  }, [onAnimationComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <h1
        ref={logoRef}
        className="animated-gradient bg-clip-text font-headline text-5xl font-bold tracking-widest text-transparent"
      >
        ELYSIUM
      </h1>
    </div>
  );
}
