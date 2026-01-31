'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { ScrollHint } from '@/components/common/scroll-hint';
import { usePreloaderDone } from '@/components/common/app-providers';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

// A new component for the background dot pattern
function DotPattern() {
  const { resolvedTheme } = useTheme();
  const dotColor = resolvedTheme === 'dark' ? '255 255 255' : '0 0 0';

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full fill-current"
      style={{ color: `rgba(${dotColor}, 0.08)` }}
    >
      <defs>
        <pattern
          id="dot-pattern"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
  );
}

export function Hero() {
  const { preloaderDone } = usePreloaderDone();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Mouse position motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (preloaderDone) {
      // Delay readiness to allow preloader to exit
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [preloaderDone]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Animate motion values
      animate(mouseX, e.clientX - rect.left - rect.width / 2);
      animate(mouseY, e.clientY - rect.top - rect.height / 2);
    };
    
    // Only add listener on non-touch devices
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouchDevice) {
        window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (!isTouchDevice) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseX, mouseY]);

  // Transform mouse position into 3D rotation
  const rotateX = useTransform(mouseY, [-400, 400], [10, -10], {
    clamp: true,
  });
  const rotateY = useTransform(mouseX, [-400, 400], [-10, 10], {
    clamp: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background py-24 md:py-32 lg:py-0"
    >
      <DotPattern />

      {isReady && (
        <motion.div
          ref={containerRef}
          className="container z-10 mx-auto px-4 md:px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* The 3D Orb */}
            <motion.div
              className="relative flex h-[400px] w-[400px] items-center justify-center rounded-full sm:h-[500px] sm:w-[500px] lg:h-[600px] lg:w-[600px]"
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Concentric Rings */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-dashed"
                  style={{
                    width: `${100 - i * 25}%`,
                    height: `${100 - i * 25}%`,
                    borderColor: `hsl(var(--border) / ${1 - i * 0.2})`,
                    transform: `translateZ(${(i - 2) * 50}px)`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 1,
                      ease: 'easeOut',
                      delay: 0.2 + i * 0.1,
                    },
                  }}
                >
                  {/* Rotating element on each ring */}
                  <motion.div
                    className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-primary"
                    animate={{
                      rotate: 360,
                      transition: {
                        duration: 20 + i * 10,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: i,
                      },
                    }}
                  />
                </motion.div>
              ))}

              {/* Central Text Content */}
              <div
                className="relative z-10 text-center"
                style={{ transform: 'translateZ(60px)' }}
              >
                <motion.h1
                  variants={itemVariants}
                  className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-7xl"
                >
                  <div className="overflow-hidden py-1">
                    <span className="inline-block opacity-0">
                      Engineering{' '}
                      <span className="inline-block cursor-pointer rounded-full border border-foreground/50 bg-background/50 px-4 py-1 backdrop-blur-sm transition-colors duration-300 ease-in-out hover:bg-foreground hover:text-background">
                        Elegance
                      </span>
                      .
                    </span>
                  </div>
                  <div className="overflow-hidden py-1">
                    <span className="inline-block opacity-0">
                      Designing{' '}
                      <span className="inline-block cursor-pointer rounded-full border border-foreground/50 bg-background/50 px-4 py-1 backdrop-blur-sm transition-colors duration-300 ease-in-out hover:bg-foreground hover:text-background">
                        Impact
                      </span>
                      .
                    </span>
                  </div>
                </motion.h1>
              </div>
            </motion.div>

            {/* Subtext and CTAs - positioned below the orb */}
            <div className="mt-8 max-w-xl text-center">
              <motion.p
                variants={itemVariants}
                className="text-lg text-muted-foreground md:text-xl"
              >
                We are a digital studio that blends visionary design with
                precision engineering to create web experiences that are not only
                beautiful, but brilliant.
              </motion.p>

              <motion.div variants={itemVariants} className="mt-8">
                <Button size="lg" asChild>
                  <Link href="#work">Explore Our Work</Link>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6">
                <Button
                  asChild
                  variant="ghost"
                  className="h-auto p-0 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Link href="/blog">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    <span>Psst! Check out our new AI tools on the blog.</span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
      <ScrollHint scrollTo="#about" />
    </section>
  );
}
