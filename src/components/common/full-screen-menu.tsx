"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { useLenis } from "./smooth-scroll-provider";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
  // { href: "/blog", label: "Blog" },
];

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullScreenMenu({ isOpen, onClose }: FullScreenMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();
  const timelineRef = useRef<gsap.core.Timeline>();

  const [activeSection, setActiveSection] = useState("home");

  // Scroll spy logic
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const scrollSpyOffset = window.innerHeight / 2;
      let currentSectionId = "";
      for (const link of navLinks.slice().reverse()) {
        if (link.href.startsWith("#")) {
          const section = document.getElementById(link.href.substring(1));
          if (section) {
            if (window.scrollY >= section.offsetTop - scrollSpyOffset) {
              currentSectionId = link.href.substring(1);
              break;
            }
          }
        }
      }
      setActiveSection(currentSectionId || "home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Run on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // GSAP Animation Timeline for menu open/close
  useEffect(() => {
    const menu = menuRef.current;
    const navItems = gsap.utils.toArray<HTMLLIElement>(
      "li",
      navListRef.current
    );
    const footer = footerRef.current;

    // Set initial state for animations
    gsap.set(menu, {
      clipPath: "circle(0% at calc(100% - 44px) 44px)",
      pointerEvents: "none",
    });
    gsap.set(navItems, { opacity: 0 });

    timelineRef.current = gsap.timeline({
      paused: true,
      onStart: () => {
        gsap.set(menu, { pointerEvents: "auto" });
      },
      onReverseComplete: () => {
        gsap.set(menu, { pointerEvents: "none" });
      },
    });

    timelineRef.current
      .to(menu, {
        clipPath: "circle(150% at calc(100% - 44px) 44px)",
        duration: 1.2,
        ease: "power3.inOut",
      })
      .to(
        navItems,
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.9"
      )
      .fromTo(
        footer,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.8"
      );

    const navLinkElements = gsap.utils.toArray<Element>(
      "a",
      navListRef.current
    );
    navLinkElements.forEach((link: Element) => {
      const underline = link.querySelector(".underline-anim");
      const arrow = link.querySelector(".arrow-anim");
      if (!underline || !arrow) return;

      link.addEventListener("mouseenter", () => {
        gsap.to(underline, {
          scaleX: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(arrow, { rotation: -45, duration: 0.4, ease: "power2.out" });
      });
      link.addEventListener("mouseleave", () => {
        gsap.to(underline, {
          scaleX: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(arrow, { rotation: 0, duration: 0.4, ease: "power2.out" });
      });
    });

    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      timelineRef.current?.play();
    } else {
      timelineRef.current?.reverse();
    }
  }, [isOpen]);

  const handleLinkClick = (href: string) => {
    onClose(); // Triggers the menu close animation.
    // Use a delayed call to ensure the scroll starts after the menu has begun closing.
    gsap.delayedCall(0.3, () => {
      if (lenis) {
        lenis.scrollTo(href, {
          duration: 2,
          easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // easeOutExpo
        });
      }
    });
  };

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-background"
      aria-hidden={!isOpen}
    >
      <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 md:px-6">
        <nav>
          <ul
            ref={navListRef}
            className="flex flex-col items-center gap-2 text-center md:gap-4"
          >
            {navLinks.map((link) => {
              const isPageLink = link.href.startsWith("/");
              const isHomePage = pathname === "/";
              let isActive = false;
              if (isPageLink) {
                isActive = pathname.startsWith(link.href);
              } else if (isHomePage) {
                isActive = activeSection === link.href.substring(1);
              }

              const targetHref = isPageLink
                ? link.href
                : isHomePage
                ? link.href
                : `/${link.href}`;

              return (
                <li
                  key={link.href}
                  className="opacity-0"
                  style={{ transform: "translateY(40px)" }}
                >
                  {isPageLink ? (
                    <Link
                      href={targetHref}
                      className={cn(
                        "flex items-center gap-4 font-headline text-5xl font-semibold md:text-7xl",
                        isActive ? "text-primary" : "text-foreground"
                      )}
                      onClick={onClose}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      <span className="relative py-1">
                        {link.label}
                        <span className="underline-anim pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary" />
                      </span>
                      <ArrowRight
                        className="arrow-anim h-8 w-8 shrink-0 text-primary md:h-12 md:w-12"
                        strokeWidth={1.5}
                      />
                    </Link>
                  ) : (
                    <a
                      href={targetHref}
                      className={cn(
                        "flex items-center gap-4 font-headline text-5xl font-semibold md:text-7xl",
                        isActive ? "text-primary" : "text-foreground"
                      )}
                      onClick={(e) => {
                        if (isHomePage) {
                          e.preventDefault();
                          handleLinkClick(link.href);
                        } else {
                          onClose();
                        }
                      }}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      <span className="relative py-1">
                        {link.label}
                        <span className="underline-anim pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary" />
                      </span>
                      <ArrowRight
                        className="arrow-anim h-8 w-8 shrink-0 text-primary md:h-12 md:w-12"
                        strokeWidth={1.5}
                      />
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
