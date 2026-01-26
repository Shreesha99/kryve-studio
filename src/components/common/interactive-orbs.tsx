'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

// Individual Orb component
const Orb = ({ className, sizeClass }: { className?: string; sizeClass?: string }) => {
  const orbRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return; // Don't run animations until mounted and theme is resolved

    const orb = orbRef.current;
    if (!orb) return;

    // Set initial position
    gsap.set(orb, { x: 'random(-5, 5)', y: 'random(-5, 5)' });

    // Ambient floating animation
    const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatTl
      .to(orb, {
        x: 'random(-20, 20)',
        y: 'random(-20, 20)',
        duration: 'random(5, 8)',
        ease: 'sine.inOut',
      })
      .to(
        orb,
        {
          rotation: 'random(-45, 45)',
          duration: 'random(6, 9)',
          ease: 'sine.inOut',
        },
        0
      );

    // Hover interaction
    let hoverTl: gsap.core.Timeline;
    const onMouseEnter = () => {
      hoverTl = gsap.timeline();
      hoverTl.to(orb, {
        scale: 1.4,
        duration: 0.4,
        ease: 'power3.out',
      });
    };

    const onMouseLeave = () => {
      hoverTl?.reverse();
    };

    orb.addEventListener('mouseenter', onMouseEnter);
    orb.addEventListener('mouseleave', onMouseLeave);

    return () => {
      floatTl.kill();
      if (hoverTl) hoverTl.kill();
      if (orb) {
        orb.removeEventListener('mouseenter', onMouseEnter);
        orb.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <svg
      ref={orbRef}
      viewBox="0 0 100 100"
      className={cn('absolute', sizeClass, className)}
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="50"
        fill={`hsl(${
          resolvedTheme === 'dark' ? '0 0% 98%' : '240 5.9% 10%'
        })`}
        fillOpacity="0.1"
      />
    </svg>
  );
};

// Container for all orbs
export function InteractiveOrbs() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <Orb className="top-[15%] left-[5%]" sizeClass="w-16 h-16" />
      <Orb
        className="top-[60%] left-[25%] hidden sm:block"
        sizeClass="w-12 h-12"
      />
      <Orb className="top-[25%] right-[10%]" sizeClass="w-20 h-20" />
      <Orb
        className="bottom-[15%] right-[20%] hidden md:block"
        sizeClass="w-14 h-14"
      />
      <Orb className="bottom-[5%] left-[45%]" sizeClass="w-8 h-8" />
    </div>
  );
}
