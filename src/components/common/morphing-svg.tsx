'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function MorphingSvg() {
  const svgRef = useRef<SVGSVGElement>(null);

  // General Refs
  const cursorRef = useRef<SVGGElement>(null);

  // Code Refs
  const codeButtonRef = useRef<SVGTextElement>(null);
  const codeInputRef = useRef<SVGTextElement>(null);
  const codeToggleRef = useRef<SVGTextElement>(null);
  const codeImageRef = useRef<SVGTextElement>(null);
  const codeDropdownRef = useRef<SVGTextElement>(null);
  const codeSliderRef = useRef<SVGTextElement>(null);
  const codeCheckboxRef = useRef<SVGTextElement>(null);
  const codeChartRef = useRef<SVGTextElement>(null);

  // UI Refs
  const uiButtonRef = useRef<SVGGElement>(null);
  const uiInputRef = useRef<SVGGElement>(null);
  const uiInputCaretRef = useRef<SVGLineElement>(null);
  const uiToggleRef = useRef<SVGGElement>(null);
  const uiToggleKnobRef = useRef<SVGRectElement>(null);
  const uiImageRef = useRef<SVGGElement>(null);
  const uiImageSunRef = useRef<SVGCircleElement>(null);
  const uiImageMountain1Ref = useRef<SVGPathElement>(null);
  const uiImageMountain2Ref = useRef<SVGPathElement>(null);
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
    
    const codeElements = [
        codeButtonRef, codeInputRef, codeToggleRef, codeImageRef,
        codeDropdownRef, codeSliderRef, codeCheckboxRef, codeChartRef
    ];
    const uiElements = [
        uiButtonRef, uiInputRef, uiToggleRef, uiImageRef,
        uiDropdownRef, uiSliderRef, uiCheckboxRef, uiChartRef,
    ];
    const drawableElements = [uiCheckboxCheckRef, uiChartLineRef, uiImageMountain1Ref, uiImageMountain2Ref];

    // --- INITIAL SETUP ---
    gsap.set([...codeElements.map(r=>r.current), ...uiElements.map(r=>r.current), cursorRef.current], { autoAlpha: 0 });
    gsap.set(codeElements.map(r => r.current), { x: 20 });
    gsap.set(cursorRef.current, { x: 250, y: -50 });
    gsap.set(uiDropdownMenuRef.current, { autoAlpha: 0, scaleY: 0, transformOrigin: 'top center' });
    
    drawableElements.forEach(ref => {
        if(ref.current) {
            const length = ref.current.getTotalLength();
            gsap.set(ref.current, { strokeDasharray: length, strokeDashoffset: length });
        }
    });

    const masterTl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    const codeXEnd = 180;
    const stageY = 250;
    
    // --- ANIMATION CREATION HELPER ---
    const createComponentAnimation = (
        codeRef: React.RefObject<SVGTextElement>,
        uiRef: React.RefObject<SVGGElement>,
        uiSetup: () => void,
        interaction: (tl: gsap.core.Timeline) => void
    ) => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        // 1. Show code at stage center
        const codeBBox = (codeRef.current as SVGTextElement).getBBox();
        tl.fromTo(codeRef.current, 
          { autoAlpha: 0, y: stageY - codeBBox.height / 2 },
          { autoAlpha: 1, duration: 0.5 }
        );
        
        // 2. Build UI
        tl.to(codeRef.current, { x: codeXEnd, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, "+=1");
        
        const uiBBox = (uiRef.current as SVGGElement).getBBox();
        const uiX = 280 + (220 - uiBBox.width) / 2;
        const uiY = stageY - uiBBox.height / 2;

        tl.fromTo(uiRef.current, 
            { autoAlpha: 0, scale: 0.8, x: uiX - uiBBox.x, y: uiY - uiBBox.y }, 
            { autoAlpha: 1, scale: 1, duration: 0.8 }, 
            ">-0.5");
        
        tl.add(uiSetup);

        // 3. Interaction
        interaction(tl);

        // 4. Fade out
        tl.to([uiRef.current, cursorRef.current], { autoAlpha: 0, duration: 0.5 }, "+=1.5");
        
        // 5. Reset code for next loop
        tl.set(codeRef.current, { x: 20 });
        
        return tl;
    }

    // --- INTERACTION DEFINITIONS ---
    const buttonInteraction = (tl: gsap.core.Timeline) => {
      const uiBBox = uiButtonRef.current!.getBBox();
      const uiX = 280 + (220 - uiBBox.width) / 2;
      const uiY = stageY - uiBBox.height / 2;
      tl.to(cursorRef.current, { autoAlpha: 1, x: uiX + uiBBox.width / 2, y: uiY + uiBBox.height / 2, duration: 0.5 });
      tl.to(uiButtonRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center' });
    };
    
    const inputInteraction = (tl: gsap.core.Timeline) => {
      const uiBBox = uiInputRef.current!.getBBox();
      const uiX = 280 + (220 - uiBBox.width) / 2;
      const uiY = stageY - uiBBox.height / 2;
      tl.to(cursorRef.current, { autoAlpha: 1, x: uiX + uiBBox.width - 10, y: uiY + uiBBox.height / 2, duration: 0.5 });
      tl.set(uiInputCaretRef.current, { autoAlpha: 1 });
      tl.to(uiInputCaretRef.current, { autoAlpha: 0, repeat: 3, yoyo: true, duration: 0.3, ease: 'steps(1)' });
      tl.set(uiInputCaretRef.current, { autoAlpha: 0 });
    };

    const toggleInteraction = (tl: gsap.core.Timeline) => {
        const uiBBox = uiToggleRef.current!.getBBox();
        const uiX = 280 + (220 - uiBBox.width) / 2;
        const uiY = stageY - uiBBox.height / 2;
        tl.to(cursorRef.current, { autoAlpha: 1, x: uiX + uiBBox.width / 2, y: uiY + uiBBox.height / 2, duration: 0.5 });
        tl.to(uiToggleKnobRef.current, { attr: {x: 28}, duration: 0.4, ease: 'power2.inOut' });
        tl.to(uiToggleKnobRef.current, { attr: {x: 4}, duration: 0.4, ease: 'power2.inOut' }, "+=0.5");
    };

    const imageInteraction = (tl: gsap.core.Timeline) => {
        tl.to(uiImageSunRef.current, { attr: { cy: 30 }, duration: 0.8, ease: 'power1.out'});
        tl.to(uiImageMountain1Ref.current, { strokeDashoffset: 0, duration: 1 }, '-=0.3');
        tl.to(uiImageMountain2Ref.current, { strokeDashoffset: 0, duration: 1 }, '-=0.7');
    };
    
    const dropdownInteraction = (tl: gsap.core.Timeline) => {
        const uiBBox = uiDropdownRef.current!.getBBox();
        const uiX = 280 + (220 - uiBBox.width) / 2;
        const uiY = stageY - uiBBox.height / 2;
        tl.to(cursorRef.current, { autoAlpha: 1, x: uiX + uiBBox.width / 2, y: uiY + uiBBox.height / 2, duration: 0.5 });
        tl.to(uiDropdownRef.current, { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center' });
        tl.to(uiDropdownMenuRef.current, { autoAlpha: 1, scaleY: 1, duration: 0.4 }, "-=0.1");
        tl.to(uiDropdownMenuRef.current, { autoAlpha: 0, scaleY: 0, duration: 0.4 }, "+=1");
    };

    const sliderInteraction = (tl: gsap.core.Timeline) => {
        const uiBBox = uiSliderRef.current!.getBBox();
        const uiX = 280 + (220 - uiBBox.width) / 2;
        const uiY = stageY - uiBBox.height / 2;
        tl.to(cursorRef.current, { autoAlpha: 1, x: uiX + 40, y: uiY + 5, duration: 0.5 });
        tl.to(uiSliderHandleRef.current, { attr: {cx: 140}, duration: 1, ease: 'power1.inOut' });
        tl.to(uiSliderHandleRef.current, { attr: {cx: 40}, duration: 1, ease: 'power1.inOut' }, "+=0.2");
    };

    const checkboxInteraction = (tl: gsap.core.Timeline) => {
        const uiBBox = uiCheckboxRef.current!.getBBox();
        const uiX = 280 + (220 - uiBBox.width) / 2;
        const uiY = stageY - uiBBox.height / 2;
        tl.to(cursorRef.current, { autoAlpha: 1, x: uiX + uiBBox.width/2, y: uiY + uiBBox.height/2, duration: 0.5 });
        tl.to(uiCheckboxRef.current, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center' });
        tl.to(uiCheckboxCheckRef.current, { strokeDashoffset: 0, duration: 0.5 });
    };

    const chartInteraction = (tl: gsap.core.Timeline) => {
        tl.to(uiChartLineRef.current, { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' });
    };

    // --- BUILD MASTER TIMELINE ---
    masterTl
        .add(createComponentAnimation(codeButtonRef, uiButtonRef, () => {}, buttonInteraction))
        .add(createComponentAnimation(codeInputRef, uiInputRef, () => {}, inputInteraction))
        .add(createComponentAnimation(codeToggleRef, uiToggleRef, () => {gsap.set(uiToggleKnobRef.current, {attr: {x:4}})}, toggleInteraction))
        .add(createComponentAnimation(codeImageRef, uiImageRef, () => {
            gsap.set(uiImageSunRef.current, { attr: { cy: 110 } });
            [uiImageMountain1Ref, uiImageMountain2Ref].forEach(ref => {
                if (ref.current) {
                    const length = ref.current.getTotalLength();
                    gsap.set(ref.current, { strokeDasharray: length, strokeDashoffset: length });
                }
            });
        }, imageInteraction))
        .add(createComponentAnimation(codeDropdownRef, uiDropdownRef, () => {}, dropdownInteraction))
        .add(createComponentAnimation(codeSliderRef, uiSliderRef, () => {gsap.set(uiSliderHandleRef.current, {attr: {cx:40}})}, sliderInteraction))
        .add(createComponentAnimation(codeCheckboxRef, uiCheckboxRef, () => {
             if(uiCheckboxCheckRef.current) {
                const length = uiCheckboxCheckRef.current.getTotalLength();
                gsap.set(uiCheckboxCheckRef.current, { strokeDasharray: length, strokeDashoffset: length });
            }
        }, checkboxInteraction))
        .add(createComponentAnimation(codeChartRef, uiChartRef, () => {
            if(uiChartLineRef.current) {
                const length = uiChartLineRef.current.getTotalLength();
                gsap.set(uiChartLineRef.current, { strokeDasharray: length, strokeDashoffset: length });
            }
        }, chartInteraction));

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
      <line x1="250" y1="20" x2="250" y2="480" stroke="url(#build-line-gradient)" strokeWidth="2" />

      {/* Code Components */}
      <g>
        <text ref={codeButtonRef} className="code-text">&lt;Button /&gt;</text>
        <text ref={codeInputRef} className="code-text">&lt;Input /&gt;</text>
        <text ref={codeToggleRef} className="code-text">&lt;Toggle /&gt;</text>
        <text ref={codeImageRef} className="code-text">&lt;Image /&gt;</text>
        <text ref={codeDropdownRef} className="code-text">&lt;Dropdown /&gt;</text>
        <text ref={codeSliderRef} className="code-text">&lt;Slider /&gt;</text>
        <text ref={codeCheckboxRef} className="code-text">&lt;Checkbox /&gt;</text>
        <text ref={codeChartRef} className="code-text">&lt;Chart /&gt;</text>
      </g>
      
      {/* UI Elements (will be positioned by GSAP) */}
      <g>
        <g ref={uiButtonRef}>
            <rect width="100" height="35" rx="6" fill="hsl(var(--primary))" />
            <text x="50" y="22" textAnchor="middle" fontSize="12" fontWeight="bold" fill="hsl(var(--primary-foreground))" dominantBaseline="middle">SUBMIT</text>
        </g>
        
        <g ref={uiInputRef}>
            <rect width="140" height="35" rx="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
            <line ref={uiInputCaretRef} x1="8" y1="8" x2="8" y2="27" stroke="hsl(var(--foreground))" strokeWidth="2" opacity="0" />
        </g>
        
        <g ref={uiToggleRef}>
            <rect width="50" height="26" rx="13" fill="hsl(var(--secondary))" />
            <rect ref={uiToggleKnobRef} x="4" y="3" width="20" height="20" rx="10" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1"/>
        </g>

        <g ref={uiImageRef}>
          <rect width="190" height="120" rx="8" fill="hsl(var(--secondary))" />
          <circle ref={uiImageSunRef} cx="150" cy="110" r="12" fill="hsl(var(--primary) / 0.5)" />
          <path ref={uiImageMountain1Ref} d="M 20 120 L 60 60 L 100 100" stroke="hsl(var(--primary) / 0.4)" strokeWidth="4" fill="none" />
          <path ref={uiImageMountain2Ref} d="M 80 120 L 120 30 L 170 120" stroke="hsl(var(--primary) / 0.4)" strokeWidth="4" fill="none" />
        </g>

        <g ref={uiDropdownRef}>
            <rect width="140" height="35" rx="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
            <path d="M 120 12 l 5 5 l 5 -5" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <g ref={uiDropdownMenuRef} transform="translate(0, 40)">
                <rect width="140" height="90" rx="6" fill="hsl(var(--background))" stroke="hsl(var(--border))"/>
                <rect x="5" y="5" width="130" height="25" rx="4" fill="hsl(var(--accent))"/>
                <rect x="5" y="35" width="130" height="25" rx="4" fill="hsl(var(--secondary))"/>
                <rect x="5" y="65" width="130" height="25" rx="4" fill="hsl(var(--secondary))"/>
            </g>
        </g>
        
        <g ref={uiSliderRef}>
            <rect y="2.5" width="140" height="10" rx="5" fill="hsl(var(--secondary))"/>
            <rect y="2.5" width="40" height="10" rx="5" fill="hsl(var(--primary))"/>
            <circle ref={uiSliderHandleRef} cx="40" cy="7.5" r="8" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" />
        </g>
        
        <g ref={uiCheckboxRef}>
            <rect width="26" height="26" rx="6" fill="hsl(var(--secondary))" stroke="hsl(var(--border))"/>
            <path ref={uiCheckboxCheckRef} d="M 7 13 l 5 5 l 10 -10" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        
        <g ref={uiChartRef}>
          <rect width="190" height="120" rx="8" fill="hsl(var(--secondary))" />
          <path d="M 10 110 L 10 10 M 10 110 L 180 110" stroke="hsl(var(--muted-foreground)/0.5)" strokeWidth="2" />
          <path ref={uiChartLineRef} d="M 10 90 Q 50 20, 90 60 T 170 30" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
        </g>

      </g>
    </svg>
  );
}
