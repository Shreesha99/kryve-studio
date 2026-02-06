"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const EDrawingAnimation = forwardRef<
  SVGPathElement,
  { className?: string; variant?: "mobile" | "desktop" }
>(function EDrawingAnimation({ className, variant = "desktop" }, pathRef) {
  const viewBox = variant === "desktop" ? "0 1 24 34" : "0 0 32 32";

  return (
    <Link
      href="/"
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
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="2%" stopColor="var(--logo-from)" />
            <stop offset="44%" stopColor="var(--logo-mid)" />
            <stop offset="79%" stopColor="var(--logo-to)" />
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
