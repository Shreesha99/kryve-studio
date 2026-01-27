'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { subscribeNewsletter } from '@/actions/subscribe-newsletter';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

function SubmitButton({ success }: { success: boolean }) {
  const { pending } = useFormStatus();

  if (success) {
    return <Check className="h-6 w-6 text-green-400" />;
  }

  return (
    <button
      type="submit"
      aria-label="Submit email for newsletter"
      className="transition-transform hover:translate-x-1 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <ArrowRight className="h-6 w-6" />
      )}
    </button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useFormState(subscribeNewsletter, {
    success: false,
    message: '',
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        formRef.current?.reset();
        setShowSuccess(true);
        const timer = setTimeout(() => {
            setShowSuccess(false);
            // Reset state message
            state.message = '';
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [state]);

  return (
    <div className="max-w-xs space-y-3">
      <h4 className="text-sm text-background/70">
        Sign up for our newsletter
      </h4>
      <form ref={formRef} action={formAction} className="flex items-center gap-4 border-b border-background/50 py-1 transition-colors focus-within:border-background">
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          className="w-full bg-transparent text-lg placeholder:text-background/50 focus:outline-none"
          required
        />
        <SubmitButton success={showSuccess} />
      </form>
      {!state.success && state.message && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}
      {showSuccess && (
        <p className="text-sm text-green-400">{state.message}</p>
      )}
    </div>
  );
}
