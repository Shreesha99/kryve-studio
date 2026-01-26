'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Avoid hydration mismatch by waiting for the component to be mounted.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {mounted && resolvedTheme === 'dark' ? (
         <span className="material-symbols-outlined text-xl transition-all">light_mode</span>
      ) : (
         <span className="material-symbols-outlined text-xl transition-all">dark_mode</span>
      )}
    </Button>
  );
}
