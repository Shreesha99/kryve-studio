'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // This needs to run only on the client.
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      // Use a timeout to avoid flashing the banner during SSR/hydration
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDecision = (consent: 'accepted' | 'declined') => {
    setIsVisible(false);
    Cookies.set('cookie_consent', consent, { expires: 365, path: '/' });
  };
  
  if (!isVisible) {
      return null;
  }

  return (
    <div 
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-12 duration-700 ease-out"
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent"
        aria-hidden={!isVisible}
    >
      <Card className="container mx-auto max-w-4xl border-border bg-card/80 p-6 shadow-2xl backdrop-blur-lg">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <div className="flex-shrink-0">
            <Cookie className="h-10 w-10 animate-bounce text-primary [animation-duration:1.5s]" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="font-headline text-lg font-semibold">Our Cookies Are Freshly Baked</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We use cookies to enhance your experience, but ours are just for function, not for tracking. By clicking "Accept," you agree to our use of these harmless digital treats. Learn more in our{' '}
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
              Accept
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
