"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { usePreloaderDone } from "@/components/common/app-providers";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const revealRefs = useRef<HTMLDivElement[]>([]);
  const { preloaderDone } = usePreloaderDone();

  const addRevealRef = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (!preloaderDone) return;

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>(
        brandRef.current?.querySelectorAll("span") || []
      );

      gsap.fromTo(
        letters,
        { yPercent: -120 },
        {
          yPercent: 0,
          stagger: 0.08,
          duration: 1.4,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        revealRefs.current,
        { y: -40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          delay: 0.4,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [preloaderDone]);

  return (
    <section
      ref={sectionRef}
      className={cn("relative h-screen w-full bg-background text-foreground", {
        "opacity-0": !preloaderDone,
      })}
    >
      {/* BRAND */}
      <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-10">
        <div className="relative mx-auto flex flex-col items-center md:w-fit">
          <span
            ref={addRevealRef}
            className="mb-2 text-[18px] lowercase tracking-[0.3em] text-muted-foreground md:absolute md:-top-5 md:left-0 md:text-[30px]"
          >
            The
          </span>

          <h1
            ref={brandRef}
            className="text-center font-headline font-semibold leading-none tracking-tight text-[18vw]"
          >
            <div className="overflow-hidden">
              {["e", "l", "y", "s", "i", "u", "m"].map((c, i) => (
                <span key={i} className="inline-block">
                  {c}
                </span>
              ))}
            </div>
          </h1>

          <span
            ref={addRevealRef}
            className="mt-2 text-[18px] lowercase tracking-[0.3em] md:absolute md:-bottom-5 md:right-0 md:text-[30px] text-[#D1F2EB]"
          >
            Project
          </span>
        </div>
      </div>

      {/* BOTTOM LEFT */}
      {/* BOTTOM LEFT */}
      <div
        ref={addRevealRef}
        className="absolute bottom-10 left-10 text-sm leading-relaxed text-muted-foreground"
      >
        <p>
          Designing digital
          <br />
          experiences
          <br />
          from India.
        </p>
        <br />
        <p>
          Crafted for brands
          <br />
          that think globally.
        </p>
      </div>

      {/* BOTTOM RIGHT */}
      <button
        onClick={() =>
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
        }
        className="absolute bottom-10 right-10 text-lg text-muted-foreground hover:text-foreground transition"
        aria-label="Scroll Down"
      >
        ↓
      </button>
    </section>
  );
}
