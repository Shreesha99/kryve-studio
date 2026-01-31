'use client';

import { motion } from 'framer-motion';

const LOGOS = [
  'Vertex', 'Quantum', 'Nexus', 'Apex', 'Momentum',
  'Evolve', 'Synergy', 'Catalyst', 'Orbit', 'Fusion', 'Zenith', 'Nova'
];

// The content of the strip, rendered once.
const StripContent = () => (
  <>
    {LOGOS.map((logo, index) => (
      <div key={index} className="flex h-full w-56 flex-shrink-0 items-center justify-center border-x border-black/10 px-4 dark:border-white/10">
        <span className="font-headline text-3xl font-bold tracking-wider text-background opacity-80">
          {logo}
        </span>
      </div>
    ))}
  </>
);

export function LogoStrip() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-0 h-64 overflow-hidden"
      style={{ perspective: '800px' }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-0 top-1/2 flex w-max"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(50deg) rotateY(0deg) rotateZ(-15deg) translateY(-50%)',
        }}
        animate={{
          x: ['0%', '-50%'],
          transition: {
            ease: 'linear',
            duration: 100,
            repeat: Infinity,
          },
        }}
      >
        {/* The single, continuous strip element */}
        <div className="relative flex h-28 flex-shrink-0 items-center bg-foreground/90 p-2 shadow-2xl backdrop-blur-sm dark:bg-black/70">
            {/* Sprocket holes using repeating gradients */}
            <div className="absolute top-2 left-0 h-2 w-full bg-repeat-x" style={{
                backgroundImage: `radial-gradient(hsl(var(--background)) 35%, transparent 40%)`,
                backgroundSize: '20px 20px',
            }}/>
            
            {/* The content is duplicated for seamless loop */}
            <StripContent />
            <StripContent />

            {/* Sprocket holes using repeating gradients */}
            <div className="absolute bottom-2 left-0 h-2 w-full bg-repeat-x" style={{
                backgroundImage: `radial-gradient(hsl(var(--background)) 35%, transparent 40%)`,
                backgroundSize: '20px 20px',
            }}/>
        </div>
      </motion.div>
    </div>
  );
}
