'use client';

import { useState } from 'react';
import { ThemeProvider } from '@/components/common/theme-provider';
import { Preloader } from '@/components/common/preloader';
import { SmoothScrollProvider } from './smooth-scroll-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

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
