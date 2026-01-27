'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/dist/MotionPathPlugin';
import { sendEmail, type ContactFormState } from '@/actions/send-email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimateOnScroll } from '../common/animate-on-scroll';

gsap.registerPlugin(MotionPathPlugin);

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
  const planeRef = useRef<SVGPathElement>(null);

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const plane = planeRef.current;
    if (!plane) return;

    gsap.set(plane, { opacity: 1 });

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: 'none' },
    });

    tl.to(plane, {
      motionPath: {
        path: '#motion-path',
        align: '#motion-path',
        alignOrigin: [0.5, 0.5],
        autoRotate: 90,
      },
      duration: 25,
    });
    
    return () => {
      tl.kill();
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
        viewBox="0 0 1200 800"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-30 dark:opacity-20"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          id="motion-path"
          d="M-100 600 C 200 800, 400 400, 600 600 S 1000 800, 1300 600 V 200 C 1000 0, 800 400, 600 200 S 200 0, -100 200 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <path
          ref={planeRef}
          d="M2.1,0.4L20.5,9.6c1.6,0.8,2.3,2.7,1.5,4.3c-0.8,1.6-2.7,2.3-4.3,1.5L-0.2,6.2C-1.8,5.4-2.5,3.5-1.7,1.9C-0.9,0.3,1, -0.4,2.1,0.4z M17.7-6.2L-0.7-15.4c-1.6-0.8-3.5-0.1-4.3,1.5s-0.1,3.5,1.5,4.3l18.4,9.2c1.6,0.8,3.5,0.1,4.3-1.5S19.3-5.4,17.7-6.2z"
          fill="hsl(var(--primary))"
          transform="scale(1.2)"
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
