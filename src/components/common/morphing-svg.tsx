'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function MorphingSvg() {
  const svgRef = useRef<SVGSVGElement>(null);

  const codeImageRef = useRef<SVGTextElement>(null);
  const codeTitleRef = useRef<SVGTextElement>(null);
  const codeTextRef = useRef<SVGTextElement>(null);
  const codeButtonRef = useRef<SVGTextElement>(null);

  const uiImageRef = useRef<SVGGElement>(null);
  const uiTitleRef = useRef<SVGRectElement>(null);
  const uiTextRef = useRef<SVGGElement>(null);
  const uiButtonRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const codeElements = [codeImageRef.current, codeTitleRef.current, codeTextRef.current, codeButtonRef.current];
    const uiElements = [uiImageRef.current, uiTitleRef.current, uiTextRef.current, uiButtonRef.current];

    gsap.set([...codeElements, ...uiElements], { autoAlpha: 0 });

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
      defaults: { ease: 'power2.out', duration: 0.8 }
    });

    const codeXStart = 20;
    const codeXEnd = 180;

    tl.addLabel("start")
      // Animate in code components
      .to(codeElements, { autoAlpha: 1, x: codeXStart, stagger: 0.5 })
      .addLabel("build", "+=0.5")

      // Animate code across and build UI
      .to(codeImageRef.current, { x: codeXEnd, autoAlpha: 0 }, "build")
      .fromTo(uiImageRef.current, { autoAlpha: 0, scale: 0.8, transformOrigin: 'center' }, { autoAlpha: 1, scale: 1 }, "build+=0.4")

      .to(codeTitleRef.current, { x: codeXEnd, autoAlpha: 0 }, "build+=0.5")
      .fromTo(uiTitleRef.current, { autoAlpha: 0, scale: 0.8, transformOrigin: 'center' }, { autoAlpha: 1, scale: 1 }, "build+=0.9")

      .to(codeTextRef.current, { x: codeXEnd, autoAlpha: 0 }, "build+=1.0")
      .fromTo(uiTextRef.current, { autoAlpha: 0, scale: 0.8, transformOrigin: 'center' }, { autoAlpha: 1, scale: 1 }, "build+=1.4")

      .to(codeButtonRef.current, { x: codeXEnd, autoAlpha: 0 }, "build+=1.5")
      .fromTo(uiButtonRef.current, { autoAlpha: 0, scale: 0.8, transformOrigin: 'center' }, { autoAlpha: 1, scale: 1 }, "build+=1.9")
      
      .addLabel("end", "+=2")

      // Disappear
      .to(uiElements, { autoAlpha: 0, stagger: 0.3, ease: 'power2.in' }, "end");

    return () => tl.kill();
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 500 500" className="h-full w-full object-contain">
      <defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap');
            .code-text {
              font-family: 'Roboto Mono', monospace;
              font-weight: 500;
              font-size: 22px;
              fill: hsl(var(--muted-foreground));
            }
          `}
        </style>
        <linearGradient id="build-line-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* The "Build" Line */}
      <line x1="250" y1="50" x2="250" y2="450" stroke="url(#build-line-gradient)" strokeWidth="2" />

      {/* Code Components */}
      <g>
        <text ref={codeImageRef} y="130" className="code-text">&lt;Image /&gt;</text>
        <text ref={codeTitleRef} y="200" className="code-text">&lt;Title /&gt;</text>
        <text ref={codeTextRef} y="280" className="code-text">&lt;Text /&gt;</text>
        <text ref={codeButtonRef} y="395" className="code-text">&lt;Button /&gt;</text>
      </g>
      
      {/* UI Wireframe */}
      <g transform="translate(280, 0)">
        {/* Image placeholder */}
        <g ref={uiImageRef}>
          <rect y="80" width="190" height="100" rx="8" fill="hsl(var(--secondary))" />
          <circle cx="40" cy="130" r="15" fill="hsl(var(--primary) / 0.2)" />
          <path d="M 65 150 L 95 120 L 125 140 L 150 110 L 190 135" stroke="hsl(var(--primary) / 0.3)" strokeWidth="4" fill="none" />
        </g>
        
        {/* Title placeholder */}
        <rect ref={uiTitleRef} y="195" width="120" height="14" rx="4" fill="hsl(var(--foreground) / 0.8)"/>
        
        {/* Text placeholders */}
        <g ref={uiTextRef}>
          <rect y="240" width="190" height="10" rx="3" fill="hsl(var(--muted-foreground) / 0.7)"/>
          <rect y="260" width="190" height="10" rx="3" fill="hsl(var(--muted-foreground) / 0.7)"/>
          <rect y="280" width="140" height="10" rx="3" fill="hsl(var(--muted-foreground) / 0.7)"/>
        </g>

        {/* Button placeholder */}
        <rect ref={uiButtonRef} y="370" width="100" height="35" rx="6" fill="hsl(var(--primary))" />
      </g>
    </svg>
  );
}
