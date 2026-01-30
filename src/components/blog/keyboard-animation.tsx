'use client';

import { cn } from '@/lib/utils';

export function KeyboardAnimation({ className }: { className?: string }) {
  // A detailed, static, non-animated keyboard SVG designed to look like a 75% mechanical keyboard.
  const keyWidth = 12;
  const keyHeight = 12;
  const keyGap = 3;
  const cornerRadius = 2.5;

  const rows = [
    // F-Row and Nav cluster
    { y: 0, keys: [
      { x: 0, w: 1, s: 'F1' }, { x: 1, w: 1, s: 'F2' }, { x: 2, w: 1, s: 'F3' }, { x: 3, w: 1, s: 'F4' },
      { x: 4.25, w: 1, s: 'F5' }, { x: 5.25, w: 1, s: 'F6' }, { x: 6.25, w: 1, s: 'F7' }, { x: 7.25, w: 1, s: 'F8' },
      { x: 8.5, w: 1, s: 'F9' }, { x: 9.5, w: 1, s: 'F10' }, { x: 10.5, w: 1, s: 'F11' }, { x: 11.5, w: 1, s: 'F12' },
      { x: 13, w: 1, s: 'Del' }, { x: 14, w: 1, s: 'PgUp' }, { x: 15, w: 1, s: 'PgDn' },
    ]},
    // Number Row
    { y: 1, keys: [
      { x: 0, w: 1 }, { x: 1, w: 1 }, { x: 2, w: 1 }, { x: 3, w: 1 }, { x: 4, w: 1 }, { x: 5, w: 1 },
      { x: 6, w: 1 }, { x: 7, w: 1 }, { x: 8, w: 1 }, { x: 9, w: 1 }, { x: 10, w: 1 }, { x: 11, w: 1 },
      { x: 12, w: 2, s: 'Backspace' },
      { x: 14, w: 1, s: 'Home' }, { x: 15, w: 1, s: 'End' },
    ]},
    // QWERTY Row
    { y: 2, keys: [
      { x: 0, w: 1.5, s: 'Tab' }, { x: 1.5, w: 1 }, { x: 2.5, w: 1, warmed: true }, { x: 3.5, w: 1 }, { x: 4.5, w: 1 },
      { x: 5.5, w: 1 }, { x: 6.5, w: 1 }, { x: 7.5, w: 1 }, { x: 8.5, w: 1 }, { x: 9.5, w: 1 },
      { x: 10.5, w: 1 }, { x: 11.5, w: 1 }, { x: 12.5, w: 1.5, s: '|' },
    ]},
    // ASDF Row
    { y: 3, keys: [
      { x: 0, w: 1.75, s: 'Caps' }, { x: 1.75, w: 1, warmed: true }, { x: 2.75, w: 1, warmed: true }, { x: 3.75, w: 1, warmed: true },
      { x: 4.75, w: 1 }, { x: 5.75, w: 1 }, { x: 6.75, w: 1 }, { x: 7.75, w: 1 }, { x: 8.75, w: 1 },
      { x: 9.75, w: 1 }, { x: 10.75, w: 1 }, { x: 11.75, w: 2.25, s: 'Enter' },
    ]},
    // ZXCV Row
    { y: 4, keys: [
      { x: 0, w: 2.25, s: 'Shift' }, { x: 2.25, w: 1 }, { x: 3.25, w: 1 }, { x: 4.25, w: 1 },
      { x: 5.25, w: 1 }, { x: 6.25, w: 1 }, { x: 7.25, w: 1 }, { x: 8.25, w: 1 }, { x: 9.25, w: 1 },
      { x: 10.25, w: 1.75, s: 'Shift' }, { x: 13, w: 1 }, { x: 14, w: 1, s: 'Up' }, { x: 15, w: 1 },
    ]},
    // Bottom Row
    { y: 5, keys: [
      { x: 0, w: 1.25 }, { x: 1.25, w: 1.25 }, { x: 2.5, w: 1.25 }, { x: 3.75, w: 5.5, s: 'Space' },
      { x: 9.25, w: 1.25 }, { x: 10.5, w: 1.25 }, { x: 11.75, w: 1.25 },
      { x: 13, w: 1, s: 'Left' }, { x: 14, w: 1, s: 'Down' }, { x: 15, w: 1, s: 'Right' },
    ]},
  ];

  const totalWidth = 16 * keyWidth + 16 * keyGap;
  const totalHeight = 6 * keyHeight + 5 * keyGap + 20; // Extra space for top bezel

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
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

          {/* Keyboard feet/clips for height */}
          <g transform="matrix(1, var(--kb-skew), 0, 1, 0, 0)">
              <rect x="20" y="0" width="50" height="10" rx={cornerRadius + 1} className="fill-card stroke-border" />
              <rect x={totalWidth - 70} y="0" width="50" height="10" rx={cornerRadius + 1} className="fill-card stroke-border" />
          </g>

          {/* Main keyboard body with slight perspective */}
          <g transform="matrix(1, var(--kb-skew), 0, 1, 0, 8)" style={{ filter: 'url(#kb-shadow)' }}>
            <rect
              x="0"
              y="0"
              width={totalWidth}
              height={totalHeight}
              rx="8"
              className="fill-card stroke-border"
              strokeWidth="1.5"
            />
            {rows.map((row, rowIndex) => (
              row.keys.map((key, keyIndex) => {
                const xPos = key.x * (keyWidth + keyGap) + 10;
                const yPos = row.y * (keyHeight + keyGap) + 10;
                const currentKeyWidth = key.w * keyWidth + (key.w - 1) * keyGap;

                return (
                  <g key={`\${rowIndex}-\${keyIndex}`}>
                    <rect
                      x={xPos}
                      y={yPos + 2} // Shadow offset
                      width={currentKeyWidth}
                      height={keyHeight}
                      rx={cornerRadius}
                      className="fill-foreground/10"
                    />
                    <rect
                      x={xPos}
                      y={yPos}
                      width={currentKeyWidth}
                      height={keyHeight}
                      rx={cornerRadius}
                      className={cn("stroke-foreground/10", { 'stroke-primary/40': key.warmed })}
                      strokeWidth="0.5"
                      fill={key.warmed ? "url(#warmed-key-gradient)" : "url(#key-gradient)"}
                    />
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
