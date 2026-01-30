'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

export function KeyboardAnimation({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Use querySelectorAll and then convert to a proper array. This is more robust.
    const keysNodeList = svg.querySelectorAll('.keyboard-key');
    const keys = Array.from(keysNodeList) as SVGElement[];
    
    if (keys.length === 0) return;
    
    // Set initial fill using CSS variables for theme awareness
    gsap.set(keys, { fill: 'hsl(var(--muted))' });
    
    // Kill any existing timeline to prevent duplicates on hot-reload
    if (tlRef.current) {
        tlRef.current.kill();
    }

    const masterTl = gsap.timeline({
      repeat: -1, // Loop forever
      defaults: { ease: 'power2.out' },
    });
    tlRef.current = masterTl;

    // Function to create a single key press animation
    function pressKey() {
        if (keys.length === 0) return;
        const randomKey = gsap.utils.random(keys);
        
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
        }, '+=0.05'); // Release key shortly after press
    }
    
    // Create a sequence of random key presses for one loop
    for(let i=0; i < 15; i++) {
        pressKey();
        // Add a random pause between key presses to feel more natural
        masterTl.addPause(gsap.utils.random(0.05, 0.2));
    }
    // Add a longer pause at the end of the sequence before it repeats
    masterTl.addPause(1.5);

    return () => {
      // Cleanup on unmount
      tlRef.current?.kill();
    };
  }, []);

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

  return (
    <div className={cn("relative h-40 w-40 flex items-center justify-center", className)}>
        <svg ref={svgRef} viewBox={`0 0 ${keyboardWidth} 80`} className="h-auto w-full">
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
