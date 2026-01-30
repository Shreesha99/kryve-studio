'use client';

import { cn } from '@/lib/utils';

export function KeyboardAnimation({ className }: { className?: string }) {
  // A detailed, static, non-animated keyboard SVG.
  // It is theme-aware, using CSS variables for colors.
  const keyWidth = 12;
  const keyHeight = 12;
  const keyGap = 4;
  const rows = [
    { offset: 0, keys: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2] },
    { offset: 1.5, keys: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5] },
    { offset: 1.8, keys: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2] },
    { offset: 2.2, keys: [1, 1, 1, 1, 1, 1, 1, 1, 2.8] },
    { offset: 0, keys: [1.25, 1.25, 6.25, 1.25, 1.25] },
  ];
  const keyboardWidth = 14 * keyWidth + 13 * keyGap;
  const keyboardHeight = 5 * keyHeight + 4 * keyGap + 20;

  // Static "warmed-up" keys
  const warmedKeys = [
    { row: 1, key: 4 }, // E key
    { row: 2, key: 3 }, // D key
    { row: 3, key: 2 }, // S key
  ];

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg
        viewBox={`0 0 ${keyboardWidth} ${keyboardHeight}`}
        className="h-auto w-48 drop-shadow-sm"
      >
        {/* Keyboard base */}
        <rect
          x="0"
          y="0"
          width={keyboardWidth}
          height={keyboardHeight}
          rx="8"
          className="fill-card stroke-border"
          strokeWidth="1"
        />
        
        {/* A subtle gradient to give depth */}
        <defs>
            <linearGradient id="key-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.8"/>
            </linearGradient>
            {/* New gradient for the "warmed up" keys */}
            <linearGradient id="warmed-key-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            </linearGradient>
        </defs>

        {rows.map((row, rowIndex) => {
          let xOffset = 10;
          const yPos = 10 + rowIndex * (keyHeight + keyGap);

          return row.keys.map((keySize, keyIndex) => {
            const currentKeyWidth = keySize * keyWidth;
            const keyX = xOffset + (row.offset * (keyWidth + keyGap));
            xOffset += currentKeyWidth + keyGap;

            const isWarmed = warmedKeys.some(
              (wk) => wk.row === rowIndex && wk.key === keyIndex
            );

            return (
              <g key={`${rowIndex}-${keyIndex}`}>
                {/* Key shadow */}
                <rect
                    x={keyX}
                    y={yPos + 1}
                    width={currentKeyWidth}
                    height={keyHeight}
                    rx="3"
                    className="fill-foreground/10"
                />
                {/* Key top */}
                <rect
                  x={keyX}
                  y={yPos}
                  width={currentKeyWidth}
                  height={keyHeight}
                  rx="3"
                  className={cn("stroke-foreground/10", {
                    'stroke-primary/40': isWarmed
                  })}
                  strokeWidth="0.5"
                  fill={isWarmed ? "url(#warmed-key-gradient)" : "url(#key-gradient)"}
                />
              </g>
            );
          });
        })}
      </svg>
    </div>
  );
}
