'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from "@/lib/utils";

interface PreloaderProps {
  onAnimationComplete: () => void;
}

function ElysiumIcon({
  pathRef,
  ringRef,
  className,
}: {
  pathRef: React.Ref<SVGPathElement>;
  ringRef: React.Ref<SVGCircleElement>;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={cn("h-full w-full", className)}>
      <circle
        ref={ringRef}
        cx="60"
        cy="60"
        r="52"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        opacity="0.3"
      />
      <path
        ref={pathRef}
        d="M80 30H40V50H70V70H40V90H80"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Preloader({ onAnimationComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    const ring = ringRef.current;

    if (!container || !path || !ring) return;

    const pathLength = path.getTotalLength();
    const ringLength = ring.getTotalLength();

    // Initial states
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
    gsap.set(ring, {
      strokeDasharray: ringLength,
      strokeDashoffset: ringLength,
      rotate: -90,
      transformOrigin: '50% 50%',
    });
    gsap.set(container, { autoAlpha: 1 });

    const masterTl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        // After exit animation is done, call the final callback
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      },
    });

    masterTl
      // Animate In
      .to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to(
        ring,
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
        },
        '-=1.2'
      )
      // Hold for a moment
      .to({}, { duration: 0.8 })
      // Animate Out
      .to(container, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
      });
      
    return () => {
      masterTl.kill();
    }
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-background">
      <div ref={containerRef} className="h-24 w-24 text-foreground">
        <ElysiumIcon pathRef={pathRef} ringRef={ringRef} />
      </div>
    </div>
  );
}
