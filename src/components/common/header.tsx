'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
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

  useLayoutEffect(() => {
    const activeLinkIndex = navLinks.findIndex(
      (link) => link.href.startsWith('/') && pathname.startsWith(link.href)
    );
    const activeLinkEl =
      activeLinkIndex !== -1 ? linkRefs.current[activeLinkIndex] : null;

    const movePill = (element: HTMLAnchorElement | null) => {
      // Clear all active attributes first
      linkRefs.current.forEach((link) => {
        if (link) {
          link.dataset.activePill = 'false';
        }
      });

      if (element && navRef.current && pillRef.current) {
        element.dataset.activePill = 'true';
        const navRect = navRef.current.getBoundingClientRect();
        const linkRect = element.getBoundingClientRect();

        gsap.to(pillRef.current, {
          left: linkRect.left - navRect.left,
          width: linkRect.width,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        });
      } else if (pillRef.current) {
        gsap.to(pillRef.current, {
          opacity: 0,
          duration: 0.2,
        });
      }
    };

    // Initial move on page load/route change
    movePill(activeLinkEl);

    // --- Event Listeners for Hover Effect ---
    const navElement = navRef.current;

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && navElement?.contains(target)) {
        movePill(target as HTMLAnchorElement);
      }
    };

    const handleMouseLeave = () => {
      movePill(activeLinkEl);
    };

    if (navElement) {
      navElement.addEventListener('mouseover', handleMouseEnter);
      navElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (navElement) {
        navElement.removeEventListener('mouseover', handleMouseEnter);
        navElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [pathname]);

  const NavLink = ({
    href,
    label,
    linkRef,
  }: {
    href: string;
    label: string;
    linkRef: (el: HTMLAnchorElement | null) => void;
  }) => {
    const isPageLink = href.startsWith('/');
    const isHomePage = pathname === '/';
    const isActive = isPageLink ? pathname.startsWith(href) : false;

    // Handle anchor links
    if (!isPageLink) {
      // If on the homepage, use smooth scroll
      if (isHomePage) {
        return (
          <a
            ref={linkRef}
            href={href}
            className="relative z-10 text-lg font-medium text-muted-foreground transition-colors duration-200 data-[active-pill=true]:!text-primary-foreground md:text-sm"
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
          ref={linkRef}
          className="relative z-10 text-lg font-medium text-muted-foreground transition-colors duration-200 data-[active-pill=true]:!text-primary-foreground md:text-sm"
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
        ref={linkRef}
        className={cn(
          'relative z-10 text-lg font-medium transition-colors duration-200 data-[active-pill=true]:!text-primary-foreground md:text-sm',
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
      className="fixed top-0 z-50 w-full px-4 pt-4 transition-all"
    >
      <div
        className={cn(
          'mx-auto grid h-16 grid-cols-2 items-center rounded-full border px-6 shadow-sm md:grid-cols-3',
          isScrolled
            ? 'border-border bg-background/80 backdrop-blur-sm'
            : 'border-transparent bg-background/30'
        )}
      >
        <div className="flex items-center justify-start">
          <Logo />
        </div>

        <div className="relative hidden items-center justify-center md:flex">
          <nav
            ref={navRef}
            className="flex h-full items-center justify-center gap-8"
          >
            <div
              ref={pillRef}
              className="absolute top-1/2 h-8 -translate-y-1/2 rounded-md bg-primary"
            />
            {navLinks.map((link, index) => (
              <NavLink
                key={link.href}
                {...link}
                linkRef={(el: HTMLAnchorElement | null) =>
                  (linkRefs.current[index] = el)
                }
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end">
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
                      // This NavLink doesn't need refs as it's for mobile
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </a>
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
