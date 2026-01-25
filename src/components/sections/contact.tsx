'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { sendEmail, type ContactFormState } from '@/actions/send-email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AnimateOnScroll } from '../common/animate-on-scroll';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  );
}

export function Contact() {
  const initialState: ContactFormState = { success: false, message: '' };
  const [state, formAction] = useFormState(sendEmail, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Message Sent!',
          description: state.message,
        });
        formRef.current?.reset();
      } else {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast]);

  return (
    <section id="contact" className="w-full bg-background py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <AnimateOnScroll className="mx-auto max-w-3xl text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Let's build something great together.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a project in mind or just want to say hello? Drop us a line.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay="200ms" className="mx-auto mt-12 max-w-xl">
          <form ref={formRef} action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Input name="name" id="name" placeholder="Your Name" required />
                {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Input name="email" id="email" placeholder="Your Email" type="email" required />
                {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Textarea name="message" id="message" placeholder="Your Message" rows={5} required />
              {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
            </div>
            <div className="text-center">
              <SubmitButton />
            </div>
          </form>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
