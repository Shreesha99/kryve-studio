"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { HamburgerButton } from "./hamburger-button";
import { FullScreenMenu } from "./full-screen-menu";
import { useLenis } from "./smooth-scroll-provider";
import { usePreloaderDone } from "./app-providers";

export function Header() {
  const logoPodRef = useRef<HTMLDivElement>(null);
  const controlsPodRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenis = useLenis();
  const { preloaderDone } = usePreloaderDone();

  // Animate header pods on initial load
  useLayoutEffect(() => {
    const pods = [logoPodRef.current, controlsPodRef.current].filter(Boolean);
    if (pods.length === 0) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(pods, { opacity: 0, y: -20 });

      if (preloaderDone) {
        gsap.to(pods, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        });
      }
    });

    return () => ctx.revert();
  }, [preloaderDone]);

  // Detect if page is scrolled to apply background to header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stop scrolling when the menu is open
  useEffect(() => {
    if (isMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isMenuOpen, lenis]);

  return (
    <>
      <div
        ref={logoPodRef}
        className={cn(
          "pointer-events-auto fixed z-50 top-4 left-4 sm:top-6 sm:left-6 rounded-full border bg-background/60 backdrop-blur-md transition-colors duration-300",
          isScrolled ? "border-border" : "border-transparent"
        )}
      >
        <div className="flex items-center justify-center px-1.5 py-1">
          <Logo />
        </div>
      </div>

      <div
        ref={controlsPodRef}
        className={cn(
          "pointer-events-auto fixed z-50 top-4 right-4 sm:top-6 sm:right-6 rounded-full border bg-background/60 backdrop-blur-md transition-colors duration-300",
          isScrolled ? "border-border" : "border-transparent"
        )}
      >
        <div className="flex items-center">
          <ThemeToggle />
          <HamburgerButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      </div>

      <FullScreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
