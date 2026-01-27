'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';
import { Cracked404 } from '@/components/common/cracked-404';
import { Binary, Bomb, Orbit, Palmtree, Planet } from 'lucide-react';

const messageObjects = [
  {
    text: "Oops! This page must have been abducted by aliens. Let's beam you back to safety.",
    icon: <Planet className="h-16 w-16 text-muted-foreground/30" />,
  },
  {
    text: "Looks like you've found a glitch in the matrix. We're sending agents to fix it.",
    icon: <Binary className="h-16 w-16 text-muted-foreground/30" />,
  },
  {
    text: '404! This page is on a secret mission and will self-destruct in 5 seconds. (Not really).',
    icon: <Bomb className="h-16 w-16 text-muted-foreground/30" />,
  },
  {
    text: "Well, this is awkward. The page you're looking for seems to have gone on vacation.",
    icon: <Palmtree className="h-16 w-16 text-muted-foreground/30" />,
  },
  {
    text: 'Houston, we have a problem. This page has drifted off into the digital void.',
    icon: <Orbit className="h-16 w-16 text-muted-foreground/30" />,
  },
];

export default function NotFound() {
  const iconRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<{
    text: string;
    icon: React.ReactNode;
  } | null>(null);

  // Set a random message on client-side mount to avoid hydration mismatch
  useEffect(() => {
    setSelectedMessage(
      messageObjects[Math.floor(Math.random() * messageObjects.length)]
    );
  }, []);

  useEffect(() => {
    // Only run animation if the message has been set
    if (!selectedMessage) return;

    const tl = gsap.timeline({
      delay: 1.0, // Delay to allow crack animation to play first
      defaults: { ease: 'power3.out' },
    });

    if (iconRef.current && paragraphRef.current && buttonRef.current) {
      tl.fromTo(
        iconRef.current,
        { y: 20, scale: 0.8, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1 }
      )
        .fromTo(
          paragraphRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.7'
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

          <div
            ref={iconRef}
            className="mt-8 flex justify-center opacity-0"
          >
            {selectedMessage?.icon}
          </div>

          <p
            ref={paragraphRef}
            className="mx-auto mt-4 max-w-md text-lg text-muted-foreground opacity-0 md:text-xl"
          >
            {selectedMessage?.text || '...'}
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
