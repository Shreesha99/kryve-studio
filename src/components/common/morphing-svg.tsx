'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function MorphingSvg() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = gsap.utils.toArray<SVGPathElement>('.morph-path', svgRef.current);
    const tl = gsap.timeline({ repeat: -1 });

    // Ensure all paths start invisible
    gsap.set(paths, { opacity: 0, scale: 0.95, transformOrigin: '50% 50%' });

    paths.forEach((path) => {
        tl.to(path, { opacity: 1, scale: 1, duration: 1, ease: 'power2.inOut' })
          .to(path, { opacity: 0, scale: 0.95, duration: 1, ease: 'power2.inOut' }, '+=2.5');
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
      stroke="url(#gradient1)"
      strokeWidth="2"
      fill="none"
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.2 }} />
        </linearGradient>
      </defs>
       <g>
        {/* Path 1: Abstract Grid */}
        <path
          className="morph-path"
          d="M 100 100 L 400 100 L 400 400 L 100 400 Z
             M 150 150 L 350 150 L 350 350 L 150 350 Z
             M 100 250 L 400 250
             M 250 100 L 250 400
            "
        />
        {/* Path 2: Circuit-like connections */}
        <path
          className="morph-path"
          d="M 50 50 L 200 50 L 250 100 L 250 200
             L 300 250 L 450 250
             M 50 450 L 200 450 L 250 400 L 250 300
             L 300 250
             M 50 150 L 150 250 L 50 350 Z
            "
        />
        {/* Path 3: Futuristic UI element */}
        <path
          className="morph-path"
          d="M 250 50 L 450 250 L 250 450 L 50 250 Z
             M 100 250 A 150 150 0 1 1 400 250
             A 150 150 0 1 1 100 250
             M 175 250 A 75 75 0 1 1 325 250
             A 75 75 0 1 1 175 250
            "
        />
      </g>
    </svg>
  );
}
