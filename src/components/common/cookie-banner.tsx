'use client';

import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animation for slide-in and vibration
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const card = banner.querySelector('.vibrating-card') as HTMLDivElement;

    if (isVisible) {
      gsap.timeline()
        .fromTo(banner,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
        )
        .fromTo(card,
          { rotation: 0 },
          {
            duration: 0.6,
            rotation: 0,
            ease: 'elastic.out(1.2, 0.25)',
            keyframes: [
              { rotation: -1 }, { rotation: 1 },
              { rotation: -0.5 }, { rotation: 0.5 },
              { rotation: 0 },
            ]
          },
          "-=0.2"
        );
    }
  }, [isVisible]);

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

      return () => {
        tl.kill();
      };
    }
  }, [isVisible]);

  const handleDecision = (consent: 'accepted' | 'declined') => {
    Cookies.set('cookie_consent', consent, { expires: 365, path: '/' });
    gsap.to(bannerRef.current, {
      yPercent: 100,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => setIsVisible(false)
    });
  };

  return (
    <div
      ref={bannerRef}
      className={cn('fixed bottom-0 left-0 right-0 z-[100] p-4 opacity-0')}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      aria-hidden={!isVisible}
    >
      <Card className="vibrating-card container relative mx-auto max-w-4xl border-border bg-card/80 p-6 shadow-2xl backdrop-blur-lg">
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
            <Cookie className="h-10 w-10 text-primary" />
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
