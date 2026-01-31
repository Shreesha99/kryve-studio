"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ScrollHint } from "@/components/common/scroll-hint";
import { usePreloaderDone } from "@/components/common/app-providers";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// A single dot in the grid
class Dot {
  x: number;
  y: number;
  radius: number;
  originalRadius: number;
  color: string;
  targetRadius: number;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.originalRadius = radius;
    this.targetRadius = radius;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function ElysiumIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-auto", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M25 7H7V13H20V19H7V25H25"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// New Custom Cursor with Liquid Glass effect
// function CustomCursor({ isVisible }: { isVisible: boolean }) {
//   const cursorRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const cursor = cursorRef.current;
//     if (!cursor) return;

//     // Set initial position and properties
//     gsap.set(cursor, {
//       xPercent: -50,
//       yPercent: -50,
//       scale: 0,
//       opacity: 0,
//     });

//     const onMouseMove = (e: MouseEvent) => {
//       gsap.to(cursor, {
//         x: e.clientX,
//         y: e.clientY,
//         duration: 0.5,
//         ease: "power3.out",
//       });
//     };

//     const interactiveElements = document.querySelectorAll(
//       'button, a, [role="button"]'
//     );
//     const onEnterInteractive = () =>
//       gsap.to(cursor, { scale: 0, duration: 0.3, ease: "power3.out" });
//     const onLeaveInteractive = () =>
//       gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power3.out" });

//     if (isVisible) {
//       // Animate in
//       gsap.to(cursor, {
//         scale: 1,
//         opacity: 1,
//         duration: 0.4,
//         ease: "power3.out",
//       });

//       // Add listeners ONLY when visible
//       window.addEventListener("mousemove", onMouseMove);
//       interactiveElements.forEach((el) => {
//         el.addEventListener("mouseenter", onEnterInteractive);
//         el.addEventListener("mouseleave", onLeaveInteractive);
//       });
//     }

//     // Cleanup function: runs when isVisible becomes false or the component unmounts
//     return () => {
//       // Animate out
//       gsap.to(cursor, {
//         scale: 0,
//         opacity: 0,
//         duration: 0.4,
//         ease: "power3.out",
//       });

//       // Remove listeners to ensure no more tracking
//       window.removeEventListener("mousemove", onMouseMove);
//       interactiveElements.forEach((el) => {
//         el.removeEventListener("mouseenter", onEnterInteractive);
//         el.removeEventListener("mouseleave", onLeaveInteractive);
//       });
//     };
//   }, [isVisible]);

//   return (
//     <div
//       ref={cursorRef}
//       className="pointer-events-none fixed left-0 top-0 z-30 flex h-12 w-12 items-center justify-center"
//       style={{ willChange: "transform" }}
//     >
//       <div className="absolute inset-0 rounded-full border border-white/10 bg-white/10 backdrop-blur-sm transition-all duration-300"></div>
//       <ElysiumIcon className="relative h-6 w-6 text-foreground" />
//     </div>
//   );
// }

export function Hero() {
  const { preloaderDone } = usePreloaderDone();
  const [isReady, setIsReady] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null);
  const [isHeroInView, setIsHeroInView] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  // Refs for animation
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Refs for canvas animation
  const mousePos = useRef({ x: -9999, y: -9999 });
  const dots = useRef<Dot[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (preloaderDone) {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [preloaderDone]);

  useEffect(() => {
    if (!isReady) return;

    const tl = gsap.timeline({
      defaults: { duration: 1, ease: "power3.out" },
    });

    const titleSpans = gsap.utils.toArray("span", titleRef.current);

    tl.fromTo(
      titleSpans,
      { yPercent: 120 },
      { yPercent: 0, stagger: 0.15, duration: 1.2 }
    )
      .fromTo(
        paragraphRef.current,
        { y: 20, opacity: 0 },
        { opacity: 1, y: 0 },
        "-=0.8"
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { opacity: 1, y: 0 },
        "-=0.8"
      )
      .fromTo(
        hintRef.current,
        { y: 20, opacity: 0 },
        { opacity: 1, y: 0 },
        "-=0.8"
      );

    // This ScrollTrigger now correctly confines the cursor to the hero section
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "center top",

      onToggle: (self) => setIsHeroInView(self.isActive),
    });

    return () => {
      tl.kill();
      st.kill();
    };
  }, [isReady]);

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isTouchDevice === null) return;

    let localAnimationFrameId: number;

    const setupAndAnimate = () => {
      const isDark = resolvedTheme === "dark";
      const primaryColor = isDark
        ? "hsla(0, 0%, 100%, 0.5)"
        : "hsla(0, 0%, 0%, 0.5)";
      const mutedColor = isDark
        ? "hsla(0, 0%, 100%, 0.15)"
        : "hsla(0, 0%, 0%, 0.15)";

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      dots.current = [];
      const gap = 30;
      const dotRadius = 1;
      for (let x = gap / 2; x < rect.width; x += gap) {
        for (let y = gap / 2; y < rect.height; y += gap) {
          dots.current.push(new Dot(x, y, dotRadius, mutedColor));
        }
      }

      const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.current.forEach((dot) => {
          const dx = dot.x - mousePos.current.x;
          const dy = dot.y - mousePos.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 100;
          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            dot.targetRadius = dot.originalRadius + force * 3;
            dot.color = primaryColor;
          } else {
            dot.targetRadius = dot.originalRadius;
            dot.color = mutedColor;
          }

          dot.radius += (dot.targetRadius - dot.radius) * 0.1;
          dot.draw(ctx);
        });

        localAnimationFrameId = requestAnimationFrame(animate);
        animationFrameId.current = localAnimationFrameId;
      };

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animate();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -9999, y: -9999 };
    };

    const handleResize = () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      setupAndAnimate();
    };

    if (!isTouchDevice) {
      setupAndAnimate();
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [resolvedTheme, isTouchDevice]);

  return (
    <>
      <section
        id="home"
        ref={containerRef}
        className={cn(
          "relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background py-24 md:py-32 lg:py-0",
          { "opacity-0": !preloaderDone }
        )}
      >
        <canvas
          key={resolvedTheme} // Force re-mount on theme change to ensure clean state
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full"
        />

        {isReady && (
          <div className="container z-10 mx-auto px-4 text-center md:px-6">
            <div className="relative flex flex-col items-center justify-center">
              <h1
                ref={titleRef}
                className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-7xl"
              >
                <div className="overflow-hidden py-1">
                  <span className="inline-block">
                    Engineering{" "}
                    <span className="inline-block cursor-pointer rounded-full border border-foreground/50 bg-background/50 px-4 py-1 backdrop-blur-sm transition-colors duration-300 ease-in-out hover:bg-foreground hover:text-background">
                      Elegance
                    </span>
                    .
                  </span>
                </div>
                <div className="overflow-hidden py-1">
                  <span className="inline-block">
                    Designing{" "}
                    <span className="inline-block cursor-pointer rounded-full border border-foreground/50 bg-background/50 px-4 py-1 backdrop-blur-sm transition-colors duration-300 ease-in-out hover:bg-foreground hover:text-background">
                      Impact
                    </span>
                    .
                  </span>
                </div>
              </h1>

              <p
                ref={paragraphRef}
                className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground"
              >
                We are the architects of the digital frontier. A studio where
                visionary design and precision engineering are not just goals,
                but absolute standards. We craft high-performance web
                experiences that captivate users and create lasting market
                impact.
              </p>

              <div ref={ctaRef} className="mt-8 opacity-0">
                <Button size="lg" asChild>
                  <Link href="#work">Explore Our Work</Link>
                </Button>
              </div>

              <div ref={hintRef} className="mt-6 opacity-0">
                <Button
                  asChild
                  variant="ghost"
                  className="h-auto p-0 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Link href="/blog">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    <span>Psst! Check out our new AI tools on the blog.</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
        <ScrollHint scrollTo="#about" />
      </section>
      {/* {!isTouchDevice && preloaderDone && (
        <CustomCursor isVisible={isHeroInView} />
      )} */}
    </>
  );
}
