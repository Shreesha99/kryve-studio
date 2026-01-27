'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { sendEmail, type ContactFormState } from '@/actions/send-email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimateOnScroll } from '../common/animate-on-scroll';

function SubmitButton({ status }: { status: 'idle' | 'success' | 'error' }) {
  const { pending } = useFormStatus();

  const content = () => {
    if (pending) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      );
    }
    switch (status) {
      case 'success':
        return (
          <>
            <Check className="mr-2 h-4 w-4" />
            Message Sent!
          </>
        );
      case 'error':
        return (
          <>
            <X className="mr-2 h-4 w-4" />
            Failed to Send
          </>
        );
      default:
        return (
          <>
            Send Message
            <Send className="ml-2 h-4 w-4" />
          </>
        );
    }
  };

  return (
    <Button
      type="submit"
      disabled={pending || status !== 'idle'}
      className={cn('w-full sm:w-48 transition-colors duration-300', {
        'bg-green-500 hover:bg-green-600 text-white': status === 'success',
        'bg-red-500 hover:bg-red-600 text-white': status === 'error',
      })}
    >
      {content()}
    </Button>
  );
}

export function Contact() {
  const initialState: ContactFormState = { success: false, message: '' };
  const [state, formAction] = useFormState(sendEmail, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const planeRef = useRef<SVGPathElement>(null);
  const trailGroupRef = useRef<SVGGElement>(null);

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const svg = svgRef.current;
    const plane = planeRef.current;
    const trailGroup = trailGroupRef.current;
    if (!svg || !plane || !trailGroup) return;

    // Use viewBox dimensions for a consistent coordinate system
    const viewBox = svg.viewBox.baseVal;
    const width = viewBox.width;
    const height = viewBox.height;

    const trailSegments: SVGPathElement[] = [];
    const maxSegments = 10;
    
    gsap.set(plane, { x: width / 2, y: height / 2, opacity: 1, transformOrigin: 'center center' });

    let animation: gsap.core.Tween | null = null;

    function fly() {
      const oldX = gsap.getProperty(plane, "x") as number;
      const oldY = gsap.getProperty(plane, "y") as number;

      // Define boundaries for flight
      const padding = 50;
      const newX = gsap.utils.random(padding, width - padding);
      const newY = gsap.utils.random(padding, height - padding);
      const duration = gsap.utils.random(3, 5);
      
      // Calculate angle for rotation
      const angle = Math.atan2(newY - oldY, newX - oldX) * (180 / Math.PI);

      // Create and animate the trail
      const trail = document.createElementNS("http://www.w3.org/2000/svg", "path");
      trail.setAttribute("d", `M${oldX},${oldY} L${oldX},${oldY}`); // Start as a point
      trail.setAttribute("fill", "none");
      trail.setAttribute("stroke", "hsl(var(--primary))");
      trail.setAttribute("stroke-width", "1");
      trail.setAttribute("stroke-dasharray", "3 7");
      trail.setAttribute("opacity", "0.5");
      trailGroup.appendChild(trail);
      
      gsap.to(trail, {
        attr: { d: `M${oldX},${oldY} L${newX},${newY}` },
        duration: duration,
        ease: "linear",
      });

      trailSegments.push(trail);

      // Remove the oldest trail segment if we exceed the max
      if (trailSegments.length > maxSegments) {
        const oldSegment = trailSegments.shift();
        if (oldSegment) {
          gsap.to(oldSegment, {
            opacity: 0,
            duration: 1,
            onComplete: () => oldSegment.remove(),
          });
        }
      }
      
      // Animate the plane
      animation = gsap.to(plane, {
        x: newX,
        y: newY,
        rotation: angle,
        duration: duration,
        ease: "power1.inOut",
        onComplete: fly,
      });
    }

    fly(); // Start the animation loop

    return () => {
      // Cleanup function to kill all animations and remove elements on component unmount
      animation?.kill();
      gsap.killTweensOf([plane, ...trailSegments]);
      if(trailGroup) trailGroup.innerHTML = '';
    }
  }, []);

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      setSubmitStatus('success');
      formRef.current?.reset();
    } else {
      if (!state.errors) {
        setSubmitStatus('error');
      }
    }
    
    const timer = setTimeout(() => {
      setSubmitStatus('idle');
    }, 4000);

    return () => clearTimeout(timer);
  }, [state]);

  return (
    <section
      id="contact"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background py-24 md:py-32"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1200 800"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-20 dark:opacity-10"
        preserveAspectRatio="xMidYMid slice"
      >
        <g ref={trailGroupRef} />
        <path
          ref={planeRef}
          d="M-15 -10 L20 0 L-15 10 L-5 0 Z"
          fill="hsl(var(--primary))"
          opacity="0"
        />
      </svg>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <AnimateOnScroll>
            <h2
              className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              Let's build something great together.
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay="150ms">
            <p
              className="mt-4 text-lg text-muted-foreground"
            >
              Have a project in mind or just want to say hello? Drop us a line.
            </p>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll delay="300ms" className="mx-auto mt-12 max-w-xl">
          <div className="rounded-xl border bg-card/50 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <form ref={formRef} action={formAction} className="space-y-6">
              {state.message && !state.success && !state.errors && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
                  {state.message}
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Input name="name" id="name" placeholder="Your Name" required aria-describedby="name-error" />
                  {state.errors?.name && (
                    <p id="name-error" className="text-sm text-destructive">
                      {state.errors.name[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    type="email"
                    required
                    aria-describedby="email-error"
                  />
                  {state.errors?.email && (
                    <p id="email-error" className="text-sm text-destructive">
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Textarea
                  name="message"
                  id="message"
                  placeholder="Your Message"
                  rows={5}
                  required
                  aria-describedby="message-error"
                />
                {state.errors?.message && (
                  <p id="message-error" className="text-sm text-destructive">
                    {state.errors.message[0]}
                  </p>
                )}
              </div>
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
