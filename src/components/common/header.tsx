"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { HamburgerButton } from "./hamburger-button";
import { FullScreenMenu } from "./full-screen-menu";
import { useLenis } from "./smooth-scroll-provider";
import { usePreloaderDone } from "./app-providers";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenis = useLenis();
  const { preloaderDone } = usePreloaderDone();

  // Animate header in after preloader
  useLayoutEffect(() => {
    if (!preloaderDone || !headerRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: "-120%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.5 }
      );
    }, headerRef);

    return () => ctx.revert();
  }, [preloaderDone]);

  // Detect scroll to apply background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          "opacity-0" // Initially hidden until GSAP animation
        )}
      >
        <div
          className={cn(
            "mx-auto mt-4 max-w-7xl rounded-full border bg-transparent px-4 transition-all duration-300",
            isScrolled
              ? "border-border bg-background/60 backdrop-blur-md"
              : "border-transparent"
          )}
        >
          <div className="flex h-14 items-center justify-between">
            <div className="pointer-events-auto">
                <Logo />
            </div>
            <div className="pointer-events-auto flex items-center">
              <ThemeToggle />
              <HamburgerButton
                isOpen={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>
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
