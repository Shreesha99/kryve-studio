'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load Spline to avoid making it part of the main bundle
const Spline = React.lazy(() => import('@splinetool/react-spline'));

const slideUp = {
  initial: {
    top: 0,
  },
  exit: {
    top: '-100vh',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
};

const opacity = {
  initial: {
    opacity: 1,
  },
  enter: {
    opacity: 0,
    duration: 0.5,
  },
};

export function Preloader({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    if (!isSplineLoaded) return;

    let start = 0;
    const increment = () => {
      if (start >= 100) {
        // When progress reaches 100, trigger the exit animation
        setShow(false);
        return;
      }
      start += 1;
      setProgress(start);
      // Adjust timing to feel natural
      const timeout = 20 + Math.random() * 30;
      setTimeout(increment, timeout);
    };
    
    // Start loading after a short delay to let the spline scene settle
    setTimeout(increment, 500);

  }, [isSplineLoaded]);

  return (
    <AnimatePresence mode="wait" onExitComplete={onAnimationComplete}>
      {show && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-background text-foreground"
        >
          <div className="relative h-full w-full">
            <Suspense fallback={null}>
              <Spline
                scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                className="absolute inset-0 h-full w-full"
                onLoad={() => setIsSplineLoaded(true)}
              />
            </Suspense>
            
            <motion.p
              variants={opacity}
              initial="initial"
              animate={isSplineLoaded ? 'enter' : 'initial'}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
            >
              Loading...
            </motion.p>
            
            {isSplineLoaded && (
              <p className="absolute bottom-10 left-1/2 -translate-x-1/2 font-headline text-7xl md:text-9xl">
                {progress}
                <span className="text-3xl md:text-5xl">%</span>
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
