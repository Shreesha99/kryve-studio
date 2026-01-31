
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { ScrollHint } from '@/components/common/scroll-hint';
import { usePreloaderDone } from '@/components/common/app-providers';
import { useTheme } from 'next-themes';

export function Hero() {
  const { preloaderDone } = usePreloaderDone();
  const [isReady, setIsReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  // Refs for canvas animation
  const mousePos = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();

  useEffect(() => {
    if (preloaderDone) {
      // Delay readiness to allow preloader to exit
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [preloaderDone]);

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Only add listener on non-touch devices
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove);
      lastPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    const animate = () => {
      if (!isTouchDevice) {
        // Fading effect
        ctx.fillStyle = resolvedTheme === 'dark' 
            ? 'rgba(5, 5, 10, 0.12)' 
            : 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Line drawing from last frame's position to current mouse position
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(mousePos.current.x, mousePos.current.y);
        
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        ctx.strokeStyle = `hsl(${primaryColor})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Smoothly interpolate lastPos towards the current mouse position
        lastPos.current.x += (mousePos.current.x - lastPos.current.x) * 0.2;
        lastPos.current.y += (mousePos.current.y - lastPos.current.y) * 0.2;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      if (!isTouchDevice) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [resolvedTheme]);

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
      className="relative flex min-h-screen w-full cursor-crosshair items-center justify-center overflow-hidden bg-background py-24 md:py-32 lg:py-0"
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />

      {isReady && (
        <motion.div
          className="container z-10 mx-auto px-4 text-center md:px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative flex flex-col items-center justify-center">
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

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              We are a digital atelier where art, code, and strategy converge. We don't just build websites; we forge landmark digital experiences that are not only beautiful but brilliant—and built to last.
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
        </motion.div>
      )}
      <ScrollHint scrollTo="#about" />
    </section>
  );
}
    