"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLenis } from "./smooth-scroll-provider";

export const EDrawingAnimation = forwardRef<
  SVGPathElement,
  { className?: string; variant?: "mobile" | "desktop" }
>(function EDrawingAnimation({ className, variant = "desktop" }, pathRef) {
  const viewBox = variant === "desktop" ? "0 1 24 34" : "0 0 32 32";
  const lenis = useLenis();
  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <Link
      href="/"
      onClick={scrollToTop}
      aria-label="Go to home"
      className={cn(
        "inline-block cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
        className
      )}
    >
      <svg
        viewBox={viewBox}
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="var(--logo-from)" />
            <stop offset="48%" stopColor="var(--logo-mid)" />
            <stop offset="100%" stopColor="var(--logo-to)" />
          </linearGradient>
        </defs>

        <path
          ref={pathRef}
          d="M25 7H7V13H20V19H7V25H25"
          stroke="url(#logo-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
});
