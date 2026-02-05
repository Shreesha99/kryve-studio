"use client";

import { Metadata } from "next";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { AnimateOnScroll } from "@/components/common/animate-on-scroll";
import { ClientDate } from "@/components/common/client-date";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { usePreloaderDone } from "@/components/common/app-providers";

gsap.registerPlugin(ScrollTrigger);

const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Our Privacy Policy explains how The Elysium Project collects, uses, and protects personal information.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { preloaderDone } = usePreloaderDone();

  /* ---------------- SCROLL REVEAL ---------------- */

  useEffect(() => {
    if (!preloaderDone) return;

    const lines = contentRef.current?.querySelectorAll(".reveal") ?? [];

    gsap.fromTo(
      lines,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, [preloaderDone]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <AnimateOnScroll>
          <section
            ref={sectionRef}
            className="container mx-auto max-w-4xl px-4 py-20 pt-32 md:px-6 md:py-28 md:pt-40"
          >
            {/* TITLE */}
            <div className="overflow-hidden">
              <h1 className="reveal font-headline text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Privacy Policy
              </h1>
            </div>

            <div className="mt-6 overflow-hidden">
              <p className="reveal text-muted-foreground">
                Last updated: <ClientDate />
              </p>
            </div>

            {/* CONTENT */}
            <div
              ref={contentRef}
              className="mt-20 space-y-16 text-lg leading-relaxed text-foreground"
            >
              {/* INTRO */}
              <div className="space-y-6">
                <div className="overflow-hidden">
                  <p className="reveal">
                    This Privacy Policy describes how The Elysium Project (“we”,
                    “us”, or “our”) collects, uses, and protects information
                    when you access or use the website
                    https://www.the-elysium-project.in/ (the “Website”).
                  </p>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    By using the Website, you consent to the collection and use
                    of information in accordance with this Privacy Policy.
                  </p>
                </div>
              </div>

              {/* 1 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    1. Information We Collect
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    We collect information solely for the purpose of operating
                    and improving the Website and responding to user inquiries.
                  </p>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    Personal information may include your name, email address,
                    and any message you voluntarily submit through the contact
                    form.
                  </p>
                </div>
              </section>

              {/* 2 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    2. Usage Data
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    We may collect limited technical information such as IP
                    address, browser type, device information, pages visited,
                    and timestamps to understand usage patterns and improve
                    performance.
                  </p>
                </div>
              </section>

              {/* 3 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    3. Contact Form Data
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    When you submit the contact form, your information is
                    securely transmitted via our server using a third-party
                    email service. We do not store contact form submissions in a
                    public or user-accessible database.
                  </p>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    This information is used strictly for responding to your
                    inquiry and is not shared with third parties for marketing
                    purposes.
                  </p>
                </div>
              </section>

              {/* 4 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    4. Cookies
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    The Website may use cookies or similar technologies to
                    enhance functionality and user experience. You may choose to
                    disable cookies through your browser settings, though some
                    features may not function as intended.
                  </p>
                </div>
              </section>

              {/* 5 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    5. Data Security
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    We take reasonable and appropriate measures to protect
                    personal information from unauthorized access, disclosure,
                    alteration, or destruction. However, no method of
                    transmission over the internet is completely secure.
                  </p>
                </div>
              </section>

              {/* 6 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    6. Your Rights Under Indian Law
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    In accordance with applicable Indian data protection laws,
                    including the Digital Personal Data Protection Act, you may
                    request access to, correction of, or deletion of your
                    personal information by contacting us.
                  </p>
                </div>
              </section>

              {/* 7 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    7. Children’s Privacy
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    The Website is not intended for individuals under the age of
                    18. We do not knowingly collect personal information from
                    minors.
                  </p>
                </div>
              </section>

              {/* 8 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    8. Changes to This Policy
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    We may update this Privacy Policy periodically. Any changes
                    will be reflected on this page, and continued use of the
                    Website constitutes acceptance of the updated policy.
                  </p>
                </div>
              </section>

              {/* 9 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    9. Contact
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    If you have any questions regarding this Privacy Policy, you
                    may contact us at{" "}
                    <a
                      href="mailto:hello@the-elysium-project.in"
                      className="underline underline-offset-4"
                    >
                      hello@the-elysium-project.in
                    </a>
                    .
                  </p>
                </div>
              </section>
            </div>
          </section>
        </AnimateOnScroll>
      </main>

      <Footer />
    </div>
  );
}
