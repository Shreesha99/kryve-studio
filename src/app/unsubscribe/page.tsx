'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MailWarning, ShieldCheck, ShieldX } from 'lucide-react';
import { unsubscribeFromNewsletter } from '@/actions/newsletter';
import { AnimateOnScroll } from '@/components/common/animate-on-scroll';

function UnsubscribeComponent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async () => {
    if (!email) return;

    setStatus('loading');
    const result = await unsubscribeFromNewsletter(email);
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
    }
    setMessage(result.message);
  };

  useEffect(() => {
    if (!email) {
        setStatus('error');
        setMessage('No email address was provided. Please use the link from your email.');
    }
  }, [email]);

  return (
    <AnimateOnScroll>
        <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">Unsubscribe</CardTitle>
            <CardDescription>
            {status === 'idle' && 'Confirm you want to unsubscribe from our newsletter.'}
            {status === 'loading' && 'Processing your request...'}
            {status === 'success' && 'Your subscription has been removed.'}
            {status === 'error' && 'Something went wrong.'}
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
            {status === 'idle' && email && (
            <>
                <p className="text-center text-muted-foreground">
                You are about to unsubscribe <strong className="text-foreground">{email}</strong>.
                </p>
                <Button onClick={handleUnsubscribe} variant="destructive">
                Confirm Unsubscribe
                </Button>
            </>
            )}
            {status === 'loading' && (
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            )}
            {status === 'success' && (
                <div className="text-center space-y-4">
                    <ShieldCheck className="mx-auto h-12 w-12 text-green-500" />
                    <p>{message}</p>
                </div>
            )}
            {status === 'error' && (
                <div className="text-center space-y-4">
                    <ShieldX className="mx-auto h-12 w-12 text-destructive" />
                    <p className="text-destructive">{message}</p>
                </div>
            )}
            {!email && status !== 'loading' && (
                <div className="text-center space-y-4">
                    <MailWarning className="mx-auto h-12 w-12 text-destructive" />
                    <p className="text-destructive">{message}</p>
                </div>
            )}
        </CardContent>
        </Card>
    </AnimateOnScroll>
  );
}


export default function UnsubscribePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        {/* Suspense is required because useSearchParams reads from the client */}
        <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}>
            <UnsubscribeComponent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
