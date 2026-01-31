"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { HamburgerButton } from "./hamburger-button";
import { FullScreenMenu } from "./full-screen-menu";
import { useLenis } from "./smooth-scroll-provider";
import { usePreloaderDone } from "./app-providers";

gsap.registerPlugin(ScrollTrigger);

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const podRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenis = useLenis();
  const { preloaderDone } = usePreloaderDone();

  // Animate header in after preloader
  useLayoutEffect(() => {
    if (!preloaderDone || !headerRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [logoRef.current, podRef.current],
        { y: "-120%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.1, delay: 0.5 }
      );
    }, headerRef);

    return () => ctx.revert();
  }, [preloaderDone]);

  // Handle scroll-based background animation
  useEffect(() => {
    if (!preloaderDone) return;
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "top+=100",
        onUpdate: (self) => {
          gsap.to(bgRef.current, {
            opacity: self.progress > 0 ? 1 : 0,
            scaleX: self.progress,
            duration: 0.5,
            ease: "power3.out",
          });
        },
      });
    }, headerRef);
    
    return () => ctx.revert();

  }, [preloaderDone]);

  // Lock/unlock scroll when menu opens/closes
  useEffect(() => {
    if (isMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isMenuOpen, lenis]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 flex h-24 items-center p-4",
          !preloaderDone && "opacity-0"
        )}
      >
        <div className="relative mx-auto flex h-14 w-full max-w-7xl items-center justify-between">
            {/* Background Pill */}
            <div ref={bgRef} className="absolute inset-x-0 top-0 h-full origin-center scale-x-0 rounded-full border border-border bg-background/60 opacity-0 shadow-sm backdrop-blur-md" />

            {/* Logo */}
            <div ref={logoRef} className="relative z-10 pointer-events-auto opacity-0">
                <Logo />
            </div>

            {/* Control Pod */}
            <div ref={podRef} className="relative z-10 flex items-center justify-center gap-2 rounded-full pointer-events-auto opacity-0">
                <ThemeToggle />
                <HamburgerButton
                isOpen={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
            </div>
        </div>
      </header>

      <FullScreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
