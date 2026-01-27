"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
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

export function Contact() {
  const initialState: ContactFormState = {
    success: false,
    message: "",
    errors: {},
  };
  const [state, formAction] = useFormState(sendEmail, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);
    const plane = planeRef.current;
    const container = container.current;
    if (!plane || !container) return;

    let isCancelled = false;
    let currentTl: gsap.core.Timeline | null = null;

    const fly = () => {
      if (isCancelled) return;

      const bounds = container.getBoundingClientRect();
      const x = gsap.utils.random(0, bounds.width);
      const y = gsap.utils.random(0, bounds.height);

      const currentPos = gsap.getProperty(plane, ["x", "y"]) as [number, number];

      const path = [
        { x: currentPos[0], y: currentPos[1] },
        { x: x, y: y },
      ];

      const trail = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      trail.setAttribute("class", "paper-trail");
      trail.setAttribute(
        "d",
        `M ${path[0].x} ${path[0].y} L ${path[1].x} ${path[1].y}`
      );
      container.querySelector("svg")?.prepend(trail);

      const trailLength = trail.getTotalLength();
      gsap.set(trail, {
        strokeDasharray: trailLength,
        strokeDashoffset: trailLength,
        opacity: 1,
      });

      currentTl = gsap.timeline({
        onComplete: fly,
      });

      currentTl
        .to(plane, {
          motionPath: {
            path: path,
            align: "relative",
            autoRotate: true,
            alignOrigin: [0.5, 0.5],
          },
          duration: gsap.utils.random(3, 5),
          ease: "power2.inOut",
        })
        .to(
          trail,
          {
            strokeDashoffset: 0,
            duration: currentTl.duration() * 0.7,
            ease: "power1.out",
          },
          "<"
        )
        .to(
          trail,
          {
            opacity: 0,
            duration: 1.5,
            onComplete: () => trail.remove(),
          },
          ">-1"
        );
    };

    const initialBounds = container.getBoundingClientRect();
    gsap.set(plane, {
      x: initialBounds.width / 2,
      y: initialBounds.height / 2,
    });

    fly();

    return () => {
      isCancelled = true;
      if (currentTl) {
        currentTl.kill();
      }
      gsap.killTweensOf(plane);
      container.querySelectorAll('.paper-trail').forEach(el => el.remove());
    };
  }, []);

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
      <style jsx>{`
        .paper-trail {
          stroke: hsl(var(--primary));
          stroke-width: 2;
          stroke-dasharray: 5 10;
          fill: none;
        }
      `}</style>
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-30">
        <g ref={planeRef}>
          <Send className="h-7 w-7 text-primary" strokeWidth={1} />
        </g>
      </svg>

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