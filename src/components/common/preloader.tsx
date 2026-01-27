"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onAnimationComplete: () => void;
}

export function Preloader({ onAnimationComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // A short delay before calling the completion handler to ensure the fade-out is smooth
        setTimeout(onAnimationComplete, 300);
      },
    });

    gsap.set(preloaderRef.current, { perspective: 800 });
    gsap.set(logoRef.current, { opacity: 0, y: 50, rotationX: -90 });
    gsap.set(progressContainerRef.current, { opacity: 0 });

    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 1,
      ease: "power3.out",
    })
      .to(progressContainerRef.current, { opacity: 1, duration: 0.5 }, "-=0.8")
      .fromTo(
        progressBarRef.current,
        { width: "0%" },
        { width: "100%", duration: 1.2, ease: "power2.inOut" },
        "-=0.5"
      )
      .to([logoRef.current, progressContainerRef.current], {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power3.in",
        delay: 0.3,
      })
      .to(preloaderRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          if (preloaderRef.current) {
            preloaderRef.current.style.display = "none";
          }
          onAnimationComplete();
        },
      });
  }, [onAnimationComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <h1
        ref={logoRef}
        className="font-headline text-5xl font-bold tracking-widest text-foreground"
      >
        ELYSIUM
      </h1>
      <div
        ref={progressContainerRef}
        className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-muted"
      >
        <div ref={progressBarRef} className="h-full bg-primary" />
      </div>
    </div>
  );
}
