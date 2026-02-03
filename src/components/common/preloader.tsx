"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type PreloaderProps = {
  onAnimationComplete?: () => void;
};

export default function Preloader({ onAnimationComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const [visible, setVisible] = useState(true);
  const [invertTheme, setInvertTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // detect page theme and INVERT it
    const isDarkPage = document.documentElement.classList.contains("dark");
    setInvertTheme(isDarkPage ? "light" : "dark");
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(
        text.querySelectorAll("span")
      );

      gsap.set(container, { visibility: "visible" });
      gsap.set(words, { yPercent: 120 });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      tl.to(words, {
        yPercent: 0,
        stagger: 0.12,
        duration: 1.1,
      })
        .to(container, {
          y: "-100%",
          duration: 1.2,
          ease: "power4.inOut",
          delay: 0.4,
        })
        .add(() => {
          setVisible(false);
          onAnimationComplete?.();
        });
    }, container);

    return () => ctx.revert();
  }, [onAnimationComplete]);

  if (!visible) return null;

  const themeClasses =
    invertTheme === "light" ? "bg-white text-black" : "bg-black text-white";

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${themeClasses}`}
      style={{ visibility: "hidden" }}
    >
      <h1
        ref={textRef}
        className="font-headline text-3xl md:text-5xl font-semibold tracking-tight"
      >
        <div className="overflow-hidden">
          <span className="inline-block">We</span>
        </div>
        <div className="overflow-hidden">
          <span className="inline-block">Build</span>
        </div>
        <div className="overflow-hidden">
          <span className="inline-block">Bold</span>
        </div>
        <div className="overflow-hidden">
          <span className="inline-block">Visions.</span>
        </div>
      </h1>
    </div>
  );
}
