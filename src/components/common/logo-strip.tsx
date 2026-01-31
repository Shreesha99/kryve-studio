'use client';

import { motion } from 'framer-motion';

const LOGOS = [
  'Vertex', 'Quantum', 'Nexus', 'Apex', 'Momentum',
  'Evolve', 'Synergy', 'Catalyst', 'Orbit', 'Fusion', 'Zenith', 'Nova'
];

export function LogoStrip() {
  const allLogos = [...LOGOS, ...LOGOS]; // Duplicate for seamless looping

  return (
    <div 
      className="relative w-full overflow-hidden whitespace-nowrap py-12" 
      aria-hidden="true"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="flex"
        style={{ transform: 'rotateY(25deg) rotateZ(-4deg)' }}
        animate={{
          x: ['0%', '-50%'],
          transition: {
            ease: 'linear',
            duration: 80,
            repeat: Infinity,
          },
        }}
      >
        {allLogos.map((logo, index) => (
          // Each item is a self-contained film strip segment
          <div 
            key={`logo-segment-${index}`}
            className="flex-shrink-0 w-56 bg-foreground/80 shadow-2xl flex flex-col mx-4 rounded-lg"
          >
            {/* Top sprocket holes */}
            <div className="flex h-6 items-center justify-around px-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`top-${i}`} className="h-3 w-3 rounded-sm bg-background/60" />
              ))}
            </div>
            
            {/* Logo frame */}
            <div className="flex h-32 items-center justify-center border-y-2 border-dashed border-background/30">
              <span className="font-headline text-2xl font-bold tracking-wider text-background">
                {logo}
              </span>
            </div>
            
            {/* Bottom sprocket holes */}
            <div className="flex h-6 items-center justify-around px-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`bottom-${i}`} className="h-3 w-3 rounded-sm bg-background/60" />
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
