"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { HamburgerButton } from "./hamburger-button";
import { FullScreenMenu } from "./full-screen-menu";
import { useLenis } from "./smooth-scroll-provider";
import { usePreloaderDone } from "./app-providers";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const podRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoInnerRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenis = useLenis();
  const { preloaderDone } = usePreloaderDone();

  /* ---------------- INTRO ANIMATION ---------------- */

  useLayoutEffect(() => {
    if (!preloaderDone || !podRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        podRef.current,
        { y: "-120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.4,
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, [preloaderDone]);

  /* ---------------- LOGO REVEAL ON SCROLL ---------------- */

  useEffect(() => {
    if (!logoWrapRef.current || !logoInnerRef.current) return;

    gsap.set(logoInnerRef.current, { yPercent: 120 });

    ScrollTrigger.create({
      trigger: document.body,
      start: "top -80vh", // ~80vh past hero
      onEnter: () => {
        gsap.to(logoInnerRef.current, {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(logoInnerRef.current, {
          yPercent: 120,
          duration: 0.6,
          ease: "power3.in",
        });
      },
    });
  }, []);

  /* ---------------- SCROLL BACKGROUND ---------------- */

  useEffect(() => {
    if (!preloaderDone) return;

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "top+=100",
      onUpdate: (self) => {
        gsap.to(bgRef.current, {
          opacity: self.progress > 0 ? 1 : 0,
          scaleX: self.progress,
          duration: 0.4,
          ease: "power3.out",
        });
      },
    });
  }, [preloaderDone]);

  /* ---------------- SCROLL LOCK ---------------- */

  useEffect(() => {
    isMenuOpen ? lenis?.stop() : lenis?.start();
  }, [isMenuOpen, lenis]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-[2000] h-24",
          !preloaderDone && "opacity-0"
        )}
      >
        <div className="relative mx-auto flex h-full w-full items-center justify-between px-6">
          {/* LEFT LOGO SLOT */}
          <div ref={logoWrapRef} className="relative h-10 w-14 overflow-hidden">
            <div ref={logoInnerRef}>
              <Image
                src="/favicon.svg"
                alt="Logo"
                width={30}
                height={30}
                priority
              />
            </div>
          </div>

          {/* RIGHT CONTROLS */}
          <div
            ref={podRef}
            className="relative flex items-center gap-6 opacity-0"
          >
            {/* GLASS BACKGROUND */}
            <div
              ref={bgRef}
              className="pointer-events-none absolute -inset-y-2 -inset-x-4 origin-right scale-x-0 rounded-full border border-border bg-background/60 opacity-0 shadow-sm backdrop-blur-md"
            />

            <div className="relative z-10 flex items-center gap-6">
              <Link
                href="#contact"
                className="group items-center gap-2 text-sm uppercase tracking-wide inline-flex transition-colors hover:text-foreground/80"
              >
                <span className="relative">
                  Let’s Talk
                  <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </span>

                <ArrowRight
                  className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:rotate-[-45deg]"
                  strokeWidth={1.5}
                />
              </Link>

              <ThemeToggle />

              <HamburgerButton
                isOpen={isMenuOpen}
                onClick={() => setIsMenuOpen((v) => !v)}
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
