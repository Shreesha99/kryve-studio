'use client';

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addSubscriber } from '@/lib/newsletter';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, Loader2, X } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});
type FormValues = z.infer<typeof schema>;

type Status = 'idle' | 'loading' | 'success' | 'error';

function SubmitButton({ status }: { status: Status }) {
  if (status === 'success') {
    return <Check className="h-6 w-6 text-green-400" />;
  }
  if (status === 'error') {
    return <X className="h-6 w-6 text-red-400" />;
  }
  return (
    <button
      type="submit"
      aria-label="Submit email for newsletter"
      className="transition-transform hover:translate-x-1 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={status === 'loading'}
    >
      {status === 'loading' ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <ArrowRight className="h-6 w-6" />
      )}
    </button>
  );
}

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setStatus('loading');
    setMessage('');

    try {
      const result = await addSubscriber(data.email);

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        // Only reset the form if it was a new subscription, not if they were already subscribed.
        if (result.message.includes('Thank you')) {
          reset();
        }
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error: any) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="max-w-xs space-y-3">
      <h4 className="text-sm text-background/70">
        Sign up for our newsletter
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-4 border-b border-background/50 py-1 transition-colors focus-within:border-background"
      >
        <input
          {...register('email')}
          type="email"
          placeholder="Your Email"
          className="w-full bg-transparent text-lg placeholder:text-background/50 focus:outline-none"
          required
          disabled={status === 'loading'}
        />
        <SubmitButton status={status} />
      </form>
      {(errors.email || message) && (
        <p
          className={cn('text-sm', {
            'text-red-400': status === 'error' || !!errors.email,
            'text-green-400': status === 'success',
          })}
        >
          {errors.email?.message || message}
        </p>
      )}
    </div>
  );
}
