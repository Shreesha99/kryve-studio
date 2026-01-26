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
              const targetElement = document.querySelector(href);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              }
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
    <header ref={headerRef} className="fixed top-0 z-50 w-full px-4 pt-4 transition-all">
      <div
        className={cn(
          // Universal pill styles
          'mx-auto h-16 max-w-7xl items-center rounded-full border px-6 shadow-sm',
          
          // Layout: 2 columns on mobile, 3 on desktop
          'grid grid-cols-2 md:grid-cols-3',

          // Scroll-based background styles
          isScrolled
            ? 'border-border bg-background/80 backdrop-blur-sm'
            : 'border-transparent bg-background/30'
        )}
      >
        {/* Left: Logo */}
        <div className="flex items-center justify-start">
          <Logo />
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden items-center justify-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        {/* Right: Controls */}
        <div className="flex items-center justify-end">
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
