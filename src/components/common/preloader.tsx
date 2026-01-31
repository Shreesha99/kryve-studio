'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load Spline to prevent it from blocking the main bundle and ensure stability.
const Spline = React.lazy(() => import('@splinetool/react-spline'));

// This variant controls the "swipe up from below" animation for the page reveal.
const slideUp = {
  initial: {
    top: 0, // Starts in view
  },
  exit: {
    top: '-100vh', // Slides up and out of view
    transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
};

export function Preloader({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isSplineLoaded) {
      // Once the 3D scene is loaded, wait a moment for the user to see it,
      // then trigger the exit animation.
      const timer = setTimeout(() => {
        setShow(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isSplineLoaded]);

  return (
    // AnimatePresence handles the exit animation when `show` becomes false.
    // onExitComplete is crucial for telling the app to render the main content.
    <AnimatePresence mode="wait" onExitComplete={onAnimationComplete}>
      {show && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
        >
          <Suspense fallback={null}>
            <Spline
              // This is a new, stable, and visually impressive scene that captures the "liquid metal" aesthetic.
              scene="https://prod.spline.design/A2jCBx-lV3sB2s3O/scene.splinecode"
              className="absolute inset-0 h-full w-full"
              onLoad={() => setIsSplineLoaded(true)}
            />
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
