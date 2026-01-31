"use client";

import { useState, createContext, useContext } from "react";
import { ThemeProvider } from "@/components/common/theme-provider";
import Preloader from "@/components/common/preloader";
import { SmoothScrollProvider } from "./smooth-scroll-provider";

// Create a context to share the preloader status
const PreloaderContext = createContext({ preloaderDone: false });

// Custom hook to use the preloader context
export const usePreloaderDone = () => useContext(PreloaderContext);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SmoothScrollProvider>
        <PreloaderContext.Provider value={{ preloaderDone }}>
          {!preloaderDone && (
            <Preloader onAnimationComplete={() => setPreloaderDone(true)} />
          )}
          {children}
        </PreloaderContext.Provider>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
