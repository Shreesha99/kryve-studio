'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/common/theme-provider';
import { Preloader } from '@/components/common/preloader';
import { SmoothScrollProvider } from './smooth-scroll-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // This effect hook handles the logic for showing the preloader.
  // We use a timeout to simulate a loading process, giving the animation time to play.
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real application, you might wait for data to load here.
      // For this demo, we'll just end the loading state after the animation can complete.
    }, 2800); // Should be slightly less than the preloader animation duration

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <SmoothScrollProvider>
        {isLoading ? (
          <Preloader onAnimationComplete={handleAnimationComplete} />
        ) : (
          <>
            {children}
          </>
        )}
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
