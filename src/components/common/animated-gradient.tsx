'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

interface AnimatedGradientProps {
  className?: string;
}

export function AnimatedGradient({ className }: AnimatedGradientProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Don't run on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = document.body; // Use body for more consistent coords
      gsap.to(el, {
        '--mouse-x': `${(clientX / offsetWidth) * 100}%`,
        '--mouse-y': `${(clientY / offsetHeight) * 100}%`,
        duration: 0.8,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'animated-gradient pointer-events-none absolute inset-0 z-0',
        className
      )}
    />
  );
}
