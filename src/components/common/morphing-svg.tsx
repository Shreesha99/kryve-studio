'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function MorphingSvg() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = gsap.utils.toArray<SVGPathElement>('.morph-path', svgRef.current);
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // Ensure all paths start invisible
    gsap.set(paths, { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' });

    paths.forEach((path, i) => {
        tl.to(path, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.inOut' })
          .to(path, { opacity: 0, scale: 0.9, duration: 1.5, ease: 'power2.inOut' }, '+=2');
    });
    
    // Randomize starting point
    tl.seek(Math.random() * tl.duration());

  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full object-contain"
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.3 }} />
        </linearGradient>
         <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
       <g filter="url(#goo)">
        <path
          className="morph-path"
          fill="url(#gradient1)"
          d="M 463.5,326 Q 452,402,388.5,441 Q 325,480,250,477.5 Q 175,475,115,435 Q 55,395,35.5,322.5 Q 16,250,56.5,191 Q 97,132,154,84.5 Q 211,37,250,58 Q 289,79,350.5,101 Q 412,123,437.5,186.5 Q 463,250,463.5,326 Z"
        />
        <path
          className="morph-path"
          fill="url(#gradient1)"
          d="M 445,334.5 Q 439,419,377,455 Q 315,491,250.5,468.5 Q 186,446,122.5,417.5 Q 59,389,35,319.5 Q 11,250,49.5,190.5 Q 88,131,146,92 Q 204,53,267,52 Q 330,51,365.5,110.5 Q 401,170,448,210 Q 495,250,445,334.5 Z"
        />
        <path
          className="morph-path"
          fill="url(#gradient1)"
          d="M 401.3,330.1 C 411.3,400.3 358.3,463.8 290.7,463.8 C 223.1,463.8 178,409.8 141.2,364.5 C 104.4,319.2 75.9,282.5 75.9,233.1 C 75.9,183.7 104.4,121.6 148.1,87.3 C 191.8,53 250.7,46.5 301,84.3 C 351.3,122.1 391.3,260 401.3,330.1 Z"
        />
      </g>
    </svg>
  );
}
