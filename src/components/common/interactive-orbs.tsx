'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';

export function InteractiveOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const orbs = gsap.utils.toArray<HTMLDivElement>('.orb', container);

    const onMouseMove = (e: MouseEvent) => {
        gsap.to(orbs, {
            x: e.clientX,
            y: e.clientY,
            stagger: {
              each: 0.05,
              from: "start"
            },
            overwrite: 'auto',
            duration: 1.5,
            ease: 'power3.out',
        });
    };
    
    gsap.set(orbs, { 
        xPercent: -50,
        yPercent: -50,
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2,
        scale: () => Math.random() * 0.5 + 0.5,
        opacity: 0,
    });
    
    gsap.to(orbs, {
        x: () => Math.random() * window.innerWidth,
        y: () => Math.random() * window.innerHeight,
        opacity: 0.1,
        duration: 2,
        ease: 'power2.out',
        stagger: 0.1
    });

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const orbColor = resolvedTheme === 'dark' ? 'hsl(0 0% 98%)' : 'hsl(240 5.9% 10%)';

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="orb absolute h-24 w-24 rounded-full"
          style={{ 
            backgroundColor: orbColor,
            willChange: 'transform'
          }}
        />
      ))}
    </div>
  );
}
