'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useLenis } from './smooth-scroll-provider';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
];

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullScreenMenu({ isOpen, onClose }: FullScreenMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const overlayPanelsRef = useRef<HTMLDivElement[]>([]);
    const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const footerRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();
    const pathname = usePathname();
    const timelineRef = useRef<gsap.core.Timeline>();

    const [activeSection, setActiveSection] = useState('home');

    // Scroll spy logic
    useEffect(() => {
        if (pathname !== '/') return;

        const handleScroll = () => {
            const scrollSpyOffset = window.innerHeight / 2;
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
            setActiveSection(currentSectionId || 'home');
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Run on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    // GSAP Animation Timeline
    useEffect(() => {
        const panels = overlayPanelsRef.current;
        const navItems = navItemsRef.current.filter(Boolean);
        const footer = footerRef.current;

        timelineRef.current = gsap.timeline({
            paused: true,
            onStart: () => {
                if (isOpen) {
                    lenis?.stop();
                    gsap.set(menuRef.current, { pointerEvents: 'auto' });
                }
            },
            onReverseComplete: () => {
                lenis?.start();
                gsap.set(menuRef.current, { pointerEvents: 'none' });
            },
        });

        timelineRef.current
        .fromTo(
            panels,
            { yPercent: -101 },
            {
                yPercent: 0,
                stagger: 0.05,
                duration: 0.8,
                ease: 'power3.inOut',
            }
        )
        .fromTo(
            navItems,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.8,
                ease: 'power3.out',
            },
            '-=0.4'
        )
        .fromTo(
            footer,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.6'
        );
        
        return () => {
            timelineRef.current?.kill();
        }
    }, [lenis, isOpen]);

    useEffect(() => {
        if (isOpen) {
            timelineRef.current?.play();
        } else {
            timelineRef.current?.reverse();
        }
    }, [isOpen]);

    const handleLinkClick = (href: string) => {
        const isHomePage = pathname === '/';
        const isAnchor = href.startsWith('#');

        if (isAnchor && !isHomePage) {
            // Let the anchor link redirect to the homepage
            onClose();
            return;
        }

        onClose();
        
        // Delay scroll to allow menu to start animating out
        if (isAnchor) {
            setTimeout(() => {
                lenis?.scrollTo(href, { duration: 1.5, lerp: 0.08 });
            }, 300);
        }
    };

    return (
        <div
            ref={menuRef}
            className="pointer-events-none fixed inset-0 z-40"
            aria-hidden={!isOpen}
        >
            <div className="absolute inset-0 flex">
                <div
                ref={(el) => (overlayPanelsRef.current[0] = el!)}
                className="h-full w-1/2 bg-background"
                />
                <div
                ref={(el) => (overlayPanelsRef.current[1] = el!)}
                className="h-full w-1/2 bg-background"
                />
            </div>
            
            <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 md:px-6">
                <nav>
                    <ul className="flex flex-col items-center gap-2 text-center md:gap-4">
                        {navLinks.map((link, index) => {
                        const isPageLink = link.href.startsWith('/');
                        const isHomePage = pathname === '/';
                        let isActive = false;
                        if (isPageLink) {
                            isActive = pathname.startsWith(link.href);
                        } else if (isHomePage) {
                            isActive = activeSection === link.href.substring(1);
                        }
                        
                        return (
                            <li key={link.href}>
                                {isPageLink ? (
                                    <Link
                                        href={link.href}
                                        ref={(el) => { navItemsRef.current[index] = el; }}
                                        className={cn("font-headline text-5xl font-semibold md:text-7xl",
                                            isActive ? "text-primary" : "text-foreground transition-colors hover:text-primary"
                                        )}
                                        onClick={onClose}
                                        tabIndex={isOpen ? 0 : -1}
                                    >
                                    {link.label}
                                    </Link>
                                ) : (
                                    <a
                                        href={isHomePage ? link.href : `/${link.href}`}
                                        ref={(el) => { navItemsRef.current[index] = el; }}
                                        className={cn("font-headline text-5xl font-semibold md:text-7xl",
                                            isActive ? "text-primary" : "text-foreground transition-colors hover:text-primary"
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLinkClick(link.href);
                                        }}
                                        tabIndex={isOpen ? 0 : -1}
                                    >
                                    {link.label}
                                    </a>
                                )}
                            </li>
                        );
                        })}
                    </ul>
                </nav>
                <div
                ref={footerRef}
                className="absolute bottom-10 text-center text-sm text-muted-foreground"
                >
                <p>&copy; {new Date().getFullYear()} The Elysium Project</p>
                <p className="mt-1">Bengaluru—India</p>
                </div>
            </div>
        </div>
    );
}
