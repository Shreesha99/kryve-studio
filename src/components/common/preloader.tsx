'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load the Spline component to avoid increasing the main bundle size
const Spline = React.lazy(() => import('@splinetool/react-spline'));

interface PreloaderProps {
  onAnimationComplete: () => void;
}

// A component to display the loading percentage counter
const LoadingCounter = ({ onHundred }: { onHundred: () => void }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Animate count from 0 to 100
    const interval = setInterval(() => {
      setCount(prevCount => {
        if (prevCount >= 100) {
          clearInterval(interval);
          onHundred();
          return 100;
        }
        return prevCount + 1;
      });
    }, 30); // 30ms * 100 = 3 seconds for the count up

    return () => clearInterval(interval);
  }, [onHundred]);

  return (
    <motion.p
      className="font-headline text-5xl md:text-6xl text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {count}%
    </motion.p>
  );
};

export function Preloader({ onAnimationComplete }: PreloaderProps) {
  const [isCounting, setIsCounting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Start the percentage counter after a brief delay
    const timer = setTimeout(() => setIsCounting(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // This function is called after the main container's exit animation finishes
  const handleExitComplete = () => {
    onAnimationComplete();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, transition: { duration: 1.2, ease: 'circOut' } }}
        >
          {/* Main 3D object container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative h-64 w-64 md:h-80 md:w-80"
          >
            {/* Use Suspense to handle the lazy loading of the Spline component */}
            <Suspense fallback={<div className="h-full w-full" />}>
              <Spline
                // A premium, abstract 3D object that fits the brand
                scene="https://prod.spline.design/6Wq123V92J3p3v66/scene.splinecode"
              />
            </Suspense>
          </motion.div>

          {/* Absolute positioned counter to overlay the 3D object */}
          {isCounting && (
            <div className="absolute">
              <LoadingCounter onHundred={() => setIsComplete(true)} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
