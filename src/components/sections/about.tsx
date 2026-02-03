"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { usePreloaderDone } from "@/components/common/app-providers";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  const leftTitleRef = useRef<HTMLHeadingElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  const swapRef = useRef<HTMLSpanElement>(null);
  const internetRef = useRef<HTMLSpanElement>(null);
  const wwwRef = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  const { preloaderDone } = usePreloaderDone();

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  /* ---------------- SCROLL REVEAL ---------------- */

  useEffect(() => {
    if (!preloaderDone) return;

    const leftLines = leftTitleRef.current?.querySelectorAll(".reveal") ?? [];
    const rightLines =
      rightContentRef.current?.querySelectorAll(".reveal") ?? [];

    gsap.fromTo(
      leftLines,
      { y: "120%" },
      {
        y: "0%",
        stagger: 0.12,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    gsap.fromTo(
      rightLines,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      }
    );
  }, [preloaderDone]);

  /* ---------------- WORD SWAP ---------------- */

  useEffect(() => {
    if (
      !swapRef.current ||
      !internetRef.current ||
      !wwwRef.current ||
      !underlineRef.current
    )
      return;

    gsap.set(wwwRef.current, { y: "100%" });
    gsap.set(underlineRef.current, { scaleX: 0 });

    const showWWW = () => {
      gsap.to(internetRef.current, {
        y: "-100%",
        duration: 0.35,
        ease: "power3.inOut",
      });

      gsap.to(wwwRef.current, {
        y: "0%",
        duration: 0.4,
        ease: "power3.out",
      });

      gsap.to(underlineRef.current, {
        scaleX: 1,
        transformOrigin: "left",
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const showInternet = () => {
      gsap.to(internetRef.current, {
        y: "0%",
        duration: 0.4,
        ease: "power3.out",
      });

      gsap.to(wwwRef.current, {
        y: "100%",
        duration: 0.3,
        ease: "power3.in",
      });

      gsap.to(underlineRef.current, {
        scaleX: 0,
        transformOrigin: "right",
        duration: 0.25,
        ease: "power3.out",
      });
    };

    if (!isMobile) {
      swapRef.current.addEventListener("mouseenter", showWWW);
      swapRef.current.addEventListener("mouseleave", showInternet);

      return () => {
        swapRef.current?.removeEventListener("mouseenter", showWWW);
        swapRef.current?.removeEventListener("mouseleave", showInternet);
      };
    }

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
    tl.to({}, { duration: 0.8 })
      .add(showWWW)
      .to({}, { duration: 1.4 })
      .add(showInternet);

    return () => tl.kill();
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen bg-background px-6"
    >
      {/* ✅ VERTICAL + HORIZONTAL CENTERING FIX */}
      <div className="min-h-screen flex items-center">
        <div className="mx-auto w-full max-w-[1600px] grid grid-cols-1 md:grid-cols-2 gap-24">
          {/* LEFT */}
          <h2
            ref={leftTitleRef}
            className="font-headline text-[12vw] leading-[1.05] md:text-6xl lg:text-7xl"
          >
            <div className="overflow-hidden">
              <span className="reveal block">We don’t chase trends.</span>
            </div>

            <div className="overflow-hidden">
              <span className="reveal block">We design what brands</span>
            </div>

            <div className="overflow-hidden">
              <span className="reveal block">
                live on the{" "}
                <span
                  ref={swapRef}
                  className="relative inline-block h-[1em] w-[7ch] overflow-hidden align-baseline "
                >
                  <span
                    ref={internetRef}
                    className="absolute inset-0 block cursor-pointer md:pt-2"
                  >
                    internet
                  </span>

                  <span
                    ref={wwwRef}
                    className="absolute inset-0 block text-left cursor-pointer md:pt-2"
                  >
                    www
                  </span>

                  <span
                    ref={underlineRef}
                    className="absolute -bottom-3 left-0 h-[3px] w-full origin-left scale-x-0 bg-foreground"
                  />
                </span>
              </span>
            </div>
          </h2>

          {/* RIGHT */}
          <div ref={rightContentRef} className="flex items-center">
            <div className="max-w-xl space-y-6 text-muted-foreground">
              <p className="reveal text-sm uppercase tracking-widest text-foreground">
                Who we are
              </p>
              <p className="reveal flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <span className="fi fi-in"></span>
                Bengaluru, India
              </p>

              <p className="reveal">
                We’re a new web development studio building thoughtful digital
                experiences, not disposable websites.
              </p>

              <p className="reveal">
                Starting fresh allows us to question defaults, avoid bloat, and
                obsess over details that most teams ignore.
              </p>

              <p className="reveal">
                Our work is intentional, refined, and designed to age well.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
