"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { gsap } from "gsap";

interface MorphingSvgProps {
  theme?: string;
  isReadyToAnimate: boolean;
}

export function MorphingSvg({ theme, isReadyToAnimate }: MorphingSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mainGroupRef = useRef<SVGGElement>(null);
  const scrollGroupRef = useRef<SVGGElement>(null);
  const backgroundRectRef = useRef<SVGRectElement>(null);

  const navUiRef = useRef<SVGGElement>(null);
  const heroUiRef = useRef<SVGGElement>(null);
  const aboutUiRef = useRef<SVGGElement>(null);
  const servicesUiRef = useRef<SVGGElement>(null);
  const projectsUiRef = useRef<SVGGElement>(null);
  const contactUiRef = useRef<SVGGElement>(null);
  const footerUiRef = useRef<SVGGElement>(null);

  const processUiRef = useRef<SVGGElement>(null);
  const processLine1Ref = useRef<SVGPathElement>(null);
  const processLine2Ref = useRef<SVGPathElement>(null);
  const processLine3Ref = useRef<SVGPathElement>(null);

  const sunIconRef = useRef<SVGGElement>(null);
  const moonIconRef = useRef<SVGGElement>(null);
  const heroHeadlineRef = useRef<SVGTextElement>(null);
  const heroSubtitleRef = useRef<SVGTextElement>(null);
  const servicesLinkRef = useRef<SVGTextElement>(null);
  const logoTextRef = useRef<SVGTextElement>(null);
  const contactMessageRef = useRef<SVGTextElement>(null);
  const contactCursorRef = useRef<SVGPathElement>(null);

  const masterTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isReadyToAnimate) {
      return;
    }

    const svg = svgRef.current;
    if (!svg) return;

    if (masterTlRef.current) {
      masterTlRef.current.kill();
    }

    const uis = [
      navUiRef,
      heroUiRef,
      aboutUiRef,
      servicesUiRef,
      projectsUiRef,
      processUiRef,
      contactUiRef,
      footerUiRef,
    ];

    const colors = {
      light: {
        bg: "hsl(0 0% 100%)",
        uiBg: "hsl(240 4.8% 95.9%)",
        uiStroke: "hsl(240 5.9% 90%)",
        uiFillMuted: "hsl(240 3.8% 46.1%)",
        uiFillPrimary: "hsl(240 10% 3.9%)",
        uiTextMuted: "hsl(240 3.8% 46.1%)",
        primary: "hsl(240 10% 3.9%)",
        primaryForeground: "hsl(0 0% 98%)",
      },
      dark: {
        bg: "hsl(240 10% 3.9%)",
        uiBg: "hsl(240 3.7% 15.9%)",
        uiStroke: "hsl(240 3.7% 15.9%)",
        uiFillMuted: "hsl(240 5% 64.9%)",
        uiFillPrimary: "hsl(0 0% 98%)",
        uiTextMuted: "hsl(240 5% 64.9%)",
        primary: "hsl(0 0% 98%)",
        primaryForeground: "hsl(240 5.9% 10%)",
      },
    };

    const masterTl = gsap.timeline();
    masterTlRef.current = masterTl;

    masterTl.eventCallback("onComplete", () => {
      if (!masterTlRef.current) return;
      const allUiElements = uis.map((r) => r.current).filter(Boolean);

      // Create a new timeline to animate the reset
      gsap
        .timeline({
          onComplete: () => {
            masterTlRef.current?.restart();
          },
        })
        .to(
          allUiElements,
          { autoAlpha: 0, duration: 0.7, ease: "power2.in" },
          0
        )
        .to(
          scrollGroupRef.current,
          { y: 0, duration: 1, ease: "power2.in" },
          0
        );
    });

    const setup = () => {
      const allUiElements = uis.map((r) => r.current).filter(Boolean);
      gsap.set(svg, { autoAlpha: 1 });
      gsap.set(allUiElements, { autoAlpha: 0 });
      if (scrollGroupRef.current) gsap.set(scrollGroupRef.current, { y: 0 });

      if (heroHeadlineRef.current) heroHeadlineRef.current.textContent = "";
      if (heroSubtitleRef.current) heroSubtitleRef.current.textContent = "";
      if (contactMessageRef.current) contactMessageRef.current.textContent = "";
      if (contactCursorRef.current)
        gsap.set(contactCursorRef.current, { autoAlpha: 0 });

      gsap.set(svg.querySelectorAll(".service-desc-group"), { autoAlpha: 0 });
      gsap.set(svg.querySelectorAll(".project-detail"), { autoAlpha: 0 });
      gsap.set(svg.querySelectorAll(".process-step"), { autoAlpha: 0 });

      const processLines = [processLine1Ref, processLine2Ref, processLine3Ref];
      processLines.forEach((lineRef) => {
        if (lineRef.current) {
          const length = lineRef.current.getTotalLength();
          gsap.set(lineRef.current, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        }
      });

      const startThemeKey = theme === "dark" ? "dark" : "light";
      const startTheme = colors[startThemeKey];

      gsap.set(backgroundRectRef.current, {
        fill: startTheme.bg,
        stroke: startTheme.uiStroke,
      });
      gsap.set(svg.querySelectorAll(".ui-bg"), { fill: startTheme.uiBg });
      gsap.set(svg.querySelectorAll(".ui-stroke"), {
        stroke: startTheme.uiStroke,
      });
      gsap.set(svg.querySelectorAll(".ui-fill-muted"), {
        fill: startTheme.uiFillMuted,
      });
      gsap.set(svg.querySelectorAll(".ui-fill-primary"), {
        fill: startTheme.uiFillPrimary,
      });
      gsap.set(svg.querySelectorAll(".ui-text-muted"), {
        fill: startTheme.uiTextMuted,
      });
      gsap.set(svg.querySelectorAll(".ui-primary-stroke"), {
        stroke: startTheme.uiFillPrimary,
      });
      gsap.set(svg.querySelectorAll(".contact-button-text"), {
        fill: startTheme.primaryForeground,
      });
      if (logoTextRef.current) {
        gsap.set(logoTextRef.current, { fill: startTheme.primary });
      }

      if (sunIconRef.current && moonIconRef.current) {
        if (startThemeKey === "dark") {
          gsap.set(sunIconRef.current, {
            autoAlpha: 0,
            scale: 0,
            rotation: -90,
          });
          gsap.set(moonIconRef.current, {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
          });
        } else {
          gsap.set(sunIconRef.current, { autoAlpha: 1, scale: 1, rotation: 0 });
          gsap.set(moonIconRef.current, {
            autoAlpha: 0,
            scale: 0,
            rotation: 90,
          });
        }
      }
    };

    const animateSection = (uiRef: React.RefObject<SVGGElement>) => {
      const tl = gsap.timeline();
      if (uiRef.current) {
        tl.to(uiRef.current, { autoAlpha: 1, duration: 0.1 });
      }
      return tl;
    };

    const headlineText = "ARTISTRY MEETS ARCHITECTURE";
    const subtitleText = "Crafting unique digital experiences.";

    const typeText = (
      ref: React.RefObject<SVGTextElement>,
      text: string,
      duration: number
    ) => {
      const tl = gsap.timeline();
      if (!ref.current) return tl;
      const temp = { i: 0 };
      tl.to(temp, {
        i: text.length,
        duration: duration,
        ease: `steps(${text.length})`,
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = text.substring(0, Math.ceil(temp.i));
          }
        },
      });
      return tl;
    };

    const toggleTl = gsap.timeline();
    const startTheme = theme === "dark" ? "dark" : "light";
    const targetTheme = startTheme === "dark" ? "light" : "dark";
    const toColors = colors[targetTheme];

    if (sunIconRef.current && moonIconRef.current) {
      const sunState = { scale: 1, rotation: 0, autoAlpha: 1 };
      const moonState = { scale: 0, rotation: -90, autoAlpha: 0 };
      if (startTheme === "dark") {
        [sunState.scale, moonState.scale] = [moonState.scale, sunState.scale];
        [sunState.rotation, moonState.rotation] = [
          moonState.rotation,
          sunState.rotation,
        ];
        [sunState.autoAlpha, moonState.autoAlpha] = [
          moonState.autoAlpha,
          sunState.autoAlpha,
        ];
      }
      toggleTl
        .to(sunIconRef.current, {
          scale: moonState.scale,
          rotation: moonState.rotation,
          autoAlpha: moonState.autoAlpha,
          ease: "power2.in",
          duration: 0.5,
        })
        .to(
          moonIconRef.current,
          {
            scale: sunState.scale,
            rotation: sunState.rotation,
            autoAlpha: sunState.autoAlpha,
            ease: "power2.out",
            duration: 0.5,
          },
          ">-0.4"
        );
    }

    toggleTl
      .to(
        backgroundRectRef.current,
        { fill: toColors.bg, stroke: toColors.uiStroke, duration: 0.8 },
        "<"
      )
      .to(
        svg.querySelectorAll(".ui-bg"),
        { fill: toColors.uiBg, duration: 0.8 },
        "<"
      )
      .to(
        svg.querySelectorAll(".ui-stroke"),
        { stroke: toColors.uiStroke, duration: 0.8 },
        "<"
      )
      .to(
        svg.querySelectorAll(".ui-fill-muted"),
        { fill: toColors.uiFillMuted, duration: 0.8 },
        "<"
      )
      .to(
        svg.querySelectorAll(".ui-fill-primary"),
        { fill: toColors.uiFillPrimary, duration: 0.8 },
        "<"
      )
      .to(
        svg.querySelectorAll(".ui-text-muted"),
        { fill: toColors.uiTextMuted, duration: 0.8 },
        "<"
      )
      .to(
        svg.querySelectorAll(".ui-primary-stroke"),
        { stroke: toColors.uiFillPrimary, duration: 0.8 },
        "<"
      )
      .to(
        svg.querySelectorAll(".contact-button-text"),
        { fill: toColors.primaryForeground, duration: 0.8 },
        "<"
      );

    if (logoTextRef.current) {
      toggleTl.to(
        logoTextRef.current,
        { fill: toColors.primary, duration: 0.8 },
        "<"
      );
    }

    const contactTypingTl = gsap.timeline();
    if (contactMessageRef.current && contactCursorRef.current) {
      contactTypingTl
        .set(contactMessageRef.current, { textContent: "" })
        .set(contactCursorRef.current, { autoAlpha: 1 })
        .to(contactCursorRef.current, {
          autoAlpha: 0,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          ease: "steps(1)",
        })
        .add(typeText(contactMessageRef, "Hello!", 0.8))
        .set(contactCursorRef.current, { autoAlpha: 0 });
    }

    const processAnimationTl = gsap.timeline();
    if (processUiRef.current) {
      const steps = gsap.utils.toArray(".process-step", processUiRef.current);
      const lines = [
        processLine1Ref.current,
        processLine2Ref.current,
        processLine3Ref.current,
      ];
      processAnimationTl.to(steps, {
        autoAlpha: 1,
        stagger: 0.8,
        duration: 0.4,
      });
      lines.forEach((line, index) => {
        if (line) {
          processAnimationTl.to(
            line,
            { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" },
            `<${index * 0.8 + 0.4}`
          );
        }
      });
    }

    const servicesClickTl = gsap.timeline();
    if (servicesLinkRef.current) {
      const activeColor = toColors.uiFillPrimary;
      servicesClickTl
        .to(servicesLinkRef.current, { fill: activeColor, duration: 0.2 })
        .to(servicesLinkRef.current, {
          scale: 1.05,
          transformOrigin: "center middle",
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        });
    }

    // --- MASTER TIMELINE ---
    masterTl.add(setup);
    masterTl.add(animateSection(navUiRef), "+=0.5");
    masterTl.add(animateSection(heroUiRef), "+=0.2");
    masterTl.add(typeText(heroHeadlineRef, headlineText, 1.2), "+=0.3");
    masterTl.add(typeText(heroSubtitleRef, subtitleText, 1.2), "+=0.2");

    // Animate About section
    if (aboutUiRef.current) {
      masterTl.fromTo(
        aboutUiRef.current,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "+=1.0"
      );
    }

    masterTl.add(toggleTl, "+=1.2");

    const sequenceTl = gsap.timeline();
    sequenceTl
      .add(animateSection(servicesUiRef), "+=0.2")
      .add(animateSection(projectsUiRef), ">-0.4")
      .add(animateSection(processUiRef), ">-0.2")
      .add(animateSection(contactUiRef), ">-0.2");

    masterTl.add(sequenceTl, ">-0.5");

    masterTl.add(processAnimationTl, ">-1.5");

    masterTl.fromTo(
      svg.querySelectorAll(".project-detail"),
      { autoAlpha: 0, y: 10 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.3,
        ease: "power2.out",
        duration: 0.6,
      },
      ">-4.0"
    );

    masterTl.addLabel("interact", "+=0.5");
    masterTl.add(servicesClickTl, "interact");

    if (scrollGroupRef.current) {
      masterTl.to(
        scrollGroupRef.current,
        { y: -300, duration: 2.5, ease: "power3.inOut" },
        "interact+=0.2"
      );
      masterTl.fromTo(
        svg.querySelectorAll(".service-desc-group"),
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.2,
          ease: "power2.out",
          duration: 0.6,
        },
        ">-1.8"
      );
    }

    masterTl.add(contactTypingTl, "+=1.0");
    masterTl.add(animateSection(footerUiRef), "+=1.0");

    masterTl.to({}, { duration: 2.0 });

    return () => {
      if (masterTlRef.current) {
        masterTlRef.current.kill();
      }
    };
  }, [isReadyToAnimate]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMin slice"
      className="h-full w-full"
    >
      <defs>
        <style>
          {`
            .logo-text { font-family: Poppins, sans-serif; font-size: 12px; font-weight: bold; }
            .hero-headline { font-family: Poppins, sans-serif; font-size: 16px; font-weight: 600; letter-spacing: -0.5px; text-anchor: middle; }
            .hero-subtitle { font-size: 9px; text-anchor: middle; }
            .nav-link { font-size: 9px; text-anchor: middle; cursor: pointer; }
            .about-title { font-size: 12px; font-weight: 600; }
            .about-text { font-size: 9px; }
            .service-title { font-size: 9px; font-weight: 600; }
            .service-desc { font-size: 8px; }
            .project-title { font-size: 10px; font-weight: 600; }
            .project-desc { font-size: 8px; }
            .process-title { font-size: 9px; font-weight: 600; text-anchor: middle; }
            .contact-title { font-size: 12px; font-weight: 600; text-anchor: middle; }
            .contact-field-text { font-size: 9px; }
            .contact-button-text { font-size: 9px; font-weight: 600; text-anchor: middle; }
            .footer-title { font-size: 9px; text-anchor: middle; }
          `}
        </style>
        <clipPath id="mainClip">
          <rect x="20" y="20" width="560" height="360" rx="10" />
        </clipPath>
      </defs>

      <rect
        ref={backgroundRectRef}
        x="20"
        y="20"
        width="560"
        height="360"
        rx="10"
        strokeWidth="1"
      />

      <g ref={mainGroupRef} clipPath="url(#mainClip)">
        <g ref={scrollGroupRef}>
          {/* --- Hero --- */}
          <g transform="translate(300, 150)">
            <g ref={heroUiRef}>
              <text
                ref={heroHeadlineRef}
                y="0"
                className="hero-headline ui-fill-primary"
              ></text>
              <text
                ref={heroSubtitleRef}
                y="20"
                className="hero-subtitle ui-text-muted"
              ></text>
            </g>
          </g>

          {/* --- About --- */}
          <g transform="translate(300, 300)">
            <g ref={aboutUiRef}>
              <rect
                x="-190"
                y="-40"
                width="140"
                height="100"
                rx="5"
                className="ui-bg ui-stroke"
                strokeWidth="1"
              />
              <rect
                x="-180"
                y="-25"
                width="120"
                height="60"
                rx="3"
                className="ui-fill-muted"
                opacity="0.2"
              />
              <path
                d="M -165 -10 l 15 15 l 20 -10"
                strokeWidth="2"
                fill="none"
                className="ui-fill-muted"
                opacity="0.5"
              />
              <text x="-20" y="-30" className="about-title ui-fill-primary">
                Our Philosophy
              </text>
              <text x="-20" y="-10" className="about-text ui-text-muted">
                We believe in design that solves
              </text>
              <text x="-20" y="2" className="about-text ui-text-muted">
                problems and code that feels
              </text>
              <text x="-20" y="14" className="about-text ui-text-muted">
                like magic.
              </text>
            </g>
          </g>

          {/* --- Services --- */}
          <g transform="translate(300, 450)">
            <g ref={servicesUiRef}>
              <g className="service-card" transform="translate(-160, 0)">
                <rect
                  x="-70"
                  y="-40"
                  width="140"
                  height="90"
                  rx="5"
                  className="ui-bg ui-stroke"
                  strokeWidth="1"
                />
                <path
                  d="M -57 -28 l -3 3 h 26 l -3 -3 M -44 -28 v -5 M -44 -18 v -5"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="ui-primary-stroke"
                  transform="scale(0.6) translate(-45, -35)"
                />
                <text x="-60" y="-5" className="service-title ui-fill-primary">
                  Web Design
                </text>
                <g className="service-desc-group">
                  <text x="-60" y="10" className="service-desc ui-text-muted">
                    Visually stunning
                  </text>
                  <text x="-60" y="20" className="service-desc ui-text-muted">
                    interfaces.
                  </text>
                </g>
              </g>
              <g className="service-card" transform="translate(0, 0)">
                <rect
                  x="-70"
                  y="-40"
                  width="140"
                  height="90"
                  rx="5"
                  className="ui-bg ui-stroke"
                  strokeWidth="1"
                />
                <path
                  d="M-52 -25 l-8 5 l8 5 M-44 -25 l8 5 l-8 5"
                  fill="none"
                  className="ui-primary-stroke"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  transform="scale(0.6) translate(-45, -32)"
                />
                <text x="-60" y="-5" className="service-title ui-fill-primary">
                  Development
                </text>
                <g className="service-desc-group">
                  <text x="-60" y="10" className="service-desc ui-text-muted">
                    Robust & Scalable
                  </text>
                  <text x="-60" y="20" className="service-desc ui-text-muted">
                    solutions.
                  </text>
                </g>
              </g>
              <g className="service-card" transform="translate(160, 0)">
                <rect
                  x="-70"
                  y="-40"
                  width="140"
                  height="90"
                  rx="5"
                  className="ui-bg ui-stroke"
                  strokeWidth="1"
                />
                <path
                  d="M-52 -22 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M-44 -22 l0 -8 l8 4 z"
                  fill="none"
                  className="ui-primary-stroke"
                  strokeWidth="1.2"
                  transform="scale(0.6) translate(-45, -32)"
                />
                <text x="-60" y="-5" className="service-title ui-fill-primary">
                  Branding
                </text>
                <g className="service-desc-group">
                  <text x="-60" y="10" className="service-desc ui-text-muted">
                    Unique brand
                  </text>
                  <text x="-60" y="20" className="service-desc ui-text-muted">
                    identities.
                  </text>
                </g>
              </g>
            </g>
          </g>

          {/* --- Projects --- */}
          <g transform="translate(300, 620)">
            <g ref={projectsUiRef}>
              <rect
                x="-225"
                y="-50"
                width="210"
                height="120"
                rx="5"
                className="ui-bg ui-stroke"
                strokeWidth="1"
              />
              <g className="project-detail">
                <rect
                  x="-215"
                  y="-38"
                  width="80"
                  height="95"
                  rx="3"
                  className="ui-fill-muted"
                  opacity="0.2"
                />
                <path
                  d="M -200 -20 l 15 20 l 25 -15"
                  strokeWidth="2"
                  fill="none"
                  className="ui-fill-muted"
                  opacity="0.5"
                />
                <text
                  x="-125"
                  y="-25"
                  className="project-title ui-fill-primary"
                >
                  Project One
                </text>
                <text x="-125" y="-10" className="project-desc ui-text-muted">
                  E-commerce platform
                </text>
              </g>
              <rect
                x="15"
                y="-50"
                width="210"
                height="120"
                rx="5"
                className="ui-bg ui-stroke"
                strokeWidth="1"
              />
              <g className="project-detail">
                <rect
                  x="25"
                  y="-38"
                  width="80"
                  height="95"
                  rx="3"
                  className="ui-fill-muted"
                  opacity="0.2"
                />
                <path
                  d="M 40 -20 l 15 20 l 25 -15"
                  strokeWidth="2"
                  fill="none"
                  className="ui-fill-muted"
                  opacity="0.5"
                />
                <text x="115" y="-25" className="project-title ui-fill-primary">
                  Project Two
                </text>
                <text x="115" y="-10" className="project-desc ui-text-muted">
                  Mobile application
                </text>
              </g>
            </g>
          </g>

          {/* --- Process --- */}
          <g transform="translate(300, 800)">
            <g ref={processUiRef}>
              <path
                ref={processLine1Ref}
                d="M -150 0 H -50"
                fill="none"
                className="ui-primary-stroke"
                strokeWidth="1.5"
              />
              <path
                ref={processLine2Ref}
                d="M -25 0 H 75"
                fill="none"
                className="ui-primary-stroke"
                strokeWidth="1.5"
              />
              <path
                ref={processLine3Ref}
                d="M 100 0 H 200"
                fill="none"
                className="ui-primary-stroke"
                strokeWidth="1.5"
              />
              <g className="process-step" transform="translate(-200, 0)">
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  className="ui-bg ui-stroke"
                  strokeWidth="1"
                />
                <text
                  textAnchor="middle"
                  y="4"
                  className="ui-fill-primary"
                  fontSize="12"
                >
                  1
                </text>
                <text
                  textAnchor="middle"
                  y="25"
                  className="process-title ui-fill-primary"
                >
                  Discover
                </text>
              </g>
              <g className="process-step" transform="translate(-100, 0)">
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  className="ui-bg ui-stroke"
                  strokeWidth="1"
                />
                <text
                  textAnchor="middle"
                  y="4"
                  className="ui-fill-primary"
                  fontSize="12"
                >
                  2
                </text>
                <text
                  textAnchor="middle"
                  y="25"
                  className="process-title ui-fill-primary"
                >
                  Design
                </text>
              </g>
              <g className="process-step" transform="translate(25, 0)">
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  className="ui-bg ui-stroke"
                  strokeWidth="1"
                />
                <text
                  textAnchor="middle"
                  y="4"
                  className="ui-fill-primary"
                  fontSize="12"
                >
                  3
                </text>
                <text
                  textAnchor="middle"
                  y="25"
                  className="process-title ui-fill-primary"
                >
                  Develop
                </text>
              </g>
              <g className="process-step" transform="translate(150, 0)">
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  className="ui-bg ui-stroke"
                  strokeWidth="1"
                />
                <text
                  textAnchor="middle"
                  y="4"
                  className="ui-fill-primary"
                  fontSize="12"
                >
                  4
                </text>
                <text
                  textAnchor="middle"
                  y="25"
                  className="process-title ui-fill-primary"
                >
                  Deploy
                </text>
              </g>
            </g>
          </g>

          {/* --- Contact --- */}
          <g transform="translate(300, 960)">
            <g ref={contactUiRef}>
              <text y="-35" className="contact-title ui-fill-primary">
                Let's build together.
              </text>
              <rect
                x="-150"
                y="-15"
                width="145"
                height="25"
                rx="4"
                className="ui-bg ui-stroke"
                strokeWidth="1"
              />
              <text x="-140" y="2" className="contact-field-text ui-text-muted">
                Your Name
              </text>
              <rect
                x="5"
                y="-15"
                width="145"
                height="25"
                rx="4"
                className="ui-bg ui-stroke"
                strokeWidth="1"
              />
              <text x="15" y="2" className="contact-field-text ui-text-muted">
                Your Email
              </text>
              <rect
                x="-150"
                y="20"
                width="300"
                height="40"
                rx="4"
                className="ui-bg ui-stroke"
                strokeWidth="1"
              />
              <text
                ref={contactMessageRef}
                x="-140"
                y="38"
                className="contact-field-text ui-text-muted"
              ></text>
              <path
                ref={contactCursorRef}
                d="M -135 30 v 10"
                strokeWidth="1.2"
                className="ui-primary-stroke"
              />
              <rect
                x="-100"
                y="75"
                width="200"
                height="30"
                rx="5"
                className="ui-fill-primary"
              />
              <text x="0" y="94" className="contact-button-text">
                Send Message
              </text>
            </g>
          </g>

          {/* --- SCROLLING Footer --- */}
          <g ref={footerUiRef} transform="translate(300, 1150)">
            <text x="0" y="5" className="footer-title ui-text-muted">
              &copy; 2024. All rights reserved.
            </text>
          </g>
        </g>
        {/* --- FIXED Navbar --- */}
        <g ref={navUiRef} transform="translate(45, 35)">
          <rect x="0" y="0" width="510" height="30" className="ui-bg" />
          <text ref={logoTextRef} x="15" y="21" className="logo-text">
            ZENITH
          </text>
          <text x="205" y="20.5" className="nav-link ui-text-muted">
            About
          </text>
          <text
            ref={servicesLinkRef}
            x="275"
            y="20.5"
            className="nav-link ui-text-muted"
          >
            Services
          </text>
          <text x="345" y="20.5" className="nav-link ui-text-muted">
            Work
          </text>
          <g transform="translate(480, 8)" style={{ cursor: "pointer" }}>
            <g ref={sunIconRef}>
              <circle
                cx="7"
                cy="7"
                r="2.5"
                fill="none"
                className="ui-primary-stroke"
                strokeWidth="1.2"
              />
              <path
                d="M7 1V3 M7 11V13 M2.64 2.64L3.35 3.35 M10.65 10.65L11.36 11.36 M1 7H3 M11 7H13 M2.64 11.36L3.35 10.65 M10.65 3.35L11.36 2.64"
                className="ui-primary-stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
            <g ref={moonIconRef}>
              <path
                d="M10 2.5 A5.5 5.5 0 0 1 2.5 10 A4 4 0 0 0 10 2.5z"
                className="ui-fill-primary"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
