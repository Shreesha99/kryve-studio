'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

export function InkwellAnimation({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const penRef = useRef<SVGGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  
  // A ref to hold the animation timeline
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Kill any existing animation on re-render
    if (tlRef.current) {
      tlRef.current.kill();
    }
    
    const svg = svgRef.current;
    const pen = penRef.current;
    const line = lineRef.current;

    if (!svg || !pen || !line) return;

    const lineLength = line.getTotalLength();
    gsap.set(line, {
      strokeDasharray: lineLength,
      strokeDashoffset: lineLength,
    });
    
    const startPoint = line.getPointAtLength(0);
    // Position pen so the nib is at the start of the line.
    // These offsets depend on the pen's SVG structure.
    // Pen's nib is at approx (25, 75) in its own coordinate system.
    gsap.set(pen, {
        x: startPoint.x - 25,
        y: startPoint.y - 75,
        opacity: 0,
    });

    const masterTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
      defaults: { ease: 'power1.inOut' },
    });
    
    tlRef.current = masterTl;

    // Timeline for the pen following the path
    const penFollowsLine = gsap.timeline();
    const progress = { value: 0 };
    penFollowsLine.to(progress, {
        value: 1,
        duration: 1.5,
        ease: 'none',
        onUpdate: () => {
            const point = line.getPointAtLength(progress.value * lineLength);
            gsap.set(pen, { x: point.x - 25, y: point.y - 75 });
        }
    });

    masterTl
      .to(pen, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      .to(line, { strokeDashoffset: 0, duration: 1.5, ease: 'none' })
      .add(penFollowsLine, '<') // Animate pen movement simultaneously with line drawing
      .to(pen, { opacity: 0, y: '-=20', duration: 0.5, ease: 'power2.out' }, '+=0.5')
      .set(line, { strokeDashoffset: lineLength }); // Reset for the next loop

    return () => {
      tlRef.current?.kill();
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
            
            {/* New Pen SVG */}
            <g ref={penRef}>
                <path d="M 70 20 L 80 30 L 40 70 L 30 60 Z" className="fill-foreground"/>
                <path d="M 40 70 L 30 60 L 25 65 L 35 75 Z" className="fill-muted-foreground"/>
                <path d="M 25 65 L 35 75 L 28 82 L 18 72 Z" className="fill-primary"/>
                <path d="M 65 25 L 75 35 L 55 55 L 45 45 Z" className="fill-primary/50"/>
            </g>
        </svg>
    </div>
  );
}
