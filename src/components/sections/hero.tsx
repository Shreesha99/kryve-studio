"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MorphingSvg } from "@/components/common/morphing-svg";
import { AnimatedGradient } from "../common/animated-gradient";
import { ScrollHint } from "@/components/common/scroll-hint";
import { Sparkles } from "lucide-react";
import { usePreloaderDone } from "@/components/common/app-providers";
import { LogoStrip } from "@/components/common/logo-strip";

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme } = useTheme();
  const [isSvgReady, setIsSvgReady] = useState(false);
  const { preloaderDone } = usePreloaderDone();

  useLayoutEffect(() => {
    if (!preloaderDone) return;
    
    const ctx = gsap.context(() => {
      const headlineSpans = gsap.utils.toArray("span", headlineRef.current);

      // 🔒 Set initial state immediately
      gsap.set(paragraphRef.current, { opacity: 0, y: 20 });
      gsap.set(buttonRef.current, { opacity: 0, y: 20 });
      gsap.set(svgRef.current, { opacity: 0, y: 40, scale: 0.94 });
      gsap.set(hintRef.current, { opacity: 0, y: 20 });
      gsap.set(headlineSpans, { yPercent: 120 });

      // Animate in only after the preloader is done
      if (preloaderDone) {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out", duration: 1.2 },
        });

        tl.to(headlineSpans, {
          yPercent: 0,
          stagger: 0.1,
          ease: "power3.out",
        })
          .to(paragraphRef.current, { opacity: 1, y: 0 }, "-=0.8")
          .to(buttonRef.current, { opacity: 1, y: 0 }, "-=0.8")
          .to(
            svgRef.current,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "power3.out",
              onComplete: () => setIsSvgReady(true),
            },
            "-=0.9"
          )
          .to(hintRef.current, { opacity: 1, y: 0 }, "-=0.5");
      }
    });

    return () => ctx.revert();
  }, [preloaderDone]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-background py-24 md:py-32 lg:py-0"
    >
      <AnimatedGradient className="opacity-20 dark:opacity-10" />

      {/* Logo Strip in the background */}
      <div className="absolute inset-x-0 bottom-0 z-0">
        <LogoStrip />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="text-left">
            <h1
              ref={headlineRef}
              className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-7xl"
            >
              <div className="overflow-hidden py-1">
                <span className="inline-block">
                  Engineering{" "}
                  <span className="inline-block cursor-pointer rounded-full border border-foreground/50 px-4 py-1 transition-colors duration-300 ease-in-out hover:bg-foreground hover:text-background">
                    Elegance
                  </span>
                  .
                </span>
              </div>
              <div className="overflow-hidden py-1">
                <span className="inline-block">
                  Designing{" "}
                  <span className="inline-block cursor-pointer rounded-full border border-foreground/50 px-4 py-1 transition-colors duration-300 ease-in-out hover:bg-foreground hover:text-background">
                    Impact
                  </span>
                  .
                </span>
              </div>
            </h1>

            <p
              ref={paragraphRef}
              className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
            >
              We are a digital studio that blends visionary design with
              precision engineering to create web experiences that are not only
              beautiful, but brilliant.
            </p>

            <div ref={buttonRef} className="mt-8">
              <Button size="lg" asChild>
                <Link href="#work">Explore Our Work</Link>
              </Button>
            </div>

            <div ref={hintRef} className="mt-6">
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

          <div className="relative overflow-hidden">
            <div
              ref={svgRef}
              className="relative aspect-[4/3] w-full max-w-2xl justify-self-center overflow-hidden rounded-lg lg:max-w-none"
            >
              <MorphingSvg
                theme={resolvedTheme}
                isReadyToAnimate={isSvgReady}
              />
            </div>
          </div>
        </div>
      </div>

      <ScrollHint scrollTo="#about" />
    </section>
  );
}
