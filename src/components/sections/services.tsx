"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TextPlugin } from "gsap/dist/TextPlugin";
import { cn } from "@/lib/utils";
import { InteractiveOrbs } from "@/components/common/interactive-orbs";
import { AnimatedGradient } from "../common/animated-gradient";

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const services = [
  {
    id: "design",
    title: "Visual Craft",
    description:
      "We forge digital identities. Our design philosophy merges aesthetic intuition with data-driven strategy to build interfaces that are not only beautiful but deeply functional and unforgettable.",
    svg: (
      <>
        <path
          className="eye-outline"
          d="M150 100 C 200 25, 400 25, 450 100 C 400 175, 200 175, 150 100 Z"
        />
        <circle
          className="pupil"
          cx="300"
          cy="100"
          r="30"
          fill="hsl(var(--primary))"
          stroke="none"
        />
      </>
    ),
  },
  {
    id: "development",
    title: "Code Artistry",
    description:
      "Our code is clean, efficient, and built to last. We use cutting-edge technologies to engineer robust, scalable, and lightning-fast web experiences that perform flawlessly under pressure.",
    svg: (
      <>
        <path className="bracket" d="M220 50 L180 100 L220 150" />
        <path className="bracket" d="M380 50 L420 100 L380 150" />
        <text
          className="code-tag-text"
          x="300"
          y="110"
          textAnchor="middle"
          fontSize="24"
          fontFamily="monospace"
          stroke="none"
          fill="hsl(var(--primary))"
        ></text>
      </>
    ),
  },
  {
    id: "branding",
    title: "Identity & Strategy",
    description:
      "A brand is a story, a feeling, a promise. We help you define and articulate your unique identity, creating a cohesive brand world that resonates with your audience and stands the test of time.",
    svg: (
      <>
        <g className="target-group">
          <circle className="strategy-circle" cx="300" cy="100" r="80" />
          <circle className="strategy-circle" cx="300" cy="100" r="50" />
          <circle
            cx="300"
            cy="100"
            r="10"
            className="fill-primary pupil"
            stroke="none"
          />
          <g
            className="cracks"
            opacity="0"
            strokeWidth="1.5"
            transform="translate(300 100)"
          >
            <path d="M0 0 l-3 8" />
            <path d="M0 0 l-6 -5" />
            <path d="M0 0 l 7 3" />
            <path d="M0 0 l 5 -6" />
          </g>
        </g>
      </>
    ),
  },
  {
    id: "ecommerce",
    title: "Commerce Platforms",
    description:
      "We build powerful e-commerce engines designed for growth. From seamless user journeys to secure payment gateways, we create online stores that convert visitors into loyal customers.",
    svg: (
      <g className="cart-group" transform="translate(20 0) scale(1)">
        <g className="speed-lines-group" transform="translateX(-40)">
          <path className="speed-line" d="M150 80 L 180 80" opacity="0" />
          <path className="speed-line" d="M140 100 L 190 100" opacity="0" />
          <path className="speed-line" d="M150 120 L 180 120" opacity="0" />
        </g>
        <g className="cart-container">
          <g className="cart-body-group">
            <path
              className="cart-body"
              d="M230 150 L210 70 H 330 L 310 150 Z"
            />
          </g>
          <circle className="cart-wheel" cx="220" cy="170" r="15" />
          <circle className="cart-wheel" cx="320" cy="170" r="15" />
        </g>
      </g>
    ),
  },
];

