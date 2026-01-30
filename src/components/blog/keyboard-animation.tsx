'use client';

import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

const keyWidth = 12;
const keyHeight = 12;
const keyGap = 3;
const cornerRadius = 2.5;

const rows = [
  // Row 0: Esc and F keys
  { y: 0, keys: [
    { x: 0, w: 1, s: 'Esc', code: 'Escape' },
    { x: 1.5, w: 1, s: 'F1', code: 'F1' }, { x: 2.5, w: 1, s: 'F2', code: 'F2' }, { x: 3.5, w: 1, s: 'F3', code: 'F3' }, { x: 4.5, w: 1, s: 'F4', code: 'F4' },
    { x: 5.75, w: 1, s: 'F5', code: 'F5' }, { x: 6.75, w: 1, s: 'F6', code: 'F6' }, { x: 7.75, w: 1, s: 'F7', code: 'F7' }, { x: 8.75, w: 1, s: 'F8', code: 'F8' },
    { x: 10, w: 1, s: 'F9', code: 'F9' }, { x: 11, w: 1, s: 'F10', code: 'F10' }, { x: 12, w: 1, s: 'F11', code: 'F11' }, { x: 13, w: 1, s: 'F12', code: 'F12' },
    { x: 14.25, w: 1, s: 'Del', code: 'Delete' }, { x: 15.25, w: 1, s: 'PgUp', code: 'PageUp' }, { x: 16.25, w: 1, s: 'PgDn', code: 'PageDown' },
  ]},
  // Row 1: Numbers
  { y: 1, keys: [
    { x: 0, w: 1, s: '~', code: 'Backquote' }, { x: 1, w: 1, s: '1', code: 'Digit1' }, { x: 2, w: 1, s: '2', code: 'Digit2' }, { x: 3, w: 1, s: '3', code: 'Digit3' },
    { x: 4, w: 1, s: '4', code: 'Digit4' }, { x: 5, w: 1, s: '5', code: 'Digit5' }, { x: 6, w: 1, s: '6', code: 'Digit6' }, { x: 7, w: 1, s: '7', code: 'Digit7' },
    { x: 8, w: 1, s: '8', code: 'Digit8' }, { x: 9, w: 1, s: '9', code: 'Digit9' }, { x: 10, w: 1, s: '0', code: 'Digit0' }, { x: 11, w: 1, s: '-', code: 'Minus' },
    { x: 12, w: 1, s: '=', code: 'Equal' }, { x: 13, w: 2, s: 'BS', code: 'Backspace' },
    { x: 15.25, w: 1, s: 'Home', code: 'Home' }, { x: 16.25, w: 1, s: 'End', code: 'End' },
  ]},
  // Row 2: QWERTY
  { y: 2, keys: [
    { x: 0, w: 1.5, s: 'Tab', code: 'Tab' }, { x: 1.5, w: 1, s: 'Q', code: 'KeyQ' }, { x: 2.5, w: 1, s: 'W', code: 'KeyW' }, { x: 3.5, w: 1, s: 'E', code: 'KeyE' },
    { x: 4.5, w: 1, s: 'R', code: 'KeyR' }, { x: 5.5, w: 1, s: 'T', code: 'KeyT' }, { x: 6.5, w: 1, s: 'Y', code: 'KeyY' }, { x: 7.5, w: 1, s: 'U', code: 'KeyU' },
    { x: 8.5, w: 1, s: 'I', code: 'KeyI' }, { x: 9.5, w: 1, s: 'O', code: 'KeyO' }, { x: 10.5, w: 1, s: 'P', code: 'KeyP' }, { x: 11.5, w: 1, s: '[', code: 'BracketLeft' },
    { x: 12.5, w: 1, s: ']', code: 'BracketRight' }, { x: 13.5, w: 1.5, s: '\\', code: 'Backslash' },
  ]},
  // Row 3: ASDF
  { y: 3, keys: [
    { x: 0, w: 1.75, s: 'Caps', code: 'CapsLock' }, { x: 1.75, w: 1, s: 'A', code: 'KeyA' }, { x: 2.75, w: 1, s: 'S', code: 'KeyS' },
    { x: 3.75, w: 1, s: 'D', code: 'KeyD' }, { x: 4.75, w: 1, s: 'F', code: 'KeyF' }, { x: 5.75, w: 1, s: 'G', code: 'KeyG' }, { x: 6.75, w: 1, s: 'H', code: 'KeyH' },
    { x: 7.75, w: 1, s: 'J', code: 'KeyJ' }, { x: 8.75, w: 1, s: 'K', code: 'KeyK' }, { x: 9.75, w: 1, s: 'L', code: 'KeyL' }, { x: 10.75, w: 1, s: ';', code: 'Semicolon' },
    { x: 11.75, w: 1, s: "'", code: 'Quote' }, { x: 12.75, w: 2.25, s: 'Enter', code: 'Enter' },
  ]},
  // Row 4: Shift row
  { y: 4, keys: [
    { x: 0, w: 2.25, s: 'Shift', code: 'ShiftLeft' }, { x: 2.25, w: 1, s: 'Z', code: 'KeyZ' }, { x: 3.25, w: 1, s: 'X', code: 'KeyX' }, { x: 4.25, w: 1, s: 'C', code: 'KeyC' },
    { x: 5.25, w: 1, s: 'V', code: 'KeyV' }, { x: 6.25, w: 1, s: 'B', code: 'KeyB' }, { x: 7.25, w: 1, s: 'N', code: 'KeyN' }, { x: 8.25, w: 1, s: 'M', code: 'KeyM' },
    { x: 9.25, w: 1, s: ',', code: 'Comma' }, { x: 10.25, w: 1, s: '.', code: 'Period' }, { x: 11.25, w: 1, s: '/', code: 'Slash' }, { x: 12.25, w: 2.75, s: 'Shift', code: 'ShiftRight' },
    { x: 15.25, w: 1, s: '↑', code: 'ArrowUp' },
  ]},
  // Row 5: Bottom row
  { y: 5, keys: [
    { x: 0, w: 1.25, s: 'Ctrl', code: 'ControlLeft' }, { x: 1.25, w: 1.25, s: 'Alt', code: 'AltLeft' },
    { x: 2.5, w: 6.25, s: 'Space', code: 'Space' },
    { x: 8.75, w: 1.25, s: 'Alt', code: 'AltRight' }, { x: 10, w: 1.25, s: 'Win', code: 'MetaRight' }, { x: 11.25, w: 1.25, s: 'Ctrl', code: 'ControlRight' },
    { x: 14.25, w: 1, s: '←', code: 'ArrowLeft' }, { x: 15.25, w: 1, s: '↓', code: 'ArrowDown' }, { x: 16.25, w: 1, s: '→', code: 'ArrowRight' },
  ]},
];

const warmedKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'];
const hintTriggers: { [key: string]: string } = {
  'this is awesome': 'Not just this, you are as well!',
  'elysium': 'You found our name! ✨',
  'hello world': 'The classic. Welcome, coder.',
  'gsap': 'The secret sauce for our animations.',
  'react': 'The foundation of our UIs.',
  'nextjs': 'Powering this very site.',
  'magic': 'I know, right? It feels like magic.',
  'firebase': 'Powering our backend.',
  'tailwind': 'Our favorite way to style.',
  'genkit': 'The AI magic behind our blog generator.',
};

const totalWidth = 17.25 * keyWidth + 16.25 * keyGap + 20;
const totalHeight = 6 * keyHeight + 5 * keyGap + 20;

export function KeyboardAnimation({ className }: { className?: string }) {
  const componentRef = useRef<HTMLDivElement>(null);
  const textboxContainerRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null);
  const [typedText, setTypedText] = useState('');
  const [interactiveHint, setInteractiveHint] = useState('');
  const hasAnimatedIn = useRef(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Animate textbox in/out based on typedText state
  useLayoutEffect(() => {
    if (isTouchDevice) return;

    if (typedText.length > 0 && !hasAnimatedIn.current) {
      hasAnimatedIn.current = true;
      gsap.timeline()
        .to(hintRef.current, { opacity: 0, y: -10, duration: 0.3, ease: 'power3.in' })
        .to(textboxContainerRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, "-=0.1");

    } else if (typedText.length === 0 && hasAnimatedIn.current) {
      hasAnimatedIn.current = false;
      gsap.timeline()
        .to(textboxContainerRef.current, { opacity: 0, y: 20, duration: 0.4, ease: 'power3.in' })
        .to(hintRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, "-=0.2");
    }
  }, [typedText, isTouchDevice]);


  // Unified animation and interaction effect
  useLayoutEffect(() => {
    // This check is crucial. We must wait until we know the device type
    // before setting up animations or event listeners.
    if (isTouchDevice === null) {
      return;
    }

    const ctx = gsap.context(() => {
      if (isTouchDevice) {
        // --- MOBILE ANIMATION LOGIC ---
        const animatedKeys = warmedKeys
          .map(code => componentRef.current?.querySelector(`[data-key-code="${code}"]`))
          .filter(Boolean);

        if (animatedKeys.length === 0) return;
        
        const tap = (key: any) => gsap.timeline()
          .to(key.querySelector('.key-base'), { y: 2, duration: 0.08, ease: 'power1.in' })
          .to(key.querySelector('.key-base'), { y: 0, duration: 0.15, ease: 'power2.out' });

        const masterTl = gsap.timeline({ repeat: -1 });
        gsap.utils.shuffle(Array.from(animatedKeys)).forEach((key, i) => {
          masterTl.add(tap(key), i * 0.15);
        });
        masterTl.to({}, { duration: 2 }); // Add a pause at the end of the sequence

      } else {
        // --- DESKTOP INTERACTION LOGIC ---
        const keyMap = new Map<string, SVGGElement>();
        const keyNodes = componentRef.current?.querySelectorAll<SVGGElement>('[data-key-code]');
        if (!keyNodes || keyNodes.length === 0) return;
        
        keyNodes.forEach(el => {
          const code = el.dataset.keyCode;
          if (code) keyMap.set(code, el);
        });

        const handleKeyDown = (e: KeyboardEvent) => {
          // Allow essential browser shortcuts
          if (e.key === 'F5' || e.key === 'F11' || (e.metaKey && e.key === 'r')) {
              return;
          }
          e.preventDefault();
          
          const keyEl = keyMap.get(e.code);
          if (keyEl) {
            if (e.metaKey || e.ctrlKey) return;
            gsap.to(keyEl.querySelector('.key-base'), { y: 2, duration: 0.08, ease: 'power1.in' });
            gsap.to(keyEl.querySelector('.key-press-rect'), { opacity: 1, duration: 0.08 });
          }

          if (e.key.length === 1) {
            setTypedText(prev => (prev + e.key).slice(-150));
          } else if (e.code === 'Backspace') {
            setTypedText(prev => prev.slice(0, -1));
          } else if (e.code === 'Space') {
            setTypedText(prev => (prev + ' ').slice(-150));
          } else if (e.code === 'Escape') {
            setTypedText('');
          }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
          const keyEl = keyMap.get(e.code);
          if (keyEl) {
            gsap.to(keyEl.querySelector('.key-base'), { y: 0, duration: 0.15, ease: 'power2.out' });
            gsap.to(keyEl.querySelector('.key-press-rect'), { opacity: 0, duration: 0.15 });
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        };
      }
    }, componentRef);

    return () => ctx.revert();
  }, [isTouchDevice]); // This effect now correctly depends on isTouchDevice

  // Effect for interactive hints
  useEffect(() => {
    if (isTouchDevice === null || isTouchDevice || !typedText) {
      setInteractiveHint('');
      return;
    }

    const handler = setTimeout(() => {
      let foundHint = '';
      const lowercasedText = typedText.toLowerCase();
      for (const trigger in hintTriggers) {
        if (lowercasedText.includes(trigger)) {
          foundHint = hintTriggers[trigger];
          break;
        }
      }
      setInteractiveHint(foundHint);
    }, 500); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [typedText, isTouchDevice]);

  return (
    <div ref={componentRef} className={cn('relative flex w-full flex-col items-center justify-center gap-6', className)}>
      
      {isTouchDevice === false && (
        <div className="flex h-24 w-full max-w-xl flex-col items-center justify-start">
          <div ref={textboxContainerRef} className="w-full opacity-0" style={{ transform: 'translateY(20px)'}}>
            <div className="relative rounded-lg border bg-card/50 p-4 shadow-inner backdrop-blur-sm">
              <p className="min-h-[2.5em] font-mono text-foreground break-words">{typedText}<span className="animate-pulse">|</span></p>
              <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setTypedText('')}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p ref={hintRef} className="mt-2 text-center text-sm text-muted-foreground">The stage is set. Type away...</p>
          <p className={cn("mt-2 text-center text-sm text-primary transition-opacity duration-300", interactiveHint ? 'opacity-100' : 'opacity-0')}>
            {interactiveHint || ' '}
          </p>
        </div>
      )}

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <svg
          viewBox={`-15 -15 ${totalWidth + 30} ${totalHeight + 30}`}
          className="h-auto w-full"
          style={{ '--kb-skew': '-0.05' } as React.CSSProperties}
        >
          <defs>
            <linearGradient id="key-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.8"/>
            </linearGradient>
            <linearGradient id="warmed-key-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            </linearGradient>
            <filter id="kb-shadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="hsl(var(--foreground))" floodOpacity="0.08"/>
            </filter>
          </defs>

          <g transform="matrix(1, var(--kb-skew), 0, 1, 0, 0)">
            <rect x="20" y="0" width="50" height="10" rx={cornerRadius + 1} className="fill-card stroke-border" />
            <rect x={totalWidth - 120} y="0" width="100" height="10" rx={cornerRadius + 1} className="fill-card stroke-border" />
          </g>

          <g transform="matrix(1, var(--kb-skew), 0, 1, 0, 8)" style={{ filter: 'url(#kb-shadow)' }}>
            <rect x="0" y="0" width={totalWidth} height={totalHeight} rx="8" className="fill-card stroke-border" strokeWidth="1.5"/>
            {rows.map((row, rowIndex) => (
              row.keys.map((key, keyIndex) => {
                const xPos = key.x * (keyWidth + keyGap) + 10;
                const yPos = row.y * (keyHeight + keyGap) + 10;
                const currentKeyWidth = key.w * keyWidth + (key.w - 1) * keyGap;
                const fontSize = key.s && key.s.length > 2 ? 4 : 5;
                const isArrow = ['↑', '↓', '←', '→'].includes(key.s || '');
                const isWarmed = (isTouchDevice && warmedKeys.includes(key.code || '')) || (key.s === 'Space');

                return (
                  <g 
                    key={`${rowIndex}-${keyIndex}`} 
                    data-key-code={key.code}
                    className="key-base"
                  >
                    {/* Shadow Layer */}
                    <rect x={xPos} y={yPos + 2} width={currentKeyWidth} height={keyHeight} rx={cornerRadius} className="fill-foreground/10"/>
                    
                    {/* Base Key Layer */}
                    <rect
                      x={xPos}
                      y={yPos}
                      width={currentKeyWidth}
                      height={keyHeight}
                      rx={cornerRadius}
                      className={cn("stroke-foreground/10", { 'stroke-primary/40': isWarmed })}
                      strokeWidth="0.5"
                      fill={isWarmed ? "url(#warmed-key-gradient)" : "url(#key-gradient)"}
                    />

                    {/* Pressed State Overlay */}
                    <rect
                      className="key-press-rect"
                      x={xPos}
                      y={yPos}
                      width={currentKeyWidth}
                      height={keyHeight}
                      rx={cornerRadius}
                      fill="hsl(var(--primary))"
                      opacity="0"
                      style={{ pointerEvents: 'none' }}
                    />
                    
                    {/* Key Text */}
                    {key.s && (
                      <text
                        x={xPos + currentKeyWidth / 2}
                        y={yPos + keyHeight / 2 + (isArrow ? 2.5 : 2)}
                        textAnchor="middle"
                        fontSize={fontSize}
                        className="pointer-events-none select-none font-sans font-semibold text-muted-foreground"
                        fill="currentColor"
                      >
                        {key.s}
                      </text>
                    )}
                  </g>
                );
              })
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

    
