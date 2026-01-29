'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { type ReactNode, useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { gsap } from 'gsap';
import type Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // Sync ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker
    const unsubscribe = gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      unsubscribe();
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      autoRaf={false}
      options={{ lerp: 0.1, smoothTouch: true, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
}

// Re-export useLenis so other components don't break
export { useLenis } from '@studio-freight/react-lenis';
