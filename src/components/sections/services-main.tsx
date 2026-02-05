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
  animate: (svg: SVGSVGElement) => gsap.core.Tween;
};

const SERVICES: Service[] = [
  {
    index: "01",
    title: "Web Design & Development",
    description:
      "Design-led websites engineered for performance, scalability, and clarity — built to feel as good as they look.",
    svg: (
      <g className="browser">
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
          duration: 1.2,
          ease: "power1.inOut",
        }
      ),
  },
  {
    index: "02",
    title: "Framer Design & Build",
    description:
      "High-end Framer sites with custom interactions, fast iteration, and production-ready structure.",
    svg: (
      <g className="framer">
        <rect x="20" y="20" width="60" height="60" rx="6" />
        <path d="M35 35 L65 50 L35 65 Z" />
      </g>
    ),
    animate: (svg) =>
      gsap.to(svg.querySelector("path"), {
        x: 8,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "power2.inOut",
      }),
  },
  {
    index: "03",
    title: "3D Websites",
    description:
      "Immersive WebGL and Three.js experiences that add depth and narrative without sacrificing usability.",
    svg: (
      <g className="cube">
        <rect x="30" y="30" width="40" height="40" />
        <line x1="30" y1="30" x2="45" y2="15" />
        <line x1="70" y1="30" x2="85" y2="15" />
        <line x1="45" y1="15" x2="85" y2="15" />
      </g>
    ),
    animate: (svg) =>
      gsap.to(svg, {
        rotateY: 25,
        rotateX: 10,
        transformOrigin: "center",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      }),
  },
  {
    index: "04",
    title: "GSAP Animated Websites & Portfolios",
    description:
      "Scroll-driven, interaction-rich websites powered by GSAP — expressive, smooth, and performance-focused.",
    svg: (
      <g className="timeline">
        <line x1="20" y1="30" x2="80" y2="30" />
        <line x1="20" y1="50" x2="60" y2="50" />
        <line x1="20" y1="70" x2="40" y2="70" />
      </g>
    ),
    animate: (svg) =>
      gsap.fromTo(
        svg.querySelectorAll("line"),
        { strokeDasharray: 60, strokeDashoffset: 60 },
        {
          strokeDashoffset: 0,
          stagger: 0.2,
          repeat: -1,
          duration: 1.4,
          ease: "power2.out",
        }
      ),
  },
  {
    index: "05",
    title: "React Application Development",
    description:
      "Scalable React applications with clean architecture, predictable state, and long-term maintainability.",
    svg: (
      <g className="react">
        <circle cx="50" cy="50" r="6" />
        <ellipse cx="50" cy="50" rx="26" ry="10" />
        <ellipse cx="50" cy="50" rx="10" ry="26" />
      </g>
    ),
    animate: (svg) =>
      gsap.to(svg, {
        rotate: 360,
        repeat: -1,
        duration: 4,
        ease: "linear",
        transformOrigin: "center",
      }),
  },
  {
    index: "06",
    title: "SaaS Design & Development",
    description:
      "End-to-end SaaS products — from UX systems to scalable frontends built for real-world growth.",
    svg: (
      <g className="dashboard">
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
          scale: 1.15,
          stagger: 0.2,
          repeat: -1,
          yoyo: true,
          duration: 1.2,
          ease: "power1.inOut",
          transformOrigin: "center",
        }
      ),
  },
];

export default function ServicesMain() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const activeAnim = useRef<gsap.core.Tween | null>(null);
  const { preloaderDone } = usePreloaderDone();
  const [activeIndex, setActiveIndex] = useState(0);

  /* MASKED REVEAL */
  useEffect(() => {
    if (!preloaderDone) return;

    gsap.fromTo(
      ".mask > span",
      { yPercent: 120 },
      {
        yPercent: 0,
        stagger: 0.05,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, [preloaderDone]);

  /* SCROLL ACTIVE */
  useEffect(() => {
    if (!preloaderDone) return;

    gsap.utils.toArray<HTMLElement>(".service-row").forEach((row, i) => {
      ScrollTrigger.create({
        trigger: row,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
      });
    });
  }, [preloaderDone]);

  /* SVG ACTIVE ANIMATION */
  useEffect(() => {
    activeAnim.current?.kill();
    const svg = svgRefs.current[activeIndex];
    if (svg) {
      activeAnim.current = SERVICES[activeIndex].animate(svg);
    }
  }, [activeIndex]);

  return (
    <section ref={sectionRef} className="bg-background py-32">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[420px_1fr] gap-24">
        <aside className="lg:sticky lg:top-32">
          <h2 className="text-[clamp(3.5rem,7vw,6.5rem)] font-medium">
            <span className="mask block overflow-hidden">
              <span className="block">What We Do</span>
            </span>
          </h2>
          <span className="text-[9rem] text-muted-foreground/10 font-medium">
            {SERVICES[activeIndex].index}
          </span>
        </aside>

        <div className="space-y-28">
          {SERVICES.map((s, i) => (
            <div
              key={s.index}
              className={cn(
                "service-row transition-opacity",
                activeIndex === i ? "opacity-100" : "opacity-40"
              )}
            >
              <div className="flex gap-6 items-center">
                <svg
                  ref={(el) => {
                    svgRefs.current[i] = el;
                  }}
                  viewBox="0 0 100 100"
                  className="h-16 w-16 stroke-foreground fill-none"
                  strokeWidth="3"
                >
                  {s.svg}
                </svg>

                <h3 className="text-3xl font-medium">
                  <span className="mask block overflow-hidden">
                    <span className="block">{s.title}</span>
                  </span>
                </h3>
              </div>

              <p className="mt-4 max-w-xl text-muted-foreground">
                <span className="mask block overflow-hidden">
                  <span className="block">{s.description}</span>
                </span>
              </p>

              <span className="mt-8 block h-px w-20 bg-foreground" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
