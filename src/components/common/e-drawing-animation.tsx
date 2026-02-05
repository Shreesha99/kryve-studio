"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const EDrawingAnimation = forwardRef<
  SVGPathElement,
  { className?: string; variant?: "mobile" | "desktop" }
>(function EDrawingAnimation({ className, variant = "desktop" }, pathRef) {
  const viewBox = variant === "desktop" ? "0 1 24 34" : "0 0 32 32";

  return (
    <div className={cn("text-foreground", className)}>
      <svg viewBox={viewBox} className="h-full w-full">
        <path
          ref={pathRef}
          d="M25 7H7V13H20V19H7V25H25"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
});
