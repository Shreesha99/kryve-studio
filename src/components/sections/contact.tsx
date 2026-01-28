"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import { sendEmail, type ContactFormState } from "@/actions/send-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimateOnScroll } from "../common/animate-on-scroll";

function SubmitButton({ status }: { status: "idle" | "success" | "error" }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || status !== "idle"}
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

const tags = [
  '#contact', '#hello', '#connect', '#inbox', '#message', '#send',
  '#elysium', '#letstalk', '#collaboration', '#inquiry'
];

export function Contact() {
  const initialState: ContactFormState = {
    success: false,
    message: "",
    errors: {},
  };
  const [state, formAction] = useFormState(sendEmail, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let isCancelled = false;
    
    const createAndAnimateTag = () => {
        if (isCancelled) return;
        
        const tagEl = document.createElement('span');
        tagEl.innerText = tags[gsap.utils.random(0, tags.length - 1, 1)];
        tagEl.className = 'contact-bg-tag pointer-events-none absolute z-0 select-none font-headline text-lg md:text-2xl opacity-0';
        tagEl.style.color = resolvedTheme === 'dark' ? 'hsl(var(--primary) / 0.05)' : 'hsl(var(--primary) / 0.05)';
        
        container.appendChild(tagEl);

        const bounds = container.getBoundingClientRect();

        gsap.set(tagEl, {
            x: gsap.utils.random(0, bounds.width),
            y: gsap.utils.random(0, bounds.height),
        });

        gsap.timeline({ onComplete: () => tagEl.remove() })
            .to(tagEl, { autoAlpha: 1, duration: 1, ease: 'power2.out' })
            .to(tagEl, {
                x: '+=random(-50, 50)',
                y: '+=random(-50, 50)',
                rotation: 'random(-15, 15)',
                duration: gsap.utils.random(5, 8),
                ease: 'none'
            }, 0)
            .to(tagEl, { autoAlpha: 0, duration: 1.5, ease: 'power2.in' }, '>-1.5');
    };

    const interval = setInterval(createAndAnimateTag, 800);

    return () => {
        isCancelled = true;
        clearInterval(interval);
        container.querySelectorAll('.contact-bg-tag').forEach(el => el.remove());
    };
  }, [resolvedTheme]);

  useEffect(() => {
    if (state.message || state.errors) {
      if (state.success) {
        setSubmitStatus("success");
        formRef.current?.reset();
      } else {
        setSubmitStatus("error");
      }

      const timer = setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateOnScroll>
            <h2 className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl">
              Let's build something great together.
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay="150ms">
            <p className="mt-4 text-lg text-muted-foreground">
              Have a project in mind or just want to say hello? Drop us a line.
            </p>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll delay="300ms" className="mx-auto mt-12 max-w-xl">
          <div className="rounded-xl border bg-card/50 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <form ref={formRef} action={formAction} className="space-y-4">
              {!state.success && state.message && (
                <div
                  className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive"
                  role="alert"
                >
                  {state.message}
                </div>
              )}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Input name="name" placeholder="Your Name" required />
                    {state.errors?.name && (
                      <p className="text-xs text-destructive">
                        {state.errors.name[0]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      required
                    />
                    {state.errors?.email && (
                      <p className="text-xs text-destructive">
                        {state.errors.email[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    rows={5}
                    required
                  />
                  {state.errors?.message && (
                    <p className="text-xs text-destructive">
                      {state.errors.message[0]}
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <SubmitButton status={submitStatus} />
                </div>
              </div>
            </form>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
