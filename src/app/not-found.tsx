'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';

function ConfusedAvatar() {
  const avatarRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    const face = avatar.querySelector('.face');
    const questionMark = avatar.querySelector('.question-mark');

    gsap.set(avatar, { autoAlpha: 0, y: 50, scale: 0.9 });
    if (questionMark) {
      gsap.set(questionMark, {
        autoAlpha: 0,
        scale: 0,
        transformOrigin: 'bottom center',
      });
    }

    const tl = gsap.timeline({
      delay: 0.8,
      defaults: { ease: 'power3.out' },
    });

    tl.to(avatar, { autoAlpha: 1, y: 0, scale: 1, duration: 1 });
    if (questionMark) {
      tl.to(
        questionMark,
        { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
        '-=0.5'
      );
    }
    if (face) {
      tl.to(
        face,
        {
          rotation: 5,
          transformOrigin: 'center',
          duration: 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        },
        0
      );
    }
  }, []);

  return (
    <div className="relative z-0 mb-8">
      <svg ref={avatarRef} width="200" height="200" viewBox="0 0 200 200">
        <g className="face">
          <circle cx="100" cy="100" r="80" fill="hsl(var(--muted))" />
          <circle cx="80" cy="90" r="8" fill="hsl(var(--foreground))" />
          <circle cx="120" cy="90" r="8" fill="hsl(var(--foreground))" />
          <path
            d="M 90 130 Q 100 120 110 130"
            stroke="hsl(var(--foreground))"
            strokeWidth="4"
            fill="none"
          />
        </g>
        <g className="question-mark">
          <text
            x="100"
            y="50"
            fontFamily="Poppins, sans-serif"
            fontSize="80"
            fontWeight="bold"
            textAnchor="middle"
            fill="hsl(var(--primary))"
          >
            ?
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function NotFound() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.2,
      defaults: { ease: 'power3.out' },
    });

    if (titleRef.current && paragraphRef.current && buttonRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 50, opacity: 0, scale: 1.1 },
        { y: 0, opacity: 1, scale: 1, duration: 1 }
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
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 text-center">
        <ConfusedAvatar />
        <div className="relative z-10">
          <h1
            ref={titleRef}
            className="font-headline text-8xl font-bold tracking-tighter text-primary sm:text-9xl md:text-[10rem] lg:text-[12rem]"
          >
            404
          </h1>
          <p
            ref={paragraphRef}
            className="mt-4 text-lg text-muted-foreground md:text-xl"
          >
            Oops! The page you are looking for has been lost in space.
          </p>
          <div ref={buttonRef} className="mt-8">
            <Button asChild size="lg">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}