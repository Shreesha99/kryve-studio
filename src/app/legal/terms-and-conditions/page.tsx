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
  title: "Terms and Conditions",
  description:
    "Terms and conditions governing the access and use of The Elysium Project website.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsAndConditionsPage() {
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
                Terms and Conditions
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
                    These Terms and Conditions (“Terms”) govern your access to
                    and use of the website https://www.the-elysium-project.in/
                    (the “Website”), operated by The Elysium Project (“we”,
                    “us”, or “our”).
                  </p>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    By accessing or using the Website, you acknowledge that you
                    have read, understood, and agree to be legally bound by
                    these Terms. If you do not agree, you must discontinue use
                    of the Website immediately.
                  </p>
                </div>
              </div>

              {/* 1 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    1. Eligibility
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    You must be at least 18 years of age and legally competent
                    to enter into a binding contract under the Indian Contract
                    Act, 1872. By using this Website, you represent that you
                    meet these requirements.
                  </p>
                </div>
              </section>

              {/* 2 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    2. Intellectual Property Rights
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    All content available on the Website, including text,
                    graphics, imagery, videos, software, layouts, visual
                    systems, and branding, is the exclusive property of The
                    Elysium Project or its licensors.
                  </p>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    Such content is protected under applicable Indian laws,
                    including the Copyright Act, 1957, the Trade Marks Act,
                    1999, and the Information Technology Act, 2000. Any
                    unauthorized use is strictly prohibited.
                  </p>
                </div>
              </section>

              {/* 3 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    3. Permitted Use
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    You are granted a limited, non-exclusive, non-transferable,
                    and revocable license to access and use the Website strictly
                    for lawful purposes and in accordance with these Terms.
                  </p>
                </div>
              </section>

              {/* 4 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    4. Prohibited Conduct
                  </h2>
                </div>

                {[
                  "Use the Website for any unlawful, deceptive, or fraudulent purpose",
                  "Attempt to gain unauthorized access to systems or networks",
                  "Introduce malware, viruses, or harmful code",
                  "Interfere with the security or performance of the Website",
                  "Infringe upon the rights or intellectual property of others",
                ].map((item, i) => (
                  <div key={i} className="overflow-hidden">
                    <p className="reveal">— {item}</p>
                  </div>
                ))}
              </section>

              {/* 5 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    5. Third-Party Links
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    The Website may contain links to third-party websites or
                    services. We do not control or assume responsibility for
                    their content, policies, or practices. Accessing such
                    resources is at your own discretion and risk.
                  </p>
                </div>
              </section>

              {/* 6 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    6. Limitation of Liability
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    To the maximum extent permitted by Indian law, The Elysium
                    Project shall not be liable for any indirect, incidental,
                    consequential, or punitive damages arising from your use of
                    or inability to use the Website.
                  </p>
                </div>
              </section>

              {/* 7 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    7. Governing Law and Jurisdiction
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    These Terms shall be governed by and construed in accordance
                    with the laws of India. All disputes shall be subject to the
                    exclusive jurisdiction of the courts of Bengaluru,
                    Karnataka.
                  </p>
                </div>
              </section>

              {/* 8 */}
              <section className="space-y-4">
                <div className="overflow-hidden">
                  <h2 className="reveal font-headline text-2xl font-semibold">
                    8. Contact
                  </h2>
                </div>

                <div className="overflow-hidden">
                  <p className="reveal">
                    For any questions regarding these Terms, you may contact us
                    at{" "}
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
