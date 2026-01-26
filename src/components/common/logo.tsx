'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';

export function Logo() {
  const zenithRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (zenithRef.current) {
        setWidth(zenithRef.current.offsetWidth);
      }
    };

    // A short delay to allow for font loading, then set width
    const timeoutId = setTimeout(updateWidth, 100);

    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <Link href="/" className="flex flex-col items-center leading-none">
      <span ref={zenithRef} className="font-headline text-2xl font-bold">
        ZENITH
      </span>
      <span
        style={{ width: width > 0 ? `${width}px` : 'auto' }}
        className="flex justify-between text-[0.5rem] font-light uppercase"
      >
        {'STUDIOS'.split('').map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </span>
    </Link>
  );
}
