'use client';

import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { AnimateOnScroll } from '../common/animate-on-scroll';

const keyWidth = 12;
const keyHeight = 12;
const keyGap = 3;
const cornerRadius = 2.5;

const rows = [
  { y: 0, keys: [
    { x: 0, w: 1, s: 'F1', code: 'F1' }, { x: 1, w: 1, s: 'F2', code: 'F2' }, { x: 2, w: 1, s: 'F3', code: 'F3' }, { x: 3, w: 1, s: 'F4', code: 'F4' },
    { x: 4.25, w: 1, s: 'F5', code: 'F5' }, { x: 5.25, w: 1, s: 'F6', code: 'F6' }, { x: 6.25, w: 1, s: 'F7', code: 'F7' }, { x: 7.25, w: 1, s: 'F8', code: 'F8' },
    { x: 8.5, w: 1, s: 'F9', code: 'F9' }, { x: 9.5, w: 1, s: 'F10', code: 'F10' }, { x: 10.5, w: 1, s: 'F11', code: 'F11' }, { x: 11.5, w: 1, s: 'F12', code: 'F12' },
    { x: 13, w: 1, s: 'Del', code: 'Delete' }, { x: 14, w: 1, s: 'PgUp', code: 'PageUp' }, { x: 15, w: 1, s: 'PgDn', code: 'PageDown' },
  ]},
  { y: 1, keys: [
    { x: 0, w: 1, s: '~', code: 'Backquote' }, { x: 1, w: 1, s: '1', code: 'Digit1' }, { x: 2, w: 1, s: '2', code: 'Digit2' }, { x: 3, w: 1, s: '3', code: 'Digit3' },
    { x: 4, w: 1, s: '4', code: 'Digit4' }, { x: 5, w: 1, s: '5', code: 'Digit5' }, { x: 6, w: 1, s: '6', code: 'Digit6' }, { x: 7, w: 1, s: '7', code: 'Digit7' },
    { x: 8, w: 1, s: '8', code: 'Digit8' }, { x: 9, w: 1, s: '9', code: 'Digit9' }, { x: 10, w: 1, s: '0', code: 'Digit0' }, { x: 11, w: 1, s: '-', code: 'Minus' },
    { x: 12, w: 2, s: 'Backspace', code: 'Backspace' },
    { x: 14, w: 1, s: 'Home', code: 'Home' }, { x: 15, w: 1, s: 'End', code: 'End' },
  ]},
  { y: 2, keys: [
    { x: 0, w: 1.5, s: 'Tab', code: 'Tab' }, { x: 1.5, w: 1, s: 'Q', code: 'KeyQ' }, { x: 2.5, w: 1, s: 'W', code: 'KeyW', warmed: true }, { x: 3.5, w: 1, s: 'E', code: 'KeyE' },
    { x: 4.5, w: 1, s: 'R', code: 'KeyR' }, { x: 5.5, w: 1, s: 'T', code: 'KeyT' }, { x: 6.5, w: 1, s: 'Y', code: 'KeyY' }, { x: 7.5, w: 1, s: 'U', code: 'KeyU' },
    { x: 8.5, w: 1, s: 'I', code: 'KeyI' }, { x: 9.5, w: 1, s: 'O', code: 'KeyO' }, { x: 10.5, w: 1, s: 'P', code: 'KeyP' }, { x: 11.5, w: 1, s: '[', code: 'BracketLeft' },
    { x: 12.5, w: 1.5, s: ']', code: 'BracketRight' },
  ]},
  { y: 3, keys: [
    { x: 0, w: 1.75, s: 'Caps', code: 'CapsLock' }, { x: 1.75, w: 1, s: 'A', code: 'KeyA', warmed: true }, { x: 2.75, w: 1, s: 'S', code: 'KeyS', warmed: true },
    { x: 3.75, w: 1, s: 'D', code: 'KeyD', warmed: true }, { x: 4.75, w: 1, s: 'F', code: 'KeyF' }, { x: 5.75, w: 1, s: 'G', code: 'KeyG' }, { x: 6.75, w: 1, s: 'H', code: 'KeyH' },
    { x: 7.75, w: 1, s: 'J', code: 'KeyJ' }, { x: 8.75, w: 1, s: 'K', code: 'KeyK' }, { x: 9.75, w: 1, s: 'L', code: 'KeyL' }, { x: 10.75, w: 1, s: ';', code: 'Semicolon' },
    { x: 11.75, w: 2.25, s: 'Enter', code: 'Enter' },
  ]},
  { y: 4, keys: [
    { x: 0, w: 2.25, s: 'Shift', code: 'ShiftLeft' }, { x: 2.25, w: 1, s: 'Z', code: 'KeyZ' }, { x: 3.25, w: 1, s: 'X', code: 'KeyX' }, { x: 4.25, w: 1, s: 'C', code: 'KeyC' },
    { x: 5.25, w: 1, s: 'V', code: 'KeyV' }, { x: 6.25, w: 1, s: 'B', code: 'KeyB' }, { x: 7.25, w: 1, s: 'N', code: 'KeyN' }, { x: 8.25, w: 1, s: 'M', code: 'KeyM' },
    { x: 9.25, w: 1, s: ',', code: 'Comma' }, { x: 10.25, w: 1.75, s: 'Shift', code: 'ShiftRight' }, { x: 13, w: 1 },
    { x: 14, w: 1, s: '↑', code: 'ArrowUp' }, { x: 15, w: 1 },
  ]},
  { y: 5, keys: [
    { x: 0, w: 1.25, s: 'Ctrl', code: 'ControlLeft' }, { x: 1.25, w: 1.25, s: 'Alt', code: 'AltLeft' }, { x: 2.5, w: 1.25 },
    { x: 3.75, w: 5.5, s: 'Space', code: 'Space', warmed: true },
    { x: 9.25, w: 1.25 }, { x: 10.5, w: 1.25, s: 'Alt', code: 'AltRight' }, { x: 11.75, w: 1.25, s: 'Ctrl', code: 'ControlRight' },
    { x: 13, w: 1, s: '←', code: 'ArrowLeft' }, { x: 14, w: 1, s: '↓', code: 'ArrowDown' }, { x: 15, w: 1, s: '→', code: 'ArrowRight' },
  ]},
];

