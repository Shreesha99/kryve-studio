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
import { useLenis } from './smooth-scroll-provider';

const navLinks = [
  { href: '#home', label: 'Home' },
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
  const [activeSection, setActiveSection] = useState('home');
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (pathname !== '/') return; // Only run scroll-spy on the homepage

      const scrollSpyOffset = window.innerHeight / 2;

      // Identify the current section based on scroll position
      let currentSectionId = '';
      for (const link of navLinks.slice().reverse()) {
        if (link.href.startsWith('#')) {
          const section = document.getElementById(link.href.substring(1));
          if (section) {
            if (window.scrollY >= section.offsetTop - scrollSpyOffset) {
              currentSectionId = link.href.substring(1);
              break;
            }
          }
        }
      }
      setActiveSection(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animate the header in when the component mounts
    const headerEl = headerRef.current;
    if (headerEl) {
      gsap.set(headerEl, { perspective: 800 });
      gsap.fromTo(
        headerEl,
        {
          opacity: 0,
          y: -60,
          rotationX: -90,
          transformOrigin: 'top center',
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1.0,
          ease: 'power3.out',
          delay: 0.2, // A short delay for effect
        }
      );
    }

    // Run on mount to set initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isPageLink = href.startsWith('/');
    const isHomePage = pathname === '/';

    let isActive = false;
    if (isPageLink) {
      // Handle /blog page link
      isActive = pathname.startsWith(href);
    } else if (isHomePage) {
      // Handle anchor links on the homepage
      const sectionId = href.substring(1);
      isActive = activeSection === sectionId;
    }

    // Handle anchor links
    if (!isPageLink) {
      // If on the homepage, use smooth scroll
      if (isHomePage) {
        return (
          <a
            href={href}
            className={cn(
              'nav-link-item text-lg font-medium transition-colors hover:text-primary md:text-sm',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
            onClick={(e) => {
              e.preventDefault();
              if (lenis) {
                lenis.scrollTo(href);
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
          className="nav-link-item text-lg font-medium text-muted-foreground transition-colors hover:text-primary md:text-sm"
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
          'nav-link-item text-lg font-medium transition-colors hover:text-primary md:text-sm',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full p-4 opacity-0"
    >
      <div
        className={cn(
          'mx-auto grid h-16 max-w-7xl grid-cols-2 items-center rounded-full border px-6 shadow-lg md:grid-cols-3',
          isScrolled
            ? 'border-border bg-background/80 backdrop-blur-sm'
            : 'border-border/30 bg-background/30'
        )}
      >
        <div className="header-logo flex items-center justify-start md:flex-1">
          <Logo />
        </div>

        <nav className="relative hidden items-center justify-center md:flex">
          <div className="flex h-full items-center justify-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>
        </nav>

        <div className="header-actions flex items-center justify-end md:flex-1">
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="material-symbols-outlined text-2xl">
                    menu
                  </span>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="w-full border-b bg-background/95 p-0 backdrop-blur-sm"
              >
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
