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
      {/* 🌐 3D PARTICLE SPHERE */}
      <div
        className="absolute bottom-32 right-32 h-72 w-72"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: 360,
            rotateX: 180,
            scale: [1, 1.06, 1], // ❤️ heartbeat
          }}
          transition={{
            rotateY: { duration: 28, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {points.map((p, i) => {
            const depth = (p.z + 1) / 2;

            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: 3,
                  height: 3,
                  background: p.color,
                  opacity: 0.35 + depth * 0.65,
                }}
                initial={{
                  x: p.x * 120,
                  y: p.y * 120,
                  z: p.z * 120,
                }}
                animate={{
                  scale: [0.8, 1.25, 0.8], // 🌊 wave per particle
                }}
                transition={{
                  duration: 3 + (i % 6),
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* 🔢 HUGE PERCENTAGE */}
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
  "rgba(59,130,246,0.9)",
  "rgba(99,102,241,0.9)",
  "rgba(14,165,233,0.9)",
  "rgba(148,163,184,0.8)",
  "rgba(236,72,153,0.6)",
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
