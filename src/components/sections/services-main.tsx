"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { cn } from "@/lib/utils";
import { usePreloaderDone } from "@/components/common/app-providers";

gsap.registerPlugin(ScrollTrigger);

type Service = {
  index: string;
  title: string;
  description: string;
  svg: JSX.Element;
  animate: (svg: SVGSVGElement) => gsap.core.Animation;
};

const SERVICES = [
  {
    index: "01",
    title: "Web Design & Development",
    description:
      "Design-led websites engineered for performance, scalability, and clarity, built to feel as good as they look.",
    svg: (
      <g>
        <rect x="12" y="18" width="76" height="60" rx="6" />
        <line x1="12" y1="32" x2="88" y2="32" />
        <rect x="20" y="40" width="30" height="10" />
        <rect x="20" y="56" width="50" height="10" />
      </g>
    ),
    animate: (svg) =>
      gsap.fromTo(
        svg.querySelectorAll("rect"),
        { y: 0 },
        {
          y: -6,
          stagger: 0.15,
          repeat: -1,
          yoyo: true,
          duration: 1.4,
          ease: "sine.inOut",
        }
      ),
  },
  {
    index: "02",
    title: "Framer Design & Build",
    description:
      "High-end Framer sites with custom interactions, fast iteration, and production-ready structure.",
    svg: (
      <g>
        <rect x="20" y="20" width="60" height="60" rx="6" />
        <path d="M35 35 L65 50 L35 65 Z" />
      </g>
    ),
    animate: (svg) =>
      gsap.to(svg.querySelector("path"), {
        x: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut",
      }),
  },
  {
    index: "03",
    title: "3D Websites",
    description:
      "Immersive WebGL and Three.js experiences that add depth and narrative without sacrificing usability.",
    svg: (
      <g>
        <rect x="30" y="30" width="40" height="40" />
        <line x1="30" y1="30" x2="45" y2="15" />
        <line x1="70" y1="30" x2="85" y2="15" />
        <line x1="45" y1="15" x2="85" y2="15" />
      </g>
    ),
    animate: (svg) =>
      gsap.to(svg.querySelector("g"), {
        rotateY: 20,
        rotateX: 8,
        transformOrigin: "50% 50%",
        repeat: -1,
        yoyo: true,
        duration: 2.4,
        ease: "sine.inOut",
      }),
  },
  {
    index: "04",
    title: "GSAP Animated Websites & Portfolios",
    description:
      "Scroll-driven, interaction-rich websites powered by GSAP, expressive, smooth, and performance-focused.",
    svg: (
      <g className="asterisk">
        <path
          d="
    M50 10
    L54 32
    L76 24
    L68 46
    L90 50
    L68 54
    L76 76
    L54 68
    L50 90
    L46 68
    L24 76
    L32 54
    L10 50
    L32 46
    L24 24
    L46 32
    Z
  "
          className="h-16 w-16 fill-none"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    ),
    animate: (svg) => {
      const star = svg.querySelector(".asterisk");

      if (!star) {
        return gsap.timeline();
      }

      return gsap.to(star, {
        rotation: "+=360", // ← critical
        duration: 10,
        ease: "linear",
        repeat: -1,
        transformOrigin: "50% 50%",
        transformBox: "fill-box", // ← critical for SVG
      });
    },
  },

  {
    index: "05",
    title: "React Application Development",
    description:
      "Scalable React applications with clean architecture, predictable state, and long-term maintainability.",
    svg: (
      <g>
        <circle cx="50" cy="50" r="6" />
        <ellipse cx="50" cy="50" rx="26" ry="10" />
        <ellipse cx="50" cy="50" rx="10" ry="26" />
      </g>
    ),
    animate: (svg) =>
      gsap.to(svg.querySelector("g"), {
        rotate: 360,
        repeat: -1,
        duration: 6,
        ease: "linear",
        transformOrigin: "50% 50%",
      }),
  },
  {
    index: "06",
    title: "SaaS Design & Development",
    description:
      "End-to-end SaaS products, from UX systems to scalable frontends built for real-world growth.",
    svg: (
      <g>
        <rect x="20" y="20" width="25" height="25" />
        <rect x="55" y="20" width="25" height="15" />
        <rect x="55" y="45" width="25" height="25" />
      </g>
    ),
    animate: (svg) =>
      gsap.fromTo(
        svg.querySelectorAll("rect"),
        { scale: 1 },
        {
          scale: 1.12,
          stagger: 0.25,
          repeat: -1,
          yoyo: true,
          duration: 1.4,
          ease: "sine.inOut",
          transformOrigin: "50% 50%",
        }
      ),
  },
] satisfies Service[];

export default function ServicesMain() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const activeAnim = useRef<gsap.core.Animation | null>(null);

  const { preloaderDone } = usePreloaderDone();
  const [activeIndex, setActiveIndex] = useState(0);

  /* masked title reveal */
  useEffect(() => {
    if (!preloaderDone || !sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".mask > span"),
      { yPercent: 120 },
      {
        yPercent: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, [preloaderDone]);

  /* active row detection */
  useEffect(() => {
    if (!preloaderDone) return;

    gsap.utils.toArray<HTMLElement>(".service-row").forEach((row, i) => {
      ScrollTrigger.create({
        trigger: row,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
      });
    });
  }, [preloaderDone]);

  /* svg animation control */
  useEffect(() => {
    activeAnim.current?.kill();
    const svg = svgRefs.current[activeIndex];
    if (svg) {
      gsap.set(svg.querySelectorAll("rect, path, line, circle, ellipse"), {
        clearProps: "transform",
      });
      activeAnim.current = SERVICES[activeIndex].animate(svg);
    }
  }, [activeIndex]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-background py-24 sm:py-28 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* TITLE */}
        <h2 className="mb-16 flex justify-center text-center text-[clamp(2.5rem,7vw,6rem)] font-medium sm:mb-20">
          <span className="mask block overflow-hidden">
            <span className="about-accent block">What We Do</span>
          </span>
        </h2>

        <div className="space-y-12 sm:space-y-16 md:space-y-24">
          {SERVICES.map((s, i) => {
            const isActive = activeIndex === i;

            return (
              <div
                key={s.index}
                className={cn(
                  "service-row group relative rounded-3xl border border-white/5 bg-white/[0.02] px-6 py-8 transition-all duration-500",
                  "md:px-10 md:py-10",
                  isActive
                    ? "service-glass-active scale-[1.01]"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                <span className="pointer-events-none absolute right-6 top-6 text-[3.5rem] font-medium text-muted-foreground/10 md:text-[5rem]">
                  {s.index}
                </span>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <svg
                    ref={(el) => {
                      svgRefs.current[i] = el;
                    }}
                    viewBox="-10 -10 120 120"
                    className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 shrink-0 fill-none"
                    strokeWidth="3"
                  >
                    <defs>
                      <linearGradient
                        id={`service-gradient-${i}`}
                        x1="0"
                        y1="0"
                        x2="100"
                        y2="100"
                      >
                        <stop offset="0%" stopColor="var(--logo-from)" />
                        <stop offset="50%" stopColor="var(--logo-mid)" />
                        <stop offset="100%" stopColor="var(--logo-to)" />
                      </linearGradient>
                    </defs>

                    <g stroke={`url(#service-gradient-${i})`}>{s.svg}</g>
                  </svg>

                  <h3 className="text-xl font-medium leading-tight sm:text-2xl md:text-3xl">
                    {s.title}
                  </h3>
                </div>

                <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base md:mt-4">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
