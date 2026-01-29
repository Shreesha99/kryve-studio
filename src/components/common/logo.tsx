"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// The new SVG icon component, using currentColor to inherit text color
function ElysiumIcon({
  className,
  variant = "desktop",
}: {
  className?: string;
  variant?: "mobile" | "desktop";
}) {
  const viewBox =
    variant === "desktop"
      ? "0 1 24 34" // cropped for large screens
      : "0 0 32 32"; // breathing room for small icon

  return (
    <svg
      viewBox={viewBox}
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

export function Logo() {
  const elysiumRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = elysiumRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      if (el) {
        setWidth(el.offsetWidth);
      }
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Link
      href="/"
      aria-label="Return to homepage"
      className="flex items-center justify-center"
    >
      {/* Mobile-only Icon */}
      <div className="md:hidden">
        <ElysiumIcon variant="mobile" className="h-8 w-8 text-foreground" />
      </div>

      {/* Desktop Logo */}
      <div className="hidden md:flex md:flex-col md:items-center md:leading-none">
        <span className="-mb-1 text-[0.6rem] font-light tracking-[0.3em] text-muted-foreground">
          THE
        </span>
        <div
          ref={elysiumRef}
          className="flex items-center justify-center font-headline text-2xl font-bold text-foreground"
        >
          {/* The new icon replaces the 'E' */}
          <ElysiumIcon
            variant="desktop"
            className="mr-1 h-[1.1em] -mb-[0.08em]"
          />
          <span>LYSIUM</span>
        </div>
        <span
          style={{ width: width > 0 ? `${width}px` : "auto" }}
          className="flex justify-between text-[0.5rem] font-light uppercase text-foreground/80"
        >
          {"PROJECT".split("").map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </span>
      </div>
    </Link>
  );
}
