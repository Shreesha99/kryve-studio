'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/common/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Preloader } from '@/components/common/preloader';
import { cn } from '@/lib/utils';

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

  const faviconSvg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><style>text{font-family:sans-serif;font-weight:bold;font-size:24px;text-anchor:middle;dominant-baseline:central;fill:hsl(240 10% 3.9%)}@media (prefers-color-scheme:dark){text{fill:hsl(0 0% 98%)}}</style><text x="50%" y="53%">Z</text></svg>`;
  const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Since this is a client component, we use static tags for default metadata */}
        <title>Zenith Studio</title>
        <meta
          name="description"
          content="A premium, minimal website for a digital studio."
        />
        <link rel="icon" href={faviconDataUri} type="image/svg+xml" />
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
      <body className={cn("font-body antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
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
