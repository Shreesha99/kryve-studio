"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type PreloaderProps = {
  onAnimationComplete?: () => void;
};

export default function Preloader({ onAnimationComplete }: PreloaderProps) {
  const overlayControls = useAnimation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  // 🔒 Sphere points MUST be stable across renders
  const points = useMemo(() => SPHERE_POINTS, []);

  useEffect(() => {
    let value = 0;
    let raf: number;

    const tick = () => {
      const remaining = 100 - value;

      // Slower, more gradual increment
      const increment =
        remaining > 50
          ? 0.5
          : remaining > 25
          ? 0.25
          : remaining > 10
          ? 0.12
          : 0.05;

      value = Math.min(100, value + increment);
      setProgress(Math.floor(value));

      if (value < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        exit();
      }
    };

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

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
          }}
          transition={{
            rotateY: { duration: 32, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 24, repeat: Infinity, ease: "linear" },
          }}
        >
          {points.map((p, i) => {
            const depth = (p.z + 1) / 2; // 0 (back) to 1 (front)
            const spread = 140; // controls the radius of the sphere
            const yOffset = Math.sin(i) * 10; // unique offset for wavy motion

            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  background: p.color,
                  // Opacity increases with depth for a 3D effect
                  opacity: 0.5 + depth * 0.5,
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
          {progress}
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

const SPHERE_POINTS = Array.from({ length: 96 }).map((_, i) => {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / 96);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;

  return {
    x: Math.cos(theta) * Math.sin(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(phi),
    color: COLORS[i % COLORS.length],
  };
});
