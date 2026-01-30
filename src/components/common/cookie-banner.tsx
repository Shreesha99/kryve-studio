'use client';

import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

// New BouncingCookieIcon component
function BouncingCookieIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-full w-full", className)}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="hsl(var(--card))" />
      <circle cx="16" cy="15.5" r="1" fill="hsl(var(--card))" />
      <circle cx="12" cy="12" r="0.9" fill="hsl(var(--card))" />
      <circle cx="15.5" cy="8.5" r="1.1" fill="hsl(var(--card))" />
      <circle cx="8.5" cy="15.5" r="0.8" fill="hsl(var(--card))" />
    </svg>
  );
}


export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This needs to run only on the client.
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      // Use a timeout to avoid flashing the banner during SSR/hydration
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animation for the cookie icon
  useEffect(() => {
    if (isVisible && iconRef.current) {
      const tl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: 'power1.inOut' }
      });
      tl.to(iconRef.current, {
        y: '-8px',
        duration: 0.8
      });

      return () => tl.kill();
    }
  }, [isVisible]);

  const handleDecision = (consent: 'accepted' | 'declined') => {
    setIsVisible(false);
    Cookies.set('cookie_consent', consent, { expires: 365, path: '/' });
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[100] p-4 transition-all duration-500 ease-out',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0'
      )}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      aria-hidden={!isVisible}
    >
      <Card className="container relative mx-auto max-w-4xl border-border bg-card/80 p-6 shadow-2xl backdrop-blur-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDecision('declined')}
          className="absolute right-3 top-3 h-8 w-8 rounded-full"
          aria-label="Close cookie banner"
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <div ref={iconRef} className="flex-shrink-0">
            <BouncingCookieIcon className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="font-headline text-lg font-semibold">Regarding Your Privacy</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We use essential cookies to ensure our site functions smoothly. We respect your privacy and do not use them for tracking. By clicking "Allow," you consent to our use of cookies. Learn more in our{' '}
              <Link href="/legal/privacy-policy" className="underline hover:text-primary">
                Privacy Policy
              </Link>.
            </p>
          </div>
          <div className="flex w-full flex-shrink-0 gap-4 sm:w-auto">
            <Button variant="ghost" className="flex-1" onClick={() => handleDecision('declined')}>
              Decline
            </Button>
            <Button className="flex-1" onClick={() => handleDecision('accepted')}>
              Allow
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
