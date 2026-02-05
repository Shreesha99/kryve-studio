"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { NewsletterForm } from "./newsletter-form";
import { AnimatedGradient } from "./animated-gradient";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const revealRefs = useRef<HTMLElement[]>([]);
  const bgTextRef = useRef<HTMLDivElement>(null);

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };
  const legalLinks = [
    {
      label: "Terms & Conditions",
      slug: "terms-and-conditions",
    },
    {
      label: "Privacy Policy",
      slug: "privacy-policy",
    },
    {
      label: "Disclaimer",
      slug: "disclaimer",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ---------- TEXT REVEAL (HERO / ABOUT STYLE) ---------- */
      gsap.fromTo(
        revealRefs.current,
        { yPercent: 120 },
        {
          yPercent: 0,
          stagger: 0.08,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 75%",
          },
        }
      );

      /* ---------- BACKGROUND BRAND ---------- */
      if (bgTextRef.current) {
        gsap.fromTo(
          bgTextRef.current,
          { opacity: 0 },
          {
            opacity: 0.05,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-foreground py-20 text-background md:py-32"
    >
      <AnimatedGradient className="opacity-20 dark:opacity-10" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* LEFT BIG */}
          <div className="md:col-span-2 space-y-12">
            <h3 className="font-headline text-3xl font-semibold md:text-4xl">
              <div className="overflow-hidden">
                <span ref={addRevealRef} className="inline-block">
                  Where pixels meet purpose.
                </span>
              </div>
            </h3>

            <div className="flex flex-wrap gap-12">
              <div className="space-y-3">
                <div className="overflow-hidden">
                  <h4
                    ref={addRevealRef}
                    className="inline-block text-sm text-background/70"
                  >
                    New Business:
                  </h4>
                </div>

                <div className="overflow-hidden">
                  <a
                    ref={addRevealRef}
                    href="mailto:hello@the-elysium-project.in"
                    className="inline-block text-lg transition-colors hover:text-background/80"
                  >
                    hello@the-elysium-project.in
                  </a>
                </div>
              </div>

              <NewsletterForm />
            </div>
          </div>

          {/* NAV */}
          <div>
            <div className="overflow-hidden">
              <h4
                ref={addRevealRef}
                className="mb-6 inline-block text-sm text-background/70"
              >
                Navigate
              </h4>
            </div>

            <ul className="space-y-3 text-lg">
              {["Home", "Work", "About", "Services", "Contact"].map((item) => (
                <li key={item}>
                  <div className="overflow-hidden">
                    <Link
                      ref={addRevealRef}
                      href={`#${item.toLowerCase()}`}
                      className="inline-block transition-colors hover:text-background/80"
                    >
                      {item}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <div className="overflow-hidden">
              <h4
                ref={addRevealRef}
                className="mb-6 inline-block text-sm text-background/70"
              >
                Social
              </h4>
            </div>

            <ul className="space-y-3 text-lg">
              {[
                {
                  label: "Instagram",
                  href: "https://instagram.com/the_elysium_project",
                },
                {
                  label: "LinkedIn",
                  href: "https://linkedin.com/company/the-elysium-project",
                },
              ].map((social) => (
                <li key={social.label}>
                  <div className="overflow-hidden">
                    <a
                      ref={addRevealRef}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 transition-colors hover:text-background/80"
                    >
                      <span className="relative">
                        {social.label}
                        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-background transition-transform duration-300 ease-out group-hover:scale-x-100" />
                      </span>
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:rotate-[-45deg]" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <div className="overflow-hidden">
                <h4
                  ref={addRevealRef}
                  className="mb-4 inline-block text-sm text-background/70"
                >
                  Location
                </h4>
              </div>

              <div className="overflow-hidden">
                <p ref={addRevealRef} className="inline-block text-lg">
                  Bengaluru—India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-24 border-t border-background/20 pt-8 text-sm text-background/70 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="overflow-hidden">
            <p ref={addRevealRef} className="inline-block">
              &copy; {new Date().getFullYear()} The Elysium Project. All Rights
              Reserved.{" "}
              <Link
                href="/admin"
                target="_blank"
                className="underline transition-colors hover:text-background/80"
              >
                Admin
              </Link>
            </p>
          </div>

          <div className="flex gap-6">
            {legalLinks.map(({ label, slug }) => (
              <div key={slug} className="overflow-hidden">
                <Link
                  ref={addRevealRef}
                  href={`/legal/${slug}`}
                  target="_blank"
                  className="inline-block transition-colors hover:text-background/80"
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BACKGROUND BRAND */}
      <div
        ref={bgTextRef}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 text-center font-headline font-extrabold text-background opacity-0"
        style={{
          fontSize: "clamp(5rem, 22vw, 22rem)",
          lineHeight: "0.85",
        }}
      >
        ELYSIUM
      </div>
    </footer>
  );
}
