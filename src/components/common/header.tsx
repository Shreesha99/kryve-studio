'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Animate the header in when the component mounts
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isPageLink = href.startsWith('/');
    const isHomePage = pathname === '/';
    const isActive = isPageLink ? pathname.startsWith(href) : false;

    // Handle anchor links
    if (!isPageLink) {
      // If on the homepage, use smooth scroll
      if (isHomePage) {
        return (
          <a
            href={href}
            className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary md:text-sm"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
              setIsMobileMenuOpen(false);
            }}
          >
            {label}
          </a>
        );
      }
      // If on another page, use Next's Link to go to the homepage anchor
      return (
        <Link
          href={`/${href}`}
          className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary md:text-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {label}
        </Link>
      );
    }

    // Handle regular page links (e.g., /blog)
    return (
      <Link
        href={href}
        className={cn(
          'text-lg font-medium transition-colors hover:text-primary md:text-sm',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header ref={headerRef} className="fixed top-0 z-50 w-full p-2 md:p-4">
      <div
        className={cn(
          'relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border px-4 shadow-sm transition-all md:px-6',
          isScrolled
            ? 'border-border bg-background/80 backdrop-blur-sm'
            : 'border-transparent bg-background/30 backdrop-blur-sm'
        )}
      >
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Centered Navigation for Desktop */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        {/* Controls on the right */}
        <div className="flex items-center">
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="material-symbols-outlined text-2xl">menu</span>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full border-b bg-background/95 p-0 backdrop-blur-sm">
                <div className="p-8">
                  <nav className="mt-8 flex flex-col items-center gap-8">
                    {navLinks.map((link) => (
                      <NavLink key={link.href} {...link} />
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
