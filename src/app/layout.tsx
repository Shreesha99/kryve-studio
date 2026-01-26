'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/common/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Preloader } from '@/components/common/preloader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Since this is a client component, we use static tags for default metadata */}
        <title>Kryve Studio</title>
        <meta
          name="description"
          content="A premium, minimal website for a digital studio."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@600;700;800&family=Montserrat:wght@700&family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isLoading ? (
            <Preloader onAnimationComplete={handleAnimationComplete} />
          ) : (
            <>
              {children}
              <Toaster />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
