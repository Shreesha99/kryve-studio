'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from "@/lib/utils";

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
      />
      <path
        ref={pathRef}
        d="M80 30H40V50H70V70H40V90H80"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Preloader({ onAnimationComplete }: { onAnimationComplete: () => void }) {
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

    // Initial animation state
    gsap.set(container, { yPercent: 0 });
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
    gsap.set(ring, {
      strokeDasharray: ringLength,
      strokeDashoffset: ringLength,
      rotate: -90,
      transformOrigin: "50% 50%",
    });
    
    // Create the master timeline
    const tl = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        // This ensures the main app content is rendered after the animation
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      },
    });

    tl
      // Draw in the SVG logo
      .to(path, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      })
      .to(ring, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
      }, '-=0.8')
      // Hold for a moment for the user to see the logo
      .to({}, { duration: 0.5 })
      // Animate the preloader away by sliding it up
      .to(container, {
        yPercent: -105,
        duration: 1.2,
        ease: 'power3.inOut',
      });
      
    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [onAnimationComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-background"
    >
      <div className="h-24 w-24 text-foreground">
        <ElysiumIcon pathRef={pathRef} ringRef={ringRef} />
      </div>
    </div>
  );
}
