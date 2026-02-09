"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { sendEmail, type ContactFormState } from "@/actions/send-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- SUBMIT BUTTON ---------------- */

function SubmitButton({ status }: { status: "idle" | "success" | "error" }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn("w-full sm:w-48 transition-colors duration-300", {
        "bg-green-500 hover:bg-green-600 text-white": status === "success",
        "bg-red-500 hover:bg-red-600 text-white": status === "error",
      })}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : status === "success" ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Message Sent!
        </>
      ) : status === "error" ? (
        <>
          <X className="mr-2 h-4 w-4" />
          Failed to Send
        </>
      ) : (
        <>
          Send Message
          <Send className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

/* ---------------- FLOATING TAGS ---------------- */

const tags = [
  "#contact",
  "#hello",
  "#connect",
  "#inbox",
  "#message",
  "#send",
  "#elysium",
  "#letstalk",
  "#collaboration",
  "#inquiry",
];

export function Contact() {
  const initialState: ContactFormState = {
    success: false,
    message: undefined,
  };

  const hasError = (key: keyof NonNullable<ContactFormState["fieldErrors"]>) =>
    Boolean(state.fieldErrors?.[key]);

  const [state, formAction] = useFormState(sendEmail, initialState);
  const [buttonStatus, setButtonStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const containerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const { resolvedTheme } = useTheme();

  /* ---------------- FORM RESET ON SUCCESS ---------------- */

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  useEffect(() => {
    if (state.success) {
      setButtonStatus("success");

      const t = setTimeout(() => {
        setButtonStatus("idle");
      }, 10000);

      return () => clearTimeout(t);
    }

    if (state.message) {
      setButtonStatus("error");

      const t = setTimeout(() => {
        setButtonStatus("idle");
      }, 10000);

      return () => clearTimeout(t);
    }
  }, [state.success, state.message]);

  /* ---------------- HERO TEXT REVEAL ---------------- */

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const lines = gsap.utils.toArray(".hero-line", titleRef.current);

        gsap.fromTo(
          lines,
          { yPercent: 120 },
          {
            yPercent: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
            },
          }
        );
      }

      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 65%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ---------------- FLOATING TAGS ---------------- */

  useEffect(() => {
    if (!state.success) return;
    const t = setTimeout(() => {}, 2500);
    return () => clearTimeout(t);
  }, [state.success]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const spawnTag = () => {
      if (cancelled) return;

      const el = document.createElement("span");
      el.innerText = tags[gsap.utils.random(0, tags.length - 1, 1)];
      el.className =
        "contact-bg-tag pointer-events-none absolute z-0 select-none font-headline text-lg md:text-2xl opacity-0";
      el.style.color = "hsl(var(--primary) / 0.05)";

      container.appendChild(el);

      const bounds = container.getBoundingClientRect();

      gsap.set(el, {
        x: gsap.utils.random(0, bounds.width),
        y: gsap.utils.random(0, bounds.height),
      });

      gsap
        .timeline({ onComplete: () => el.remove() })
        .to(el, { autoAlpha: 1, duration: 1 })
        .to(
          el,
          {
            x: "+=random(-50, 50)",
            y: "+=random(-50, 50)",
            rotation: "random(-15, 15)",
            duration: gsap.utils.random(5, 8),
            ease: "none",
          },
          0
        )
        .to(el, { autoAlpha: 0, duration: 1.5 }, ">-1.5");
    };

    const interval = setInterval(spawnTag, 800);
    return () => {
      cancelled = true;
      clearInterval(interval);
      container.querySelectorAll(".contact-bg-tag").forEach((n) => n.remove());
    };
  }, [resolvedTheme]);

  /* ---------------- JSX ---------------- */

  const submitStatus = buttonStatus;

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            ref={titleRef}
            className="font-headline text-5xl font-semibold tracking-tight sm:text-5xl"
          >
            <span className="block overflow-hidden pb-[0.25em]">
              <span className="hero-line block">
                Let’s build something great together.
              </span>
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="mt-4 text-lg text-muted-foreground opacity-0"
          >
            Have a project in mind or just want to say hello? Drop us a line.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <div className="rounded-xl border bg-card/50 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <form ref={formRef} action={formAction} className="space-y-6">
              <div>
                <Input
                  name="name"
                  placeholder="Your Name"
                  required
                  className={hasError("name") ? "border-red-500" : ""}
                />
                {state.fieldErrors?.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {state.fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  required
                  className={hasError("email") ? "border-red-500" : ""}
                />
                {state.fieldErrors?.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {state.fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  required
                  className={hasError("message") ? "border-red-500" : ""}
                />
                {state.fieldErrors?.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {state.fieldErrors.message}
                  </p>
                )}
              </div>

              <div className="text-center">
                <SubmitButton status={submitStatus} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
