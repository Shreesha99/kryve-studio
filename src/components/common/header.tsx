'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { HamburgerButton } from './hamburger-button';
import { FullScreenMenu } from './full-screen-menu';

export function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animate header on initial load
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    gsap.fromTo(
      headerEl,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5,
      }
    );
  }, []);

  // Detect if page is scrolled to apply background to header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 z-50 w-full p-4 opacity-0"
      >
        <div
          className={cn(
            'mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border px-6 shadow-lg transition-colors duration-300',
            isScrolled
              ? 'border-border bg-background/80 backdrop-blur-sm'
              : 'border-transparent bg-transparent'
          )}
        >
          <div className="flex items-center justify-start">
            <Logo />
          </div>

          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
            <HamburgerButton 
              isOpen={isMenuOpen} 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
            />
          </div>
        </div>
      </header>
      <FullScreenMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  );
}
