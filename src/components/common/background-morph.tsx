'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from 'next-themes';

export function BackgroundMorph() {
  const pathRef = useRef<SVGPathElement>(null);
  const stop1Ref = useRef<SVGStopElement>(null);
  const stop2Ref = useRef<SVGStopElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Wait until the theme is resolved and refs are attached to avoid race conditions
    if (!resolvedTheme || !stop1Ref.current || !stop2Ref.current) {
      return;
    }

    const themeColors = {
      light: {
        stop1: 'hsl(var(--primary) / 0.08)',
        stop2: 'hsl(var(--primary) / 0.01)',
      },
      dark: {
        stop1: 'hsl(var(--primary) / 0.12)',
        stop2: 'hsl(var(--primary) / 0.02)',
      },
    };

    const colors = resolvedTheme === 'dark' ? themeColors.dark : themeColors.light;
    const stop1 = stop1Ref.current;
    const stop2 = stop2Ref.current;
    
    gsap.killTweensOf([stop1, stop2]); // Prevent overlapping tweens on theme change

    gsap.to(stop1, { attr: { 'stop-color': colors.stop1 }, duration: 0.5 });
    gsap.to(stop2, { attr: { 'stop-color': colors.stop2 }, duration: 0.5 });

    const points = [
      { x: 400, y: 100 },
      { x: 700, y: 200 },
      { x: 500, y: 500 },
      { x: 200, y: 400 },
    ];

    const path = pathRef.current;
    if (!path) return;

    const tension = 0.4;
    
    function createPath(points: { x: number, y: number }[]) {
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length; i++) {
            const p0 = points[i > 0 ? i - 1 : points.length - 1];
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            const p3 = points[(i + 2) % points.length];

            const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
            const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
            const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
            const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return d;
    }

    const updatePath = () => {
        if (path) {
            gsap.set(path, { attr: { d: createPath(points) } });
        }
    };
    
    gsap.set(path, { attr: { d: createPath(points) } });

    points.forEach(point => {
        gsap.to(point, {
            x: '+=random(-150, 150)',
            y: '+=random(-150, 150)',
            duration: 'random(8, 12)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            onUpdate: updatePath,
        });
    });

    return () => {
      gsap.killTweensOf(points);
      if (stop1Ref.current && stop2Ref.current) {
          gsap.killTweensOf([stop1Ref.current, stop2Ref.current]);
      }
    };

  }, [resolvedTheme]);

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id="morph-gradient" cx="50%" cy="50%" r="50%">
          <stop ref={stop1Ref} id="grad-stop-1" offset="0%" stopColor="transparent" />
          <stop ref={stop2Ref} id="grad-stop-2" offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <path ref={pathRef} fill="url(#morph-gradient)" />
    </svg>
  );
}
