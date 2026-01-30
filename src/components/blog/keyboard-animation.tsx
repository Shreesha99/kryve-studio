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
    // This is the most robust way to use GSAP in React.
    // It scopes all GSAP selectors to the component's ref and handles cleanup.
    const ctx = gsap.context(() => {
      // Use GSAP's own utility to select the keys. It's scoped by the context.
      const keys = gsap.utils.toArray('.keyboard-key');

      // This is the critical guard. If for any reason the keys aren't
      // rendered when this code runs, we abort, preventing the crash.
      if (keys.length === 0) {
        return;
      }
      
      // Set initial state. This is now safe.
      gsap.set(keys, { fill: 'hsl(var(--muted))' });
      
      // Create the master timeline for the animation loop.
      const masterTl = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'power2.out' },
      });

      // Function to create a single key press animation
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

      // Create a sequence of random key presses.
      for(let i = 0; i < 15; i++) {
          pressKey();
          // Add a random pause between presses to feel more natural.
          masterTl.addPause(gsap.utils.random(0.05, 0.2));
      }
      // Add a longer pause at the end of the loop.
      masterTl.addPause(1.5);

    }, componentRef); // <-- The key change: scope directly to the ref.

    // Return the cleanup function.
    return () => ctx.revert();
  }, []); // Empty dependency array ensures this runs only once after mount.

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
