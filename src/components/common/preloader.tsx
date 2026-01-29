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
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const container = containerRef.current;
    const iconPath = iconPathRef.current;
    const ring = ringRef.current;

    if (!preloader || !container || !iconPath || !ring) return;

    const iconPathLength = iconPath.getTotalLength();
    const ringLength = ring.getTotalLength();

    // Set initial states
    gsap.set(container, { autoAlpha: 1 });
    gsap.set(iconPath, {
      strokeDasharray: iconPathLength,
      strokeDashoffset: iconPathLength,
    });
    gsap.set(ring, {
      strokeDasharray: ringLength,
      strokeDashoffset: ringLength,
      autoAlpha: 0,
    });

    const tl = gsap.timeline();

    tl
      // 1. Draw the icon
      .to(iconPath, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut",
      })

      // 2. Show and draw the ring
      .to(ring, { autoAlpha: 1, duration: 0.1 }, "-=0.5")
      .to(
        ring,
        {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power1.inOut",
        },
        "<"
      )

      // 3. Hold for a moment
      .to({}, { duration: 0.5 })

      // 4. Exit animation
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
      }
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
              d="M70 30C70 43.2548 59.2548 54 46 54H30M30 70C30 56.7452 40.7452 46 54 46H70"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          <circle
            ref={ringRef}
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
      </div>
    </div>
  );
}
