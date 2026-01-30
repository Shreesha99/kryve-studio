'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

export function InkwellAnimation({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const quillRef = useRef<SVGGElement>(null);
  const inkDropRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const quill = quillRef.current;
    const inkDrop = inkDropRef.current;

    if (!svg || !quill || !inkDrop) return;

    gsap.set(quill, { transformOrigin: 'bottom right', rotate: 15 });
    const dropLength = inkDrop.getTotalLength();
    gsap.set(inkDrop, {
      strokeDasharray: dropLength,
      strokeDashoffset: dropLength,
      opacity: 0,
    });

    const masterTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
      defaults: { ease: 'power1.inOut' },
    });

    masterTl
      // Dip the quill
      .to(quill, { y: 20, rotation: 5, duration: 1 })
      // Pull it out
      .to(quill, { y: 0, rotation: 15, duration: 1 })
      // Brief pause
      .to({}, { duration: 0.5 })
      // Animate the ink drop
      .set(inkDrop, { opacity: 1, strokeDashoffset: dropLength })
      .to(inkDrop, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
      .to(inkDrop, { opacity: 0, duration: 0.5 }, '+=0.5');

    return () => {
      masterTl.kill();
    };
  }, []);

  return (
    <div className={cn("relative h-32 w-32", className)}>
        <svg ref={svgRef} viewBox="0 0 100 100" className="h-full w-full">
            {/* Inkwell */}
            <path
                d="M30 85 C 20 85, 20 70, 30 70 L 70 70 C 80 70, 80 85, 70 85 Z"
                className="fill-secondary stroke-foreground"
                strokeWidth="1.5"
            />
            <path
                d="M35 70 C 35 60, 65 60, 65 70"
                className="fill-none stroke-foreground"
                strokeWidth="1.5"
            />
            {/* Quill */}
            <g ref={quillRef}>
                <path
                    d="M 80 10 L 50 70"
                    className="stroke-foreground"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <path
                    d="M 80 10 C 85 20, 85 30, 75 40 M 75 20 C 80 30, 80 40, 70 50 M 70 30 C 75 40, 75 50, 65 60"
                    className="fill-none stroke-foreground"
                    strokeWidth="1"
                    strokeLinecap="round"
                />
            </g>
            {/* Ink Drop/Scribble Animation */}
            <path
                ref={inkDropRef}
                d="M45 60 C 50 55, 60 65, 65 60"
                className="fill-none stroke-primary"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    </div>
  );
}
