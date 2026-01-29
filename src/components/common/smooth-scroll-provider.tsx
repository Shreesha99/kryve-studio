'use client';

import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { type ReactNode, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

// New inner component to safely use the useLenis hook
function GsapLenisBridge() {
  // Use the useLenis hook with a callback for scroll events.
  // This is the official way to integrate with GSAP's ScrollTrigger.
  const lenis = useLenis(ScrollTrigger.update);

  useEffect(() => {
    // Sync GSAP ticker with Lenis's RAF (request animation frame)
    if (!lenis) return;

    const unsubscribe = gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      unsubscribe();
    };
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    // ReactLenis provides the context for the useLenis hook.
    <ReactLenis
      root
      autoRaf={false} // We are using GSAP's ticker, so we disable Lenis's internal RAF.
      options={{ lerp: 0.1, smoothTouch: true, smoothWheel: true }}
    >
      <GsapLenisBridge />
      {children}
    </ReactLenis>
  );
}

// Re-export useLenis so other components don't break.
export { useLenis };