const AUTOPLAY_DURATION = 10; // seconds

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const progressTl = useRef<gsap.core.Timeline>();
  const secondaryAnimation = useRef<gsap.core.Timeline | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  useEffect(() => {
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none none",
      },
    });

    if (titleRef.current) {
      const titleSpans = gsap.utils.toArray("span", titleRef.current);
      contentTl.fromTo(
        titleSpans,
        { yPercent: 120 },
        { yPercent: 0, stagger: 0.1, duration: 1.2, ease: "power3.out" }
      );
    }
    return () => {
      contentTl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const runAutoplay = useCallback((index: number) => {
    progressTl.current?.kill();
    const progressBars = gsap.utils.toArray<HTMLDivElement>(
      ".progress-bar-fill",
      sectionRef.current
    );
    gsap.set(progressBars, { scaleY: 0, transformOrigin: "bottom" });

    progressTl.current = gsap
      .timeline({
        onComplete: () => {
          const nextIndex = (index + 1) % services.length;
          setActiveIndex(nextIndex);
        },
      })
      .to(progressBars[index], {
        scaleY: 1,
        duration: AUTOPLAY_DURATION,
        ease: "linear",
      });
  }, []);

  useEffect(() => {
    secondaryAnimation.current?.kill();
    gsap.killTweensOf(".code-tag-text");

    if (!isHovering && !isTouchDevice) {
      runAutoplay(activeIndex);
    } else {
      progressTl.current?.pause();
    }

    if (isTouchDevice && isHovering) {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        setIsHovering(false);
        runAutoplay(activeIndex);
      }, 10000);
    }

    if (isHovering && resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-description",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      const allSvgs = gsap.utils.toArray<SVGSVGElement>(
        "svg.service-svg",
        sectionRef.current
      );
      const activeSvg = allSvgs.find(
        (svg) => svg.id === `svg-${services[activeIndex].id}`
      );

      gsap.to(allSvgs, { autoAlpha: 0, duration: 0.4 });

      if (activeSvg) {
        const mainDrawTl = gsap.timeline({
          onComplete: () => {
            secondaryAnimation.current?.kill();
            gsap.killTweensOf(".code-tag-text");
            secondaryAnimation.current = gsap.timeline({
              repeat: -1,
              repeatDelay: 1,
            });

            const currentService = services[activeIndex];

            if (currentService.id === "design") {
              const blinkTl = gsap.timeline({
                repeat: 1,
                yoyo: true,
                repeatDelay: 0.15,
              });
              blinkTl.to(
                [
                  activeSvg.querySelector(".eye-outline"),
                  activeSvg.querySelector(".pupil"),
                ],
                {
                  scaleY: 0.05,
                  duration: 0.1,
                  transformOrigin: "center",
                  ease: "power2.inOut",
                }
              );
              secondaryAnimation.current.add(blinkTl, "+=1.0");
            }

            if (currentService.id === "branding") {
              const cracks = activeSvg.querySelector(".cracks");
              secondaryAnimation.current.fromTo(
                cracks,
                { autoAlpha: 0, scale: 0.5, transformOrigin: "center center" },
                {
                  autoAlpha: 1,
                  scale: 1,
                  duration: 0.3,
                  ease: "power2.out",
                  delay: 0.2,
                }
              );
            }

            if (currentService.id === "development") {
              const textEl = activeSvg.querySelector(".code-tag-text");
              if (!textEl) return;

              const tags = ["a", "p", "h1", "div"];
              let index = 0;

              // set visual state ONCE
              gsap.set(textEl, {
                text: tags[0],
                autoAlpha: 1,
                scale: 2,
                transformOrigin: "center",
              });

              const textTl = gsap.timeline({ repeat: -1 });

              textTl
                .to(
                  textEl,
                  { autoAlpha: 0, duration: 0.3, ease: "power1.in" },
                  "+=1.4"
                )
                .call(() => {
                  index = (index + 1) % tags.length;
                  textEl.textContent = tags[index];
                })
                .to(textEl, {
                  autoAlpha: 1,
                  duration: 0.3,
                  ease: "power1.out",
                });

              secondaryAnimation.current.add(textTl, 0);
            }

            if (currentService.id === "ecommerce") {
              const cartBody = activeSvg.querySelector(".cart-body-group");
              const speedLines = activeSvg.querySelectorAll(".speed-line");

              const bounceTl = gsap.timeline({ repeat: -1, yoyo: true });
              bounceTl.to(cartBody, {
                y: -3,
                duration: 0.2,
                ease: "power1.inOut",
              });

              const speedLinesTl = gsap.timeline({ repeat: -1 });
              speedLinesTl.fromTo(
                speedLines,
                { x: 0, opacity: 1 },
                {
                  x: -30,
                  opacity: 0,
                  duration: 0.6,
                  ease: "power2.out",
                  stagger: 0.15,
                }
              );
              secondaryAnimation.current.add(bounceTl, 0).add(speedLinesTl, 0);
            }
          },
        });

        mainDrawTl.fromTo(
          activeSvg,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4 }
        );

        const paths = gsap.utils.toArray<SVGPathElement>(
          ".bracket, .eye-outline, .cart-body",
          activeSvg
        );
        if (paths.length > 0) {
          mainDrawTl.fromTo(
            paths,
            {
              strokeDasharray: (i, el) => el.getTotalLength(),
              strokeDashoffset: (i, el) => el.getTotalLength(),
            },
            {
              strokeDashoffset: 0,
              duration: 1,
              ease: "power2.inOut",
              stagger: 0.2,
            },
            "<"
          );
        }
        const circles = gsap.utils.toArray<SVGCircleElement>(
          ".pupil, .strategy-circle, .cart-wheel",
          activeSvg
        );
        if (circles.length > 0) {
          mainDrawTl.fromTo(
            circles,
            { scale: 0, transformOrigin: "center" },
            {
              scale: 1,
              stagger: 0.15,
              duration: 0.8,
              ease: "elastic.out(1, 0.6)",
            },
            "<0.2"
          );
        }
      }
    }, sectionRef);
    return () => {
      ctx.revert();
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, [activeIndex, isHovering, runAutoplay, isTouchDevice]);

  const handleTap = (index: number) => {
    if (!isTouchDevice) return;

    if (index === activeIndex && isHovering) return;

    progressTl.current?.pause();
    setIsHovering(true); // use isHovering state to signify a manual tap

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setIsHovering(false);
      runAutoplay(index);
    }, 10000);

    setActiveIndex(index);
  };

  const handleMouseEnter = (index: number) => {
    if (isTouchDevice) return;
    setIsHovering(true);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setIsHovering(false);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-background py-24 md:py-32"
    >
      <AnimatedGradient className="opacity-10 dark:opacity-5" />
      <InteractiveOrbs />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-8">
            <h2
              ref={titleRef}
              className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              <div className="overflow-hidden py-1">
                <span className="inline-block">Anatomy of Excellence</span>
              </div>
            </h2>

            <ul
              className="border-t border-border"
              onMouseLeave={handleMouseLeave}
            >
              {services.map((service, index) => (
                <li
                  key={service.id}
                  className="relative border-b border-border"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={() => handleTap(index)}
                >
                  <div className="absolute left-0 top-0 h-full w-px bg-border/30">
                    <div className="progress-bar-fill h-full w-full scale-y-0 bg-primary" />
                  </div>
                  <div
                    className={cn(
                      "group flex w-full cursor-pointer items-center justify-between py-8 pl-6 text-left transition-colors duration-300"
                    )}
                  >
                    <h3
                      className={cn(
                        "font-headline text-3xl font-medium sm:text-4xl transition-colors",
                        activeIndex === index
                          ? "text-primary"
                          : "text-foreground/60 group-hover:text-foreground"
                      )}
                    >
                      {service.title}
                    </h3>
                    <span
                      className={cn(
                        "material-symbols-outlined text-4xl text-primary transition-all duration-500 ease-in-out",
                        activeIndex === index
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-4 opacity-0"
                      )}
                    >
                      arrow_right_alt
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex w-full flex-col lg:min-h-[30rem]">
            <div className="relative flex h-64 w-full items-center justify-center p-8 lg:h-1/2 lg:flex-grow">
              {services.map((service) => (
                <svg
                  key={service.id}
                  id={`svg-${service.id}`}
                  viewBox="0 0 600 200"
                  className="service-svg absolute h-full w-full opacity-0"
                  preserveAspectRatio="xMidYMid meet"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {service.svg}
                </svg>
              ))}
            </div>
            <div className="relative flex h-48 w-full items-center justify-center p-4">
              <p className="service-description relative z-10 max-w-md text-center text-lg text-muted-foreground">
                {services[activeIndex].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
