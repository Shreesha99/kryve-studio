'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLenis } from './smooth-scroll-provider';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 z-50 rounded-full bg-background/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
