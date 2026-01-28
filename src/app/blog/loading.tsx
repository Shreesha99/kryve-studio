'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';

export default function BlogLoading() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bars = gsap.utils.toArray<HTMLDivElement>('.loader-bar', containerRef.current);
    if (bars.length === 0) return;

    const tl = gsap.timeline({ repeat: -1 });

    tl.fromTo(
      bars,
      { scaleY: 0.1, opacity: 0.5 },
      {
        scaleY: 1,
        opacity: 1,
        duration: 0.5,
        stagger: {
          each: 0.1,
          yoyo: true,
          repeat: 1,
        },
        ease: 'power2.inOut',
      }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-background">
        <div ref={containerRef} className="flex items-end justify-center gap-3 h-20">
          <div className="loader-bar h-full w-3 rounded-full bg-primary" />
          <div className="loader-bar h-full w-3 rounded-full bg-primary" />
          <div className="loader-bar h-full w-3 rounded-full bg-primary" />
          <div className="loader-bar h-full w-3 rounded-full bg-primary" />
          <div className="loader-bar h-full w-3 rounded-full bg-primary" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
