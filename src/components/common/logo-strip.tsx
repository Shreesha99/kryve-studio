'use client';

import { motion } from 'framer-motion';

const LOGOS = [
  'Vertex',
  'Quantum',
  'Nexus',
  'Apex',
  'Momentum',
  'Evolve',
  'Synergy',
  'Catalyst',
  'Orbit',
  'Fusion'
];

export function LogoStrip() {
  return (
    <div className="relative w-full overflow-hidden whitespace-nowrap py-12" aria-hidden="true">
      <motion.div
        className="flex"
        animate={{
          x: ['0%', '-100%'],
          transition: {
            ease: 'linear',
            duration: 40,
            repeat: Infinity,
          },
        }}
      >
        {/* Render logos twice for seamless loop */}
        {[...LOGOS, ...LOGOS].map((logo, index) => (
          <div key={`logo-A-${index}`} className="mx-12 flex-shrink-0">
            <span className="font-headline text-4xl font-bold tracking-wider text-foreground/20 dark:text-foreground/10">
              {logo}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
