'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function MorphingSvg() {
  const svgRef = useRef<SVGSVGElement>(null);

  // General Refs
  const cursorRef = useRef<SVGGElement>(null);
  const buildLineRef = useRef<SVGLineElement>(null);

  // Batch 1 Refs
  const codeButtonRef = useRef<SVGTextElement>(null);
  const codeInputRef = useRef<SVGTextElement>(null);
  const codeToggleRef = useRef<SVGTextElement>(null);
  const codeImageRef = useRef<SVGTextElement>(null);

  const uiButtonRef = useRef<SVGGElement>(null);
  const uiInputRef = useRef<SVGGElement>(null);
  const uiInputCaretRef = useRef<SVGLineElement>(null);
  const uiToggleRef = useRef<SVGGElement>(null);
  const uiToggleKnobRef = useRef<SVGRectElement>(null);
  const uiImageRef = useRef<SVGGElement>(null);
  const uiImageSunRef = useRef<SVGCircleElement>(null);
  const uiImageMountain1Ref = useRef<SVGPathElement>(null);
  const uiImageMountain2Ref = useRef<SVGPathElement>(null);

  // Batch 2 Refs
  const codeDropdownRef = useRef<SVGTextElement>(null);
  const codeSliderRef = useRef<SVGTextElement>(null);
  const codeCheckboxRef = useRef<SVGTextElement>(null);
  const codeChartRef = useRef<SVGTextElement>(null);

  const uiDropdownRef = useRef<SVGGElement>(null);
  const uiDropdownMenuRef = useRef<SVGGElement>(null);
  const uiSliderRef = useRef<SVGGElement>(null);
  const uiSliderHandleRef = useRef<SVGCircleElement>(null);
  const uiCheckboxRef = useRef<SVGGElement>(null);
  const uiCheckboxCheckRef = useRef<SVGPathElement>(null);
  const uiChartRef = useRef<SVGGElement>(null);
  const uiChartLineRef = useRef<SVGPathElement>(null);


  useEffect(() => {
    if (!svgRef.current) return;
    const { current: svg } = svgRef;

    const codeElements = [
        codeButtonRef.current, codeInputRef.current, codeToggleRef.current, codeImageRef.current,
        codeDropdownRef.current, codeSliderRef.current, codeCheckboxRef.current, codeChartRef.current
    ];
    const uiElements = [
        uiButtonRef.current, uiInputRef.current, uiToggleRef.current, uiImageRef.current,
        uiDropdownRef.current, uiSliderRef.current, uiCheckboxRef.current, uiChartRef.current,
        cursorRef.current
    ];

    gsap.set(codeElements, { autoAlpha: 0, x: 20 });
    gsap.set(uiElements, { autoAlpha: 0 });
    gsap.set(cursorRef.current, { x: 250, y: -50, autoAlpha: 1 });
    gsap.set(uiDropdownMenuRef.current, { autoAlpha: 0, scaleY: 0, transformOrigin: 'top center' });
    
    // Prepare "draw" animations
    [uiCheckboxCheckRef, uiChartLineRef, uiImageMountain1Ref, uiImageMountain2Ref].forEach(ref => {
        if(ref.current) {
            const length = ref.current.getTotalLength();
            gsap.set(ref.current, { strokeDasharray: length, strokeDashoffset: length });
        }
    });

    const masterTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    const codeXEnd = 180;
    const uiXStart = 280;

    const createBatchAnimation = (
        codeRefs: (React.RefObject<SVGTextElement>)[],
        uiRefs: (React.RefObject<SVGGElement>)[],
        interactionCallback: (tl: gsap.core.Timeline) => void
    ) => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.6 }});

        // 1. Animate code in
        tl.to(codeRefs.map(r => r.current), { autoAlpha: 1, stagger: 0.3 });

        // 2. Animate code across and build UI
        tl.add(() => {
            codeRefs.forEach((codeRef, i) => {
                const uiRef = uiRefs[i];
                if (!codeRef.current || !uiRef.current) return;
                
                const buildTl = gsap.timeline();
                buildTl.to(codeRef.current, { x: codeXEnd, autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
                         .fromTo(uiRef.current, 
                            { autoAlpha: 0, scale: 0.8, transformOrigin: 'center' }, 
                            { autoAlpha: 1, scale: 1, duration: 0.5 }, 
                            ">-0.2");
            });
        }, "+=1");

        // 3. Play micro-interactions
        tl.add(() => interactionCallback(tl), "+=1.5");
        
        // 4. Fade out
        tl.to([...uiRefs.map(r => r.current), cursorRef.current], { autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, "+=2");
        tl.set(cursorRef.current, { x: 250, y: -50, autoAlpha: 1}); // Reset cursor
        tl.set(codeRefs.map(r => r.current), { x: 20 }); // Reset code positions

        return tl;
    }

    const batch1Interactions = (tl: gsap.core.Timeline) => {
        if (!cursorRef.current) return;
        const cursor = cursorRef.current;
        
        // Button Click
        tl.to(cursor, { x: uiXStart + 50, y: 72, duration: 0.5 });
        tl.to(uiButtonRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center' });

        // Input typing
        tl.to(cursor, { x: uiXStart + 130, y: 142, duration: 0.5 }, "+=0.3");
        tl.set(uiInputCaretRef.current, { autoAlpha: 1 });
        tl.to(uiInputCaretRef.current, { autoAlpha: 0, repeat: 3, yoyo: true, duration: 0.3, ease: 'steps(1)' });
        tl.set(uiInputCaretRef.current, { autoAlpha: 0 });

        // Toggle Switch
        tl.to(cursor, { x: uiXStart + 22, y: 212, duration: 0.5 }, "+=0.3");
        tl.to(uiToggleKnobRef.current, { x: '+=24', duration: 0.4, ease: 'power2.inOut' });
        
        // Image Draw
        tl.to(cursor, { x: uiXStart + 95, y: 350, duration: 0.5 }, "+=0.3");
        tl.to(uiImageSunRef.current, { attr: { cy: 290 }, duration: 0.5, ease: 'power1.out'});
        tl.to(uiImageMountain1Ref.current, { strokeDashoffset: 0, duration: 0.7 }, '-=0.3');
        tl.to(uiImageMountain2Ref.current, { strokeDashoffset: 0, duration: 0.7 }, '-=0.5');
    };

    const batch2Interactions = (tl: gsap.core.Timeline) => {
        if (!cursorRef.current) return;
        const cursor = cursorRef.current;
        
        // Dropdown
        tl.to(cursor, { x: uiXStart + 130, y: 72, duration: 0.5 });
        tl.to(uiDropdownRef.current, { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center' });
        tl.to(uiDropdownMenuRef.current, { autoAlpha: 1, scaleY: 1, duration: 0.4 }, "-=0.1");
        tl.to(uiDropdownMenuRef.current, { autoAlpha: 0, scaleY: 0, duration: 0.4 }, "+=1");

        // Slider
        tl.to(cursor, { x: uiXStart + 35, y: 142, duration: 0.5 }, "+=0.3");
        tl.to(uiSliderHandleRef.current, { x: '+=100', duration: 1, ease: 'power1.inOut' });
        tl.to(uiSliderHandleRef.current, { x: '-=100', duration: 1, ease: 'power1.inOut' }, "+=0.2");
        
        // Checkbox
        tl.to(cursor, { x: uiXStart + 15, y: 212, duration: 0.5 }, "+=0.3");
        tl.to(uiCheckboxRef.current, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center' });
        tl.to(uiCheckboxCheckRef.current, { strokeDashoffset: 0, duration: 0.5 });
        
        // Chart
        tl.to(cursor, { x: uiXStart + 95, y: 350, duration: 0.5 }, "+=0.3");
        tl.to(uiChartLineRef.current, { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' });
    };

    masterTl
      .add(createBatchAnimation(
        [codeButtonRef, codeInputRef, codeToggleRef, codeImageRef],
        [uiButtonRef, uiInputRef, uiToggleRef, uiImageRef],
        batch1Interactions
      ))
      .add(createBatchAnimation(
        [codeDropdownRef, codeSliderRef, codeCheckboxRef, codeChartRef],
        [uiDropdownRef, uiSliderRef, uiCheckboxRef, uiChartRef],
        batch2Interactions
      ), '+=1');

    return () => {
        masterTl.kill();
    };
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 500 500" className="h-full w-full object-contain">
      <defs>
        <style>
          {`
            .code-text {
              font-family: 'Roboto Mono', monospace;
              font-weight: 500;
              font-size: 18px;
              fill: hsl(var(--muted-foreground));
            }
          `}
        </style>
        <linearGradient id="build-line-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
        <g id="cursor" ref={cursorRef}>
            <path fill="hsl(var(--foreground))" d="M11.22,9.45,3.95,2.18A1.07,1.07,0,0,0,2.44,2.18L2.18,2.44a1.07,1.07,0,0,0,0,1.51l7.27,7.27-2.3,6.89a1.06,1.06,0,0,0,1,1.33,1,1,0,0,0,.32-.06l7.15-2.4a1.07,1.07,0,0,0,.68-1Z"/>
        </g>
      </defs>

      {/* The "Build" Line */}
      <line ref={buildLineRef} x1="250" y1="20" x2="250" y2="480" stroke="url(#build-line-gradient)" strokeWidth="2" />

      {/* Code Components */}
      <g>
        {/* Batch 1 */}
        <text ref={codeButtonRef} y="75" className="code-text">&lt;Button /&gt;</text>
        <text ref={codeInputRef} y="145" className="code-text">&lt;Input /&gt;</text>
        <text ref={codeToggleRef} y="215" className="code-text">&lt;Toggle /&gt;</text>
        <text ref={codeImageRef} y="330" className="code-text">&lt;Image /&gt;</text>
        {/* Batch 2 */}
        <text ref={codeDropdownRef} y="75" className="code-text">&lt;Dropdown /&gt;</text>
        <text ref={codeSliderRef} y="145" className="code-text">&lt;Slider /&gt;</text>
        <text ref={codeCheckboxRef} y="215" className="code-text">&lt;Checkbox /&gt;</text>
        <text ref={codeChartRef} y="330" className="code-text">&lt;Chart /&gt;</text>
      </g>
      
      {/* UI Wireframe */}
      <g transform="translate(280, 0)">
        {/* === BATCH 1 === */}
        {/* Button */}
        <g ref={uiButtonRef}>
            <rect y="50" width="100" height="35" rx="6" fill="hsl(var(--primary))" />
            <text x="50" y="73" textAnchor="middle" fontSize="12" fontWeight="bold" fill="hsl(var(--primary-foreground))">SUBMIT</text>
        </g>
        
        {/* Input */}
        <g ref={uiInputRef}>
            <rect y="120" width="140" height="35" rx="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
            <line ref={uiInputCaretRef} x1="12" y1="128" x2="12" y2="147" stroke="hsl(var(--foreground))" strokeWidth="2" opacity="0" />
        </g>
        
        {/* Toggle */}
        <g ref={uiToggleRef}>
            <rect y="198" width="50" height="26" rx="13" fill="hsl(var(--secondary))" />
            <rect ref={uiToggleKnobRef} x="4" y="201" width="20" height="20" rx="10" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1"/>
        </g>

        {/* Image */}
        <g ref={uiImageRef}>
          <rect y="260" width="190" height="120" rx="8" fill="hsl(var(--secondary))" />
          <circle ref={uiImageSunRef} cx="150" cy="370" r="12" fill="hsl(var(--primary) / 0.5)" />
          <path ref={uiImageMountain1Ref} d="M 20 380 L 60 320 L 100 360" stroke="hsl(var(--primary) / 0.4)" strokeWidth="4" fill="none" />
          <path ref={uiImageMountain2Ref} d="M 80 380 L 120 290 L 170 380" stroke="hsl(var(--primary) / 0.4)" strokeWidth="4" fill="none" />
        </g>

        {/* === BATCH 2 === */}
        {/* Dropdown */}
        <g ref={uiDropdownRef}>
            <rect y="50" width="140" height="35" rx="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
            <path d="M 120 62 l 5 5 l 5 -5" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <g ref={uiDropdownMenuRef} transform="translate(0, 90)">
                <rect width="140" height="90" rx="6" fill="hsl(var(--background))" stroke="hsl(var(--border))"/>
                <rect x="5" y="5" width="130" height="25" rx="4" fill="hsl(var(--accent))"/>
                <rect x="5" y="35" width="130" height="25" rx="4" fill="hsl(var(--secondary))"/>
                <rect x="5" y="65" width="130" height="25" rx="4" fill="hsl(var(--secondary))"/>
            </g>
        </g>
        
        {/* Slider */}
        <g ref={uiSliderRef}>
            <rect y="137" width="140" height="10" rx="5" fill="hsl(var(--secondary))"/>
            <rect y="137" width="40" height="10" rx="5" fill="hsl(var(--primary))"/>
            <circle ref={uiSliderHandleRef} cx="40" cy="142" r="8" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" />
        </g>
        
        {/* Checkbox */}
        <g ref={uiCheckboxRef}>
            <rect y="198" width="26" height="26" rx="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))"/>
            <path ref={uiCheckboxCheckRef} d="M 7 210 l 5 5 l 10 -10" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        
        {/* Chart */}
        <g ref={uiChartRef}>
          <rect y="260" width="190" height="120" rx="8" fill="hsl(var(--secondary))" />
          <path d="M 10 370 L 10 270 M 10 370 L 190 370" stroke="hsl(var(--muted-foreground)/0.5)" strokeWidth="2" />
          <path ref={uiChartLineRef} d="M 10 350 Q 50 280, 90 320 T 170 290" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
        </g>

      </g>
    </svg>
  );
}