const totalWidth = 16 * keyWidth + 15 * keyGap + 20;
const totalHeight = 6 * keyHeight + 5 * keyGap + 20;

export function KeyboardAnimation({ className }: { className?: string }) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
    setIsMounted(true);
  }, []);

  // Looping animation for mobile
  useLayoutEffect(() => {
    if (!isMounted || !isTouchDevice) return;

    const ctx = gsap.context(() => {
      const animatedKeys = gsap.utils.toArray('.key-animated');
      if (animatedKeys.length === 0) return;

      const tap = (key: any) => gsap.timeline()
        .to(key, { y: 2, duration: 0.08, ease: 'power1.in' })
        .to(key, { y: 0, duration: 0.15, ease: 'power2.out' });

      const masterTl = gsap.timeline({ repeat: -1 });
      gsap.utils.shuffle(animatedKeys).forEach((key, i) => {
        masterTl.add(tap(key), i * 0.15);
      });
      masterTl.to({}, { duration: 2 });

    }, componentRef);
    return () => ctx.revert();
  }, [isMounted, isTouchDevice]);

  // Interactive logic for desktop
  useLayoutEffect(() => {
    if (!isMounted || isTouchDevice) return;

    const ctx = gsap.context(() => {
      const keyMap = new Map<string, SVGGElement>();
      const keyElements = componentRef.current?.querySelectorAll<SVGGElement>('[data-key-code]');
      if (!keyElements || keyElements.length === 0) return;
      
      keyElements.forEach(el => {
        const code = el.dataset.keyCode;
        if (code) keyMap.set(code, el);
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey) return;
        
        const keyEl = keyMap.get(e.code);
        if (keyEl) {
          gsap.to(keyEl, { y: 2, duration: 0.08, ease: 'power1.in' });
          gsap.to(keyEl.querySelector('.key-press-rect'), { opacity: 1, duration: 0.08 });
        }

        if (e.key.length === 1) {
          setTypedText(prev => prev + e.key);
        } else if (e.code === 'Backspace') {
          setTypedText(prev => prev.slice(0, -1));
        } else if (e.code === 'Space') {
          setTypedText(prev => prev + ' ');
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        const keyEl = keyMap.get(e.code);
        if (keyEl) {
          gsap.to(keyEl, { y: 0, duration: 0.15, ease: 'power2.out' });
          gsap.to(keyEl.querySelector('.key-press-rect'), { opacity: 0, duration: 0.15 });
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, componentRef);

    return () => ctx.revert();
  }, [isMounted, isTouchDevice]);

  return (
    <div ref={componentRef} className={cn('relative flex w-full flex-col items-center justify-center gap-6', className)}>
      
      {isMounted && !isTouchDevice && (
        <AnimateOnScroll className="w-full max-w-xl">
          <div className="relative rounded-lg border bg-card/50 p-4 shadow-inner backdrop-blur-sm">
            <p className="min-h-[2.5em] font-mono text-foreground">{typedText}<span className="animate-pulse">|</span></p>
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setTypedText('')}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">Try typing on your keyboard...</p>
        </AnimateOnScroll>
      )}

      <div className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md">
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
            <rect x={totalWidth - 70} y="0" width="50" height="10" rx={cornerRadius + 1} className="fill-card stroke-border" />
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

                return (
                  <g 
                    key={`${rowIndex}-${keyIndex}`} 
                    className={cn({ 'key-animated': isTouchDevice && key.warmed })}
                    data-key-code={key.code}
                    data-warmed={key.warmed}
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
                      className={cn("stroke-foreground/10", { 'stroke-primary/40': key.warmed })}
                      strokeWidth="0.5"
                      fill={(isTouchDevice && key.warmed) ? "url(#warmed-key-gradient)" : "url(#key-gradient)"}
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
