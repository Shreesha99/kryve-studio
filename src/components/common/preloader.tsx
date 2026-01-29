"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface PreloaderProps {
  onAnimationComplete: () => void;
}

// Inlining the icon component to avoid import issues
function ElysiumIcon({ className, pathRef }: { className?: string, pathRef?: React.Ref<SVGPathElement> }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-auto", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        ref={pathRef}
        d="M25 7H7V13H20V19H7V25H25"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export function Preloader({ onAnimationComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const iconPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const container = containerRef.current;
    const icon = iconRef.current;
    const text = textRef.current;
    const iconPath = iconPathRef.current;
    if (!preloader || !container || !icon || !text || !iconPath) return;

    const pathLength = iconPath.getTotalLength();
    
    // Temporarily show to calculate width
    gsap.set(text, { autoAlpha: 1 });
    const textWidth = text.getBoundingClientRect().width;
    const iconWidth = icon.getBoundingClientRect().width;
    const gap = 8;
    
    // Set initial states
    gsap.set(preloader, { perspective: 800 });
    gsap.set(container, { autoAlpha: 1 });
    gsap.set(icon, { autoAlpha: 1 });
    gsap.set(text, { autoAlpha: 0, clipPath: 'inset(0 50% 0 50%)' });
    gsap.set(iconPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    const tl = gsap.timeline({
      onComplete: () => {
        // A short delay before calling the completion handler to ensure the fade-out is smooth
        setTimeout(onAnimationComplete, 300);
      },
    });

    tl
      // 1. Draw the icon in the center
      .to(iconPath, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" })
      
      // 2. Reveal LYSIUM and move both elements apart
      .to(icon, { 
        x: -(textWidth / 2 + gap / 2),
        duration: 1.2,
        ease: 'power3.inOut'
      }, "split")
      .to(text, {
        autoAlpha: 1,
        x: (iconWidth / 2 + gap / 2),
        clipPath: 'inset(0 0 0 0)',
        duration: 1.2,
        ease: 'power3.inOut'
      }, "split")

      // 3. Hold the complete logo
      .to({}, { duration: 0.8 })

      // 4. Exit animation
      .to(container, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power3.in",
      })
      .to(preloader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          if (preloaderRef.current) {
            preloaderRef.current.style.display = "none";
          }
          onAnimationComplete();
        },
      }, "-=0.5");
      
  }, [onAnimationComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <div
        ref={containerRef}
        className="relative flex items-center justify-center"
      >
        <div ref={iconRef} className="absolute h-12 w-12 text-foreground">
           <ElysiumIcon pathRef={iconPathRef} />
        </div>
        <div ref={textRef} className="absolute">
            <h1 className="font-headline text-5xl font-bold tracking-wider text-foreground">
                LYSIUM
            </h1>
        </div>
      </div>
    </div>
  );
}
