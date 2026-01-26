'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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
    <header className="fixed top-0 z-50 w-full p-2 md:p-4">
      <div
        className={cn(
          'container mx-auto flex h-16 max-w-screen-lg items-center justify-between rounded-full border px-6 shadow-sm transition-all',
          isScrolled
            ? 'border-border bg-background/80 backdrop-blur-sm'
            : 'border-transparent bg-background/30 backdrop-blur-sm'
        )}
      >
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
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
