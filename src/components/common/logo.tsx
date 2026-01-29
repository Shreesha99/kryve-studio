'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// The new SVG icon component, using currentColor to inherit text color
function ElysiumIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-auto", className)}
      // Preserve aspect ratio, fit within the height of the line
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M25 7H7V13H20V19H7V25H25"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export function Logo() {
  const elysiumRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = elysiumRef.current;
    if (!el) return;
    
    // ResizeObserver is more reliable than timeouts for catching size changes from font loading
    const observer = new ResizeObserver(() => {
        if(el) {
            setWidth(el.offsetWidth);
        }
    });
    
    observer.observe(el);
    
    return () => {
        observer.disconnect();
    };
  }, []);

  return (
    <Link href="/" aria-label="Return to homepage" className="flex items-center justify-center">
      {/* Mobile-only Icon */}
      <div className="md:hidden">
        <ElysiumIcon className="h-8 w-8 text-foreground" />
      </div>

      {/* Desktop Logo */}
      <div className="hidden md:flex md:flex-col md:items-center md:leading-none">
        <span className="-mb-1 text-[0.6rem] font-light tracking-[0.3em] text-muted-foreground">
          THE
        </span>
        <div
          ref={elysiumRef}
          className="flex items-center justify-center font-headline text-2xl font-bold text-foreground"
        >
          {/* The new icon replaces the 'E' */}
          <ElysiumIcon className="mr-1 h-[0.75em] mb-px" />
          <span>LYSIUM</span>
        </div>
        <span
          style={{ width: width > 0 ? `${width}px` : 'auto' }}
          className="flex justify-between text-[0.5rem] font-light uppercase text-foreground/80"
        >
          {'PROJECT'.split('').map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </span>
      </div>
    </Link>
  );
}
