'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export function Cracked404() {
  const leftPartRef = useRef<SVGGElement>(null);
  const rightPartRef = useRef<SVGGElement>(null);
  const crackPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const crackPath = crackPathRef.current;
    if (!crackPath || !leftPartRef.current || !rightPartRef.current) return;

    const length = crackPath.getTotalLength();
    gsap.set(crackPath, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const tl = gsap.timeline({
      delay: 0.5,
      defaults: { ease: 'power2.out' },
    });

    tl.to(crackPath, { strokeDashoffset: 0, duration: 0.2, ease: 'power1.in' })
      .to(
        leftPartRef.current,
        { x: '-=10', y: '+=2', rotation: -1.5, duration: 0.7 },
        '-=0.1'
      )
      .to(
        rightPartRef.current,
        { x: '+=10', y: '-=2', rotation: 1.5, duration: 0.7 },
        '<'
      );
  }, []);

  return (
    <svg
      viewBox="0 0 500 200"
      className="mx-auto w-full max-w-xl drop-shadow-md"
      aria-labelledby="cracked-404-title"
    >
      <title id="cracked-404-title">404 Error</title>
      <defs>
        <text
          id="text404"
          x="250"
          y="150"
          textAnchor="middle"
          className="font-headline fill-current text-primary"
          style={{ fontSize: '150px' }}
        >
          404
        </text>

        <clipPath id="clip-left">
          <polygon points="0,0 248,0 250,40 246,80 252,120 247,160 250,200 0,200" />
        </clipPath>

        <clipPath id="clip-right">
          <polygon points="500,0 248,0 250,40 246,80 252,120 247,160 250,200 500,200" />
        </clipPath>
      </defs>

      <path
        ref={crackPathRef}
        d="M248,0 250,40 246,80 252,120 247,160 250,200"
        stroke="hsl(var(--background))"
        strokeWidth="2"
        fill="none"
      />

      <g ref={leftPartRef} clipPath="url(#clip-left)">
        <use href="#text404" />
      </g>

      <g ref={rightPartRef} clipPath="url(#clip-right)">
        <use href="#text404" />
      </g>
    </svg>
  );
}
