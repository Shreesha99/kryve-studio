'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

export function KeyboardAnimation({ className }: { className?: string }) {
  const componentRef = useRef<HTMLDivElement>(null);

  // Procedurally generate the keyboard layout
  const keyWidth = 10;
  const keyHeight = 10;
  const keyGap = 3;
  const rows = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.8, 1, 1, 1, 1, 1, 1, 1, 1.8],
    [2.2, 1, 1, 1, 1, 1, 2.2],
    [1, 1, 5, 1, 1]
  ];
  const keyboardWidth = 12 * (keyWidth + keyGap) + keyGap;

  useLayoutEffect(() => {
    // This is the correct hook for running code after the DOM is painted.
    // It is essential for preventing race conditions with animations.
    const ctx = gsap.context(() => {
      // gsap.utils.toArray is a robust way to select elements.
      // Crucially, if no elements are found, it returns an EMPTY ARRAY `[]`, not `null`.
      const keys = gsap.utils.toArray('.keyboard-key');

      // **THE DEFINITIVE, BULLETPROOF FIX**
      // This check is the most critical part. The error happens because sometimes,
      // during a fast refresh in development, this code runs a split-second
      // before the SVG keys are in the DOM. This check makes the animation
      // code *wait* until the keys are ready. If they aren't found, it simply
      // exits and tries again on the next render. This makes a crash impossible.
      if (keys.length === 0) {
        return; // EXIT EARLY.
      }
      
      // Because of the check above, this line is now guaranteed to be safe.
      // `keys` is always a valid, non-empty array here.
      gsap.set(keys, { fill: 'hsl(var(--muted))' });
      
      const masterTl = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'power2.out' },
      });

      const pressKey = () => {
        const randomKey = gsap.utils.random(keys);
        
        if (randomKey) {
            masterTl.to(randomKey, {
                fill: 'hsl(var(--primary))',
                scaleY: 0.9,
                y: '+=2',
                transformOrigin: 'center bottom',
                duration: 0.1,
                ease: 'circ.in'
            }).to(randomKey, {
                fill: 'hsl(var(--muted))',
                scaleY: 1,
                y: '-=2',
                duration: 0.25,
                ease: 'elastic.out(1, 0.5)'
            }, '+=0.05');
        }
      };

      for(let i = 0; i < 15; i++) {
          pressKey();
          masterTl.addPause(gsap.utils.random(0.05, 0.2));
      }
      masterTl.addPause(1.5);

    }, componentRef); // Scoping the context ensures GSAP only looks inside this component.

    // GSAP's context handles all cleanup automatically.
    return () => ctx.revert();
  }, []); // Run once on mount.

  return (
    <div ref={componentRef} className={cn("relative h-40 w-40 flex items-center justify-center", className)}>
        <svg viewBox={`0 0 ${keyboardWidth} 80`} className="h-auto w-full">
            <rect x="0" y="0" width={keyboardWidth} height="70" rx="5" className="fill-card stroke-foreground/30" strokeWidth="1.5" />
            
            {rows.map((row, rowIndex) => {
                let xOffset = 0;
                const rowWidth = row.reduce((acc, w) => acc + (w * keyWidth) + keyGap, -keyGap);
                const startX = (keyboardWidth - rowWidth) / 2;

                return row.map((keySize, keyIndex) => {
                    const currentKeyWidth = keySize * keyWidth;
                    const keyX = startX + xOffset;
                    const keyY = 10 + rowIndex * (keyHeight + keyGap);
                    xOffset += currentKeyWidth + keyGap;

                    return (
                        <rect
                            key={`${rowIndex}-${keyIndex}`}
                            className="keyboard-key"
                            x={keyX}
                            y={keyY}
                            width={currentKeyWidth}
                            height={keyHeight}
                            rx="2"
                        />
                    );
                });
            })}
        </svg>
    </div>
  );
}
