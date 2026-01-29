'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

interface AnimatedGradientProps {
  className?: string;
}

export function AnimatedGradient({ className }: AnimatedGradientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClientAndNotTouch, setIsClientAndNotTouch] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    // It checks if the device is not a touch device.
    setIsClientAndNotTouch(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    // Only proceed if we are on the client and it's not a touch device.
    if (!el || !isClientAndNotTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = document.body;
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
  }, [isClientAndNotTouch]);

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
