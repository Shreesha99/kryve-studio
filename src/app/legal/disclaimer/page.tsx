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
  title: "Disclaimer",
  description:
    "Legal disclaimer governing the use of The Elysium Project website.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function DisclaimerPage() {
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
                Disclaimer
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
                    The information provided by The Elysium Project (“we”, “us”,
                    or “our”) on https://www.the-elysium-project.in/ (the
                    “Website”) is provided for general informational purposes
                    only.
                  </p>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    While we strive to ensure that all information is accurate
                    and up to date, we make no representations or warranties of
                    any kind, express or implied, regarding the accuracy,
                    adequacy, reliability, availability, or completeness of any
                    content on the Website.
                  </p>
                </div>
              </div>

              {/* 1 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    1. No Professional Advice
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    The content on this Website does not constitute
                    professional, legal, financial, or technical advice.
                    Information provided here should not be relied upon as a
                    substitute for consultation with a qualified professional
                    who is familiar with your specific circumstances.
                  </p>
                </div>
              </section>

              {/* 2 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    2. External Links
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    The Website may contain links to third-party websites or
                    services. Such links are provided solely for convenience and
                    informational purposes.
                  </p>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    We do not control, endorse, or assume responsibility for the
                    content, accuracy, or reliability of any third-party
                    websites. Accessing external links is done entirely at your
                    own risk.
                  </p>
                </div>
              </section>

              {/* 3 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    3. Limitation of Liability
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    To the maximum extent permitted under applicable law, The
                    Elysium Project shall not be liable for any direct,
                    indirect, incidental, consequential, or punitive damages
                    arising out of your access to, use of, or reliance upon any
                    information on the Website.
                  </p>
                </div>
              </section>

              {/* 4 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    4. Testimonials
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    Any testimonials or statements appearing on the Website
                    reflect individual experiences and opinions. Such
                    testimonials do not guarantee or represent that all users
                    will achieve similar results.
                  </p>
                </div>
              </section>

              {/* 5 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    5. Errors and Omissions
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    While we make reasonable efforts to ensure the accuracy of
                    the information provided, The Elysium Project assumes no
                    responsibility for errors, omissions, or outcomes resulting
                    from the use of such information.
                  </p>
                </div>
              </section>

              {/* 6 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    6. Contact
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    If you have any questions or concerns regarding this
                    Disclaimer, you may contact us at{" "}
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
