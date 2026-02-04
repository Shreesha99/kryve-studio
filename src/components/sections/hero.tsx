"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { usePreloaderDone } from "@/components/common/app-providers";
import ColorBends from "@/components/ColorBends";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const revealRefs = useRef<HTMLDivElement[]>([]);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const { preloaderDone } = usePreloaderDone();

  const addRevealRef = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  /* ============================= */
  /* INTRO ANIMATIONS */
  /* ============================= */

  useEffect(() => {
    if (!preloaderDone) return;

    const el = document.querySelector(".color-bends-container");
    if (!el) return;

    gsap.fromTo(
      el,
      {
        opacity: 0,
        scale: 1.05,
        filter: "blur(12px)",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, [preloaderDone]);

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

      /* BOTTOM LEFT — OVERFLOW TEXT REVEAL */
      const bottomLines =
        bottomLeftRef.current?.querySelectorAll(".reveal-line") ?? [];

      gsap.fromTo(
        bottomLines,
        { yPercent: 120 },
        {
          yPercent: 0,
          stagger: 0.12,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.6,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [preloaderDone]);

  /* ============================= */
  /* PER-LETTER UPWARD HOVER BOUNCE */
  /* ============================= */
  useEffect(() => {
    const title = brandRef.current;
    if (!title) return;

    const letters = Array.from(title.querySelectorAll<HTMLElement>("span"));

    gsap.set(letters, { y: 0 });

    const onEnter = (el: HTMLElement) => {
      gsap.killTweensOf(el);
      gsap.to(el, {
        y: -14,
        duration: 0.45,
        ease: "elastic.out(1, 0.4)",
      });
    };

    const onLeave = (el: HTMLElement) => {
      gsap.killTweensOf(el);
      gsap.to(el, {
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    letters.forEach((el) => {
      const enter = () => onEnter(el);
      const leave = () => onLeave(el);

      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);

      (el as any)._enter = enter;
      (el as any)._leave = leave;
    });

    return () => {
      letters.forEach((el) => {
        el.removeEventListener("pointerenter", (el as any)._enter);
        el.removeEventListener("pointerleave", (el as any)._leave);
      });
    };
  }, []);

  /* ============================= */
  /* MOBILE AUTOPLAY MICRO BOUNCE */
  /* ============================= */
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    const title = brandRef.current;
    if (!title) return;

    const letters = Array.from(title.querySelectorAll<HTMLElement>("span"));

    gsap.set(letters, { y: 0 });

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: "sine.inOut" },
    });

    letters.forEach((el, i) => {
      tl.to(
        el,
        {
          y: -6,
          duration: 1.2,
        },
        i * 0.15
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative min-h-[100svh] h-[100dvh] w-full bg-background text-foreground",
        {
          "opacity-0": !preloaderDone,
        }
      )}
    >
      <ColorBends
        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
        rotation={50}
        speed={0.59}
        scale={2}
        frequency={1}
        warpStrength={1}
        mouseInfluence={2}
        parallax={0.5}
        noise={0}
        transparent
        autoRotate={2}
        className={undefined}
        style={undefined}
      />

      {/* BRAND */}
      <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-10">
        <div className="relative mx-auto flex flex-col items-center md:w-fit">
          <span
            ref={addRevealRef}
            className="mb-2 text-[18px] lowercase tracking-[0.3em] md:absolute md:-top-5 md:left-0 md:text-[30px]"
          >
            The
          </span>

          <h1
            ref={brandRef}
            className="text-center font-headline font-semibold leading-none tracking-tight text-[18vw] cursor-default"
          >
            <div className="overflow-hidden">
              {["e", "l", "y", "s", "i", "u", "m"].map((c, i) => (
                <span
                  key={i}
                  className="inline-block bg-elysium-gradient bg-clip-text text-transparent"
                >
                  {c}
                </span>
              ))}
            </div>
          </h1>

          <span
            ref={addRevealRef}
            className="mt-2 text-[18px] lowercase tracking-[0.3em] md:absolute md:-bottom-5 md:right-0 md:text-[30px]"
          >
            Project
          </span>
        </div>
      </div>

      {/* BOTTOM LEFT */}
      <div
        ref={bottomLeftRef}
        className="absolute bottom-10 left-10 text-sm leading-relaxed text-muted-foreground"
      >
        <div className="overflow-hidden">
          <p className="reveal-line">
            Designing digital
            <br />
            experiences
            <br />
            from India.
          </p>
        </div>

        <br />

        <div className="overflow-hidden">
          <p className="reveal-line">
            Crafted for brands
            <br />
            that think globally.
          </p>
        </div>
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
