'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

export function InkwellAnimation({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const penRef = useRef<SVGGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
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
    // Offsets are calibrated to the new pen SVG's nib position.
    gsap.set(pen, {
        x: startPoint.x - 20,
        y: startPoint.y - 70,
        opacity: 0,
        rotation: 15,
        transformOrigin: "20px 70px"
    });

    const masterTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
      defaults: { ease: 'power1.inOut' },
    });
    
    tlRef.current = masterTl;

    const penFollowsLine = gsap.timeline();
    const progress = { value: 0 };
    penFollowsLine.to(progress, {
        value: 1,
        duration: 1.5,
        ease: 'none',
        onUpdate: () => {
            const point = line.getPointAtLength(progress.value * lineLength);
            const tangent = line.getPointAtLength(progress.value * lineLength + 0.1);
            const angle = Math.atan2(tangent.y - point.y, tangent.x - point.x) * 180 / Math.PI;
            gsap.set(pen, { 
                x: point.x - 20,
                y: point.y - 70,
                rotation: angle + 15 // Keep the pen angled relative to the path
            });
        }
    });

    masterTl
      .to(pen, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      .to(line, { strokeDashoffset: 0, duration: 1.5, ease: 'none' })
      .add(penFollowsLine, '<') 
      .to(pen, { opacity: 0, y: '-=20', duration: 0.5, ease: 'power2.out' }, '+=0.5')
      .set(line, { strokeDashoffset: lineLength }); 

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
            
            {/* The line to be written - a more elegant curve */}
            <path ref={lineRef} d="M30 55 C 40 45, 60 60, 70 50" className="fill-none stroke-primary" strokeWidth="2" strokeLinecap="round"/>
            
            {/* New, detailed Ink Pen SVG */}
            <g ref={penRef}>
                {/* Main body of the pen */}
                <path d="M75 10 L80 15 L35 60 L30 55 Z" className="fill-foreground" />
                {/* Decorative golden band */}
                <path d="M72 13 L77 18 L72 23 L67 18 Z" className="fill-primary/50" />
                {/* Grip section */}
                <path d="M35 60 L30 55 L22 63 L27 68 Z" className="fill-muted-foreground" />
                {/* The Nib itself */}
                <path d="M22 63 L20 70 L27 68 L22 63 Z" className="fill-primary" />
            </g>
        </svg>
    </div>
  );
}
