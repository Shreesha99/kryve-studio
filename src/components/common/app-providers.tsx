"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/common/theme-provider";
import Preloader from "@/components/common/preloader";
import { SmoothScrollProvider } from "./smooth-scroll-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SmoothScrollProvider>
        {!preloaderDone && (
          <Preloader onAnimationComplete={() => setPreloaderDone(true)} />
        )}

        {/* 👇 inject flag into the tree */}
        <div data-preloader-done={preloaderDone}>{children}</div>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
