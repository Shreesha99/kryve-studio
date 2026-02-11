"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { usePreloaderDone } from "./app-providers";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consent = Cookies.get("cookie_consent");

    if (consent) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner || !isVisible) return;

    const card = banner.querySelector(".vibrating-card") as HTMLDivElement;

    gsap.set(banner, { yPercent: 120, opacity: 0 });

    gsap
      .timeline()
      .to(banner, {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      })
      .fromTo(
        card,
        { rotation: 0 },
        {
          duration: 0.8,
          ease: "elastic.out(1.5, 0.2)",
          keyframes: [
            { rotation: -2 },
            { rotation: 2 },
            { rotation: -1.5 },
            { rotation: 1.5 },
            { rotation: -1 },
            { rotation: 1 },
            { rotation: 0 },
          ],
        },
        "-=0.2"
      );
  }, [isVisible]);

  const handleDecision = (consent: "accepted" | "declined") => {
    Cookies.set("cookie_consent", consent, { expires: 365, path: "/" });
    gsap.to(bannerRef.current, {
      yPercent: 100,
      opacity: 0,
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => setIsVisible(false),
    });
  };

  if (!isVisible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-0 left-0 right-0 z-[10000] p-4"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <Card className="vibrating-card container relative mx-auto max-w-4xl border-border bg-card/80 p-6 shadow-2xl backdrop-blur-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDecision("declined")}
          className="absolute right-3 top-3 h-8 w-8 rounded-full"
          aria-label="Close cookie banner"
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <div className="flex-shrink-0">
            <Cookie className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="font-headline text-lg font-semibold">
              Our Site Has Cookies (The Digital Kind)
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We use them to keep things running smoothly, not to build a secret
              profile on you. It’s all about making your experience better. Is
              that cool? Learn more in our{" "}
              <Link
                href="/legal/privacy-policy"
                className="underline hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex w-full flex-shrink-0 gap-4 sm:w-auto">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => handleDecision("declined")}
            >
              Not for me
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleDecision("accepted")}
            >
              Sounds Good!
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
