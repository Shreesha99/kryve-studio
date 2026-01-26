'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const sunRef = React.useRef<HTMLSpanElement>(null);
  const moonRef = React.useRef<HTMLSpanElement>(null);
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useLayoutEffect(() => {
    if (!mounted) return;

    const sun = sunRef.current;
    const moon = moonRef.current;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (resolvedTheme === 'dark') {
        gsap.set(sun, { autoAlpha: 0, scale: 0, rotation: -90 });
        gsap.set(moon, { autoAlpha: 1, scale: 1, rotation: 0 });
      } else {
        gsap.set(sun, { autoAlpha: 1, scale: 1, rotation: 0 });
        gsap.set(moon, { autoAlpha: 0, scale: 0, rotation: 90 });
      }
      return;
    }

    const tl = gsap.timeline();

    if (resolvedTheme === 'dark') {
      // Animate TO dark (sun out, moon in)
      tl.to(sun, {
        duration: 0.35,
        autoAlpha: 0,
        scale: 0,
        rotation: -90,
        ease: 'power3.in',
      }).fromTo(
        moon,
        { autoAlpha: 0, scale: 0, rotation: 90 },
        {
          duration: 0.35,
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          ease: 'power3.out',
        },
        '>-0.2'
      );
    } else {
      // Animate TO light (moon out, sun in)
      tl.to(moon, {
        duration: 0.35,
        autoAlpha: 0,
        scale: 0,
        rotation: -90,
        ease: 'power3.in',
      }).fromTo(
        sun,
        { autoAlpha: 0, scale: 0, rotation: 90 },
        {
          duration: 0.35,
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          ease: 'power3.out',
        },
        '>-0.2'
      );
    }
  }, [resolvedTheme, mounted]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative overflow-hidden"
    >
      <span
        ref={sunRef}
        className="material-symbols-outlined absolute text-xl"
      >
        light_mode
      </span>
      <span
        ref={moonRef}
        className="material-symbols-outlined absolute text-xl"
      >
        dark_mode
      </span>
    </Button>
  );
}
