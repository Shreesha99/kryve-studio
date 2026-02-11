"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { usePreloaderDone } from "@/components/common/app-providers";
import ColorBends from "@/components/ColorBends";
import { GLSLHills } from "@/components/ui/glsl-hills";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const revealRefs = useRef<HTMLDivElement[]>([]);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const { preloaderDone } = usePreloaderDone();
  const hoverEnabled = useRef(false);

  const addRevealRef = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  /* ============================= */
  /* TRUE HORIZONTAL WATER WAVE */
  /* ============================= */
  useEffect(() => {
    if (!brandRef.current || !preloaderDone) return;

    const letters = Array.from(
      brandRef.current.querySelectorAll<HTMLElement>("span")
    );

    let time = 0;

    const speed = 0.45; // calm, premium
    const waveLength = 2.4; // wider wave
    const gradientWidth = 300; // MUST match background-size X

    const tick = () => {
      time += speed * 0.016;

      letters.forEach((el, i) => {
        const phase = time - i / waveLength;

        // full-width sine sweep
        const x = ((Math.sin(phase) + 1) / 2) * gradientWidth;

        el.style.backgroundPosition = `${x}% 50%`;
      });
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, [preloaderDone]);
  /* ============================= */
  /* GRADIENT COLOR DRIFT */
  /* ============================= */
  /* ============================= */
  /* SAFE COLOR TEMPERATURE DRIFT */
  /* ============================= */
  useEffect(() => {
    if (!brandRef.current || !preloaderDone) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const letters = Array.from(
      brandRef.current.querySelectorAll<HTMLElement>("span")
    );

    gsap.to(letters, {
      "--c3": "#3f4f58",
      "--c4": "#5a6b73",
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, [preloaderDone]);

  useEffect(() => {
    if (!preloaderDone || !brandRef.current) return;

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>(
        brandRef.current!.querySelectorAll("span")
      );

      gsap.set(letters, {
        y: 0,
        yPercent: 0,
        opacity: 1,
        clearProps: "transform",
      });

      gsap.fromTo(
        letters,
        { yPercent: -120 },
        {
          yPercent: 0,
          stagger: 0.08,
          duration: 1.4,
          ease: "power4.out",
          onComplete: () => {
            hoverEnabled.current = true;
          },
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
  /* PER LETTER HOVER BOUNCE */
  /* ============================= */
  useEffect(() => {
    const title = brandRef.current;
    if (!title) return;

    const letters = Array.from(title.querySelectorAll<HTMLElement>("span"));
    gsap.set(letters, { y: 0 });

    const onEnter = (el: HTMLElement) => {
      if (!hoverEnabled.current) return;
      gsap.killTweensOf(el);
      gsap.to(el, {
        y: -14,
        duration: 0.45,
        ease: "elastic.out(1, 0.4)",
      });
    };

    const onLeave = (el: HTMLElement) => {
      if (!hoverEnabled.current) return;
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
      id="home"
      ref={sectionRef}
      className={cn(
        "relative min-h-[100svh] h-[100dvh] w-full overflow-hidden bg-background text-foreground",
        {
          "opacity-0": !preloaderDone,
        }
      )}
    >
      {preloaderDone && (
        <>
          {/* Existing ColorBends background */}
          {/*
          <div className="absolute inset-0 z-0">
            <ColorBends
              colors={[
                "#0B1F2A",
                "#1C2E3A",
                "#2A2F33",
                "#0A0D10",
                "#102533",
                "#7A1E1E",
              ]}
              rotation={50}
              speed={0.59}
              scale={0.5}
              frequency={1}
              warpStrength={1}
              mouseInfluence={2}
              parallax={1}
              noise={0}
              transparent
              autoRotate={1}
            />
          </div>
          */}

          {/* GLSL Hills background */}
          <GLSLHills speed={0.35} cameraZ={130} planeSize={1024} />
        </>
      )}

      <div className="relative z-10 pointer-events-none h-full w-full">
        <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-10 pointer-events-auto">
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
                    className="relative inline-block text-transparent bg-clip-text elysium-animated-gradient"
                  >
                    {c}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-logo-gradient-soft bg-clip-text"
                    />
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

        <div
          ref={bottomLeftRef}
          className="absolute bottom-10 left-10 text-sm leading-relaxed text-muted-foreground pointer-events-auto"
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

        <button
          onClick={() =>
            window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
          }
          className="absolute bottom-10 right-10 text-lg text-muted-foreground hover:text-foreground transition pointer-events-auto"
          aria-label="Scroll Down"
        >
          ↓
        </button>
      </div>
    </section>
  );
}
