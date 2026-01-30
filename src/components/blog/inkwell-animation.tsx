'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

export function InkwellAnimation({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const penRef = useRef<SVGGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const pen = penRef.current;
    const line = lineRef.current;

    if (!svg || !pen || !line) return;

    const lineLength = line.getTotalLength();
    gsap.set(line, {
      strokeDasharray: lineLength,
      strokeDashoffset: lineLength,
    });
    
    // Position pen at the start of the line path
    const startPoint = line.getPointAtLength(0);
    gsap.set(pen, {
        x: startPoint.x - 55, // Adjustments to position pen tip correctly
        y: startPoint.y - 65,
        rotation: 15,
        transformOrigin: 'bottom right',
        opacity: 0,
    });

    const masterTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
      defaults: { ease: 'power1.inOut' },
    });

    masterTl
      .to(pen, { opacity: 1, duration: 0.5 })
      .to(line, { strokeDashoffset: 0, duration: 1.5, ease: 'none' })
      .to(pen, {
          x: '+=40', // Move pen across the line path
          duration: 1.5,
          ease: 'none',
      }, '<')
      .to(pen, { opacity: 0, y: '-=10', duration: 0.5, ease: 'power2.out' })
      .set(line, { strokeDashoffset: lineLength })
      .set(pen, { x: startPoint.x - 55, y: startPoint.y - 65, opacity: 0 });

    return () => {
      masterTl.kill();
    };
  }, []);

  return (
    <div className={cn("relative h-40 w-40", className)}>
        <svg ref={svgRef} viewBox="0 0 100 100" className="h-full w-full">
            {/* Notepad */}
            <rect x="15" y="20" width="70" height="60" rx="3" className="fill-card stroke-foreground/30" strokeWidth="1.5"/>
            <path d="M 15 28 h 70" className="stroke-muted-foreground/30" strokeWidth="0.5" />
            <path d="M 15 36 h 70" className="stroke-muted-foreground/30" strokeWidth="0.5" />
            <path d="M 15 44 h 70" className="stroke-muted-foreground/30" strokeWidth="0.5" />
            <path d="M 15 52 h 70" className="stroke-muted-foreground/30" strokeWidth="0.5" />
            <path d="M 15 60 h 70" className="stroke-muted-foreground/30" strokeWidth="0.5" />
            <path d="M 15 68 h 70" className="stroke-muted-foreground/30" strokeWidth="0.5" />
            
            {/* The line to be written */}
            <path ref={lineRef} d="M30 46 C 40 50, 60 42, 70 46" className="fill-none stroke-primary" strokeWidth="2" strokeLinecap="round"/>
            
            {/* Pen */}
            <g ref={penRef}>
                <path d="M 80 15 L 95 30 L 65 60 L 50 45 Z" className="fill-foreground" />
                <path d="M 50 45 L 48 47 L 78 77 L 80 75 Z" className="fill-muted-foreground" />
                <rect x="78" y="28" width="14" height="4" rx="1" transform="rotate(45 85 30)" className="fill-primary"/>
            </g>
        </svg>
    </div>
  );
}
