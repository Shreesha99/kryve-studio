"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onAnimationComplete: () => void;
}

export function Preloader({ onAnimationComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const container = containerRef.current;
    const iconPath = iconPathRef.current;

    if (!preloader || !container || !iconPath) return;

    const iconPathLength = iconPath.getTotalLength();

    // Set initial states
    gsap.set(container, { autoAlpha: 1 });
    gsap.set(iconPath, {
      strokeDasharray: iconPathLength,
      strokeDashoffset: iconPathLength,
    });

    const tl = gsap.timeline();

    tl
      // 1. Draw the icon
      .to(iconPath, {
        strokeDashoffset: 0,
        duration: 2.0,
        ease: "power2.inOut",
      })
      // 2. Hold for a moment
      .to({}, { duration: 0.8 })
      // 3. Exit animation
      .to(container, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "power3.in",
      })
      .to(
        preloader,
        {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            if (preloaderRef.current) {
              preloaderRef.current.style.display = "none";
            }
            onAnimationComplete();
          },
        },
        "-=0.5"
      );

    return () => {
      tl.kill();
    };
  }, [onAnimationComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <div
        ref={containerRef}
        className="relative h-24 w-24 text-foreground"
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
        >
          <path
            ref={iconPathRef}
            d="M75 25 C 75 42.67 65.67 52 50 52 L 25 52 M 25 75 C 25 57.33 34.33 48 50 48 L 75 48"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
