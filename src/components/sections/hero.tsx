'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { ScrollHint } from '@/components/common/scroll-hint';
import { usePreloaderDone } from '@/components/common/app-providers';
import { useTheme } from 'next-themes';

// A single dot in the grid
class Dot {
  x: number;
  y: number;
  radius: number;
  originalRadius: number;
  color: string;
  targetRadius: number;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.originalRadius = radius;
    this.targetRadius = radius;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

export function Hero() {
  const { preloaderDone } = usePreloaderDone();
  const [isReady, setIsReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  // Refs for canvas animation
  const mousePos = useRef({ x: -9999, y: -9999 });
  const dots = useRef<Dot[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    // This logic ensures the hero content animates in only *after* the preloader is done.
    if (preloaderDone) {
      // Small delay to let the preloader animation finish completely
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
    
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if(isTouchDevice) {
      canvas.style.display = 'none';
      return;
    }

    // --- RELIABLE COLOR LOGIC ---
    // Directly use the theme state to determine colors, avoiding race conditions.
    const isDark = resolvedTheme === 'dark';
    const primaryColor = isDark ? 'hsl(0, 0%, 98%)' : 'hsl(240, 5.9%, 10%)';
    const mutedColor = isDark ? 'hsla(0, 0%, 100%, 0.15)' : 'hsla(0, 0%, 0%, 0.2)';

    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      createDots(rect.width, rect.height);
    };

    const createDots = (width: number, height: number) => {
        dots.current = [];
        const gap = 30;
        const dotRadius = 1;
        for (let x = gap / 2; x < width; x += gap) {
            for (let y = gap / 2; y < height; y += gap) {
                // The dots array is rebuilt with the correct color
                dots.current.push(new Dot(x, y, dotRadius, mutedColor));
            }
        }
    }

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    
    const handleMouseLeave = () => {
      mousePos.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);


    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        dots.current.forEach(dot => {
            const dx = dot.x - mousePos.current.x;
            const dy = dot.y - mousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxDist = 100;
            if (dist < maxDist) {
                const force = (maxDist - dist) / maxDist;
                dot.targetRadius = dot.originalRadius + force * 3;
                dot.color = primaryColor;
            } else {
                dot.targetRadius = dot.originalRadius;
                dot.color = mutedColor;
            }

            // easing
            dot.radius += (dot.targetRadius - dot.radius) * 0.1;
            
            dot.draw(ctx);
        });
        
        animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start the animation loop. The cleanup function will handle stopping it.
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [resolvedTheme]); // Re-run this entire effect when the theme changes.

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
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

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
                <span className="inline-block opacity-0" style={{ animation: isReady ? 'fade-in-up 0.8s ease-out 0.3s forwards' : 'none' }}>
                  Engineering{' '}
                  <span className="inline-block cursor-pointer rounded-full border border-foreground/50 bg-background/50 px-4 py-1 backdrop-blur-sm transition-colors duration-300 ease-in-out hover:bg-foreground hover:text-background">
                    Elegance
                  </span>
                  .
                </span>
              </div>
              <div className="overflow-hidden py-1">
                <span className="inline-block opacity-0" style={{ animation: isReady ? 'fade-in-up 0.8s ease-out 0.5s forwards' : 'none' }}>
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
              We are the architects of the digital frontier. A studio where visionary design and precision engineering are not just goals, but absolute standards. We craft high-performance web experiences that captivate users and create lasting market impact.
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
