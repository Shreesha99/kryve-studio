'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';
import { Cracked404 } from '@/components/common/cracked-404';

const messages = [
  "Oops! This page must have been abducted by aliens. Let's beam you back to safety.",
  "Looks like you've found a glitch in the matrix. We're sending agents to fix it.",
  '404! This page is on a secret mission and will self-destruct in 5 seconds. (Not really).',
  "Well, this is awkward. The page you're looking for seems to have gone on vacation.",
  'Houston, we have a problem. This page has drifted off into the digital void.',
  "Are you sure you typed that right? Maybe try again after some coffee.",
  "We've dispatched a team of highly trained monkeys to find this page.",
  "This page is currently in another castle.",
  "We looked everywhere. Even under the couch cushions. Nothing.",
  "This is not the page you are looking for. *Jedi hand wave*",
  "The page is a lie.",
  "Looks like you've taken a wrong turn at Albuquerque.",
  "Congratulations! You've discovered a page that doesn't exist. The rewards are purely metaphysical.",
  "This page has been successfully deleted by our cat walking on the keyboard.",
  "404: The page has been retired to a quiet life of sudoku and daytime television.",
  "We asked our servers, they said they've never heard of this page.",
  "Even the world's best detectives couldn't find this page. And we tried.",
  "This page's ghost is probably haunting our servers right now."
];

export default function NotFound() {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  // Set a random message on client-side mount to avoid hydration mismatch
  useEffect(() => {
    setSelectedMessage(
      messages[Math.floor(Math.random() * messages.length)]
    );
  }, []);

  useEffect(() => {
    // Only run animation if the message has been set
    if (!selectedMessage) return;

    const tl = gsap.timeline({
      delay: 1.2, // Delay to allow crack animation to play first
      defaults: { ease: 'power3.out' },
    });

    if (paragraphRef.current && buttonRef.current) {
      tl.fromTo(
          paragraphRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 }
        )
        .fromTo(
          buttonRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.7'
        );
    }

    return () => {
      tl.kill();
    };
  }, [selectedMessage]); // Rerun animation logic when message changes

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="relative z-10 w-full">
          <Cracked404 />

          <p
            ref={paragraphRef}
            className="mx-auto mt-8 max-w-md text-lg text-muted-foreground opacity-0 md:text-xl"
          >
            {selectedMessage || '...'}
          </p>
          <div ref={buttonRef} className="mt-8 opacity-0">
            <Button asChild size="lg">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
