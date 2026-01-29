"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
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
      {/* Progress ring */}
      <circle
        ref={ringRef}
        cx="60"
        cy="60"
        r="52"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        opacity="1"
      />

      {/* Custom E */}
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

export function Preloader({ onAnimationComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useLayoutEffect(() => {
    const preloader = preloaderRef.current;
    const container = containerRef.current;
    const path = pathRef.current;
    const ring = ringRef.current;

    if (!preloader || !container || !path || !ring) return;

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
      transformOrigin: "50% 50%",
      opacity: 0, // <-- FIX
    });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        preloader.style.display = "none";
        onAnimationComplete();
      },
    });

    gsap.set(container, { opacity: 1 });

    tl

      // Draw E
      .to(path, {
        strokeDashoffset: 0,
        duration: 1.1,
      })

      // Animate ring AFTER E completes
      .to(ring, {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.inOut",
      })

      // small cinematic pause
      .to({}, { duration: 0.35 })

      // exit
      .to(container, {
        scale: 0.92,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      })
      .to(
        preloader,
        {
          opacity: 0,
          duration: 0.35,
        },
        "-=0.3"
      );
  }, [onAnimationComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-background"
    >
      <div ref={containerRef} className="h-20 w-20 text-foreground opacity-0">
        <ElysiumIcon pathRef={pathRef} ringRef={ringRef} />
      </div>
    </div>
  );
}
