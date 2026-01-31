"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useMemo, useState, useRef } from "react";

type PreloaderProps = {
  onAnimationComplete?: () => void;
};

export default function Preloader({ onAnimationComplete }: PreloaderProps) {
  const overlayControls = useAnimation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔒 Sphere points MUST be stable across renders
  const points = useMemo(() => SPHERE_POINTS, []);

  useEffect(() => {
    let value = 0;
    let raf: number;

    const exit = async () => {
      // Reverted to only slide up, no fade
      await overlayControls.start({
        y: -window.innerHeight,
        transition: {
          duration: 1.3,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      });
      setVisible(false);
      onAnimationComplete?.();
    };

    const tick = () => {
      const remaining = 100 - value;

      // Refined increment for a more noticeable slowdown at the end.
      const increment =
        remaining > 50
          ? 1.0   // Fast start
          : remaining > 20
          ? 0.5   // Medium pace
          : remaining > 5
          ? 0.2   // Slow down
          : 0.1;  // Crawl to the finish

      value = Math.min(100, value + increment);
      setProgress(value);

      if (value < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        // Ensure 100% is rendered before starting the exit animation
        setProgress(100);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(exit, 100); // Small delay
      }
    };

    raf = requestAnimationFrame(tick);
    
    return () => {
      cancelAnimationFrame(raf);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [overlayControls, onAnimationComplete]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-background"
      initial={{ y: 0 }}
      animate={overlayControls}
    >
      {/* 🌐 3D PARTICLE SPHERE - Centered & Responsive */}
      <div
        className="absolute top-1/2 left-1/2 h-[70vmin] w-[70vmin] max-h-[24rem] max-w-[24rem] -translate-x-1/2 -translate-y-1/2"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: 360,
            rotateX: 180,
            scale: [1, 1.06, 1], // ❤️ Heartbeat effect
          }}
          transition={{
            rotateY: { duration: 32, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 24, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {points.map((p, i) => {
            const depth = (p.z + 1) / 2; // 0 (back) to 1 (front)
            const spread = 140; // controls the radius of the sphere
            const yOffset = Math.sin(i) * 10; // unique offset for wavy motion
            
            // 🔥 NEW: Dynamic size and blur for 3D effect
            const size = 1.5 + depth * 3; // Particles in front are bigger
            const blurAmount = (1 - depth) * 1.5; // Particles in back are blurrier

            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: p.color,
                  // 🔥 NEW: Emphasize front particles more
                  opacity: 0.4 + depth * 0.6, 
                  // 🔥 NEW: Apply depth-of-field blur
                  filter: `blur(${blurAmount}px)`,
                }}
                initial={{
                  x: p.x * spread,
                  y: p.y * spread,
                  z: p.z * spread,
                }}
                // More organic "wiggly/wavy" animation
                animate={{
                  scale: [0.9, 1.2, 0.9],
                  y: [p.y * spread, p.y * spread + yOffset, p.y * spread],
                }}
                transition={{
                  duration: 4 + (i % 7), // Varied duration for realism
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* 🔢 HUGE PERCENTAGE - Reverted to bottom-right */}
      <div className="absolute bottom-10 right-10 select-none">
        <span className="text-[9rem] leading-none font-semibold tracking-tight text-foreground">
          {Math.floor(progress)}
        </span>
        <span className="absolute right-[-1.5rem] top-3 text-3xl text-foreground/40">
          %
        </span>
      </div>
    </motion.div>
  );
}

/* ---------------- SPHERE DATA ---------------- */

const COLORS = [
  "rgba(236, 72, 153, 1)", // Vibrant Pink
  "rgba(139, 92, 246, 1)", // Bright Violet
  "rgba(34, 211, 238, 1)", // Sharp Cyan
  "rgba(99, 102, 241, 1)", // Vivid Indigo
  "rgba(56, 189, 248, 1)", // Bold Sky Blue
];

const SPHERE_POINTS = Array.from({ length: 144 }).map((_, i) => {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / 144);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;

  return {
    x: Math.cos(theta) * Math.sin(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(phi),
    color: COLORS[i % COLORS.length],
  };
});
