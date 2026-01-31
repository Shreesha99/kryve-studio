'use client';

import { motion } from 'framer-motion';

const LOGOS = [
  'Vertex', 'Quantum', 'Nexus', 'Apex', 'Momentum',
  'Evolve', 'Synergy', 'Catalyst', 'Orbit', 'Fusion', 'Zenith', 'Nova'
];

// We render the logos multiple times in a single component for a seamless loop.
const RibbonContent = () => (
  <>
    {LOGOS.map((logo, index) => (
      <span key={index} className="mx-12 text-5xl font-bold tracking-wider text-foreground/20 dark:text-foreground/10">
        {logo}
      </span>
    ))}
  </>
);

// A single orbiting ribbon component.
function Ribbon({
  rotateY,
  duration,
  reverse = false,
}: {
  rotateY: number;
  duration: number;
  reverse?: boolean;
}) {
  return (
    <motion.div
      className="absolute flex w-max items-center"
      style={{
        // Positions each ribbon in a circle around the center
        transform: `rotateY(${rotateY}deg) translateZ(450px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="flex"
        animate={{ x: reverse ? '100%' : '-100%' }}
        transition={{
          ease: 'linear',
          duration: duration,
          repeat: Infinity,
        }}
      >
        {/* The content is rendered multiple times to fill the space for a seamless loop */}
        <RibbonContent />
        <RibbonContent />
        <RibbonContent />
        <RibbonContent />
      </motion.div>
    </motion.div>
  );
}

export function LogoStrip() {
  return (
    <div
      className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      style={{ perspective: '1000px' }}
      aria-hidden="true"
    >
      <motion.div
        className="relative h-96 w-96 font-headline"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: -360 }} // The whole system slowly rotates
        transition={{ ease: 'linear', duration: 150, repeat: Infinity }}
      >
        {/* We create multiple ribbons at different angles and speeds for a complex, layered effect. */}
        <Ribbon rotateY={0} duration={60} />
        <Ribbon rotateY={60} duration={70} reverse />
        <Ribbon rotateY={120} duration={55} />
      </motion.div>
    </div>
  );
}
