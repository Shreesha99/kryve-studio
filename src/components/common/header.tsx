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
import { EDrawingAnimation } from "./e-drawing-animation";

gsap.registerPlugin(ScrollTrigger);

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const podRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

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

  /* ---------------- SCROLL BACKGROUND ---------------- */

  useEffect(() => {
    if (!preloaderDone || !bgRef.current) return;

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "top+=120",
      onUpdate: (self) => {
        gsap.to(bgRef.current, {
          opacity: self.progress,
          filter: `blur(${8 - self.progress * 6}px)`,
          y: self.progress * -2,
          duration: 0.25,
          ease: "power2.out",
        });
      },
    });
  }, [preloaderDone]);

  /* ---------------- SCROLL LOCK ---------------- */

  useEffect(() => {
    isMenuOpen ? lenis?.stop() : lenis?.start();
  }, [isMenuOpen, lenis]);

  const ePathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    if (!preloaderDone || !ePathRef.current) return;

    const ctx = gsap.context(() => {
      const path = ePathRef.current!;
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "top+=300", // 👈 slower & smoother
        scrub: 2.5, // 👈 real inertia
        onUpdate: (self) => {
          gsap.set(path, {
            strokeDashoffset: length * (1 - self.progress),
          });
        },
      });
    }, headerRef);

    return () => ctx.revert();
  }, [preloaderDone]);

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
          <div className="relative flex h-8 w-10 items-center justify-center">
            <EDrawingAnimation ref={ePathRef} />
          </div>

          {/* RIGHT CONTROLS */}
          <div
            ref={podRef}
            className="
    relative flex items-center gap-6
    px-2 py-1
    opacity-0
  "
          >
            {/* GLASS BACKGROUND */}
            <div
              ref={bgRef}
              className="
    pointer-events-none absolute -inset-y-2 -inset-x-4
    rounded-full

    /* glass body */
    bg-white/20 dark:bg-black/30
    backdrop-blur-xl

    /* edge definition */
    border border-white/20 dark:border-white/10

    /* depth */
    shadow-[0_8px_30px_rgba(0,0,0,0.18)]

    /* highlight */
    before:absolute before:inset-0
    before:rounded-full
    before:bg-gradient-to-b
    before:from-white/30 before:to-transparent
    before:opacity-40

    opacity-0
  "
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
