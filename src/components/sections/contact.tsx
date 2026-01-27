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

gsap.registerPlugin(MotionPathPlugin);

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
  const initialState: ContactFormState = { success: false, message: "" };
  const [state, formAction] = useFormState(sendEmail, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const planeRef = useRef<SVGGElement>(null);
  const motionPathRef = useRef<SVGPathElement>(null);
  const trailPathRef = useRef<SVGPathElement>(null);

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // ✈️ CORRECT plane motion
  useEffect(() => {
    const plane = planeRef.current;
    const motionPath = motionPathRef.current;
    const trailPath = trailPathRef.current;

    if (!plane || !motionPath || !trailPath) return;

    const length = motionPath.getTotalLength();

    // trail hidden
    gsap.set(trailPath, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 0.6,
    });

    // plane setup
    gsap.set(plane, {
      scale: 1.8,
      transformOrigin: "50% 50%",
    });

    const proxy = { progress: 0 };

    gsap.to(proxy, {
      progress: 1,
      duration: 10,
      repeat: -1,
      ease: "none",
      onUpdate: () => {
        const p = proxy.progress;

        // position
        const point = motionPath.getPointAtLength(p * length);
        const next = motionPath.getPointAtLength(
          Math.min(p * length + 1, length)
        );

        // rotation from tangent
        const angle =
          Math.atan2(next.y - point.y, next.x - point.x) * (180 / Math.PI);

        gsap.set(plane, {
          x: point.x,
          y: point.y,
          rotation: angle + 45,
        });

        // reveal trail BEHIND plane
        gsap.set(trailPath, {
          strokeDashoffset: length - p * length,
        });
      },
    });

    return () => {
      gsap.killTweensOf(proxy);
    };
  }, []);

  // form state
  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      setSubmitStatus("success");
      formRef.current?.reset();
    } else if (!state.errors) {
      setSubmitStatus("error");
    }

    const timer = setTimeout(() => setSubmitStatus("idle"), 4000);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <section
      id="contact"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background py-24 md:py-32"
    >
      {/* Background animation */}
      <svg
        viewBox="0 0 1200 800"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-20"
      >
        {/* invisible motion path */}
        <path
          ref={motionPathRef}
          d="
            M -200 400
            C 200 200, 500 200, 700 400
            S 1000 600, 1200 300
            C 1400 100, 1600 500, 1800 400
          "
          fill="none"
          stroke="none"
        />

        {/* visible trail */}
        <path
          ref={trailPathRef}
          d="
            M -200 400
            C 200 200, 500 200, 700 400
            S 1000 600, 1200 300
            C 1400 100, 1600 500, 1800 400
          "
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
        />

        {/* plane */}
        <g ref={planeRef}>
          <foreignObject x="-14" y="-14" width="28" height="28">
            <Send className="h-7 w-7 text-primary" strokeWidth={2} />
          </foreignObject>
        </g>
      </svg>

      {/* content */}
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
            <form ref={formRef} action={formAction} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input name="name" placeholder="Your Name" required />
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  required
                />
              </div>
              <Textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                required
              />
              <div className="text-center">
                <SubmitButton status={submitStatus} />
              </div>
            </form>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
