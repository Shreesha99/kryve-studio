'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { InteractiveOrbs } from '@/components/common/interactive-orbs';

const services = [
  {
    id: 'design',
    title: 'Visual Craft',
    description:
      'We forge digital identities. Our design philosophy merges aesthetic intuition with data-driven strategy to build interfaces that are not only beautiful but deeply functional and unforgettable.',
    svg: (
      <>
        <path d="M150 100 C 200 25, 400 25, 450 100 C 400 175, 200 175, 150 100" />
        <circle className="strategy-circle" cx="300" cy="100" r="30" />
      </>
    ),
  },
  {
    id: 'development',
    title: 'Code Artistry',
    description:
      'Our code is clean, efficient, and built to last. We use cutting-edge technologies to engineer robust, scalable, and lightning-fast web experiences that perform flawlessly under pressure.',
    svg: <path d="M250 50 L150 100 L250 150 M350 50 L450 100 L350 150" />,
  },
  {
    id: 'branding',
    title: 'Identity & Strategy',
    description:
      "A brand is a story, a feeling, a promise. We help you define and articulate your unique identity, creating a cohesive brand world that resonates with your audience and stands the test of time.",
    svg: (
      <>
        <circle className="strategy-circle" cx="300" cy="100" r="60" />
        <circle className="strategy-circle" cx="300" cy="100" r="30" />
        <circle
          cx="300"
          cy="100"
          r="5"
          className="fill-primary"
          stroke="none"
        />
      </>
    ),
  },
  {
    id: 'ecommerce',
    title: 'Commerce Platforms',
    description:
      'We build powerful e-commerce engines designed for growth. From seamless user journeys to secure payment gateways, we create online stores that convert visitors into loyal customers.',
    svg: (
      <>
        <path d="M180 150 L150 60 H 450 L 420 150 Z" />
        <path d="M200 100 h 200" />
        <circle cx="240" cy="170" r="15" />
        <circle cx="360" cy="170" r="15" />
      </>
    ),
  },
];

const AUTOPLAY_DURATION = 5; // seconds

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const progressTl = useRef<gsap.core.Timeline>();

  const runAutoplay = useCallback((index: number) => {
    progressTl.current?.kill();
    const progressBars = gsap.utils.toArray<HTMLDivElement>('.progress-bar-fill', sectionRef.current);
    gsap.set(progressBars, { scaleY: 0, transformOrigin: 'bottom' });

    progressTl.current = gsap.timeline({
      onComplete: () => {
        const nextIndex = (index + 1) % services.length;
        setActiveIndex(nextIndex);
      },
    }).to(progressBars[index], {
      scaleY: 1,
      duration: AUTOPLAY_DURATION,
      ease: 'linear',
    });
  }, []);

  // Effect to handle animations when activeIndex changes
  useEffect(() => {
    if (!isHovering) {
      runAutoplay(activeIndex);
    }
    const ctx = gsap.context(() => {
      // Animate description
      gsap.fromTo(
        '.service-description',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
      
      // Animate SVGs
      const allSvgs = gsap.utils.toArray<SVGSVGElement>('svg.service-svg', sectionRef.current);
      const activeSvg = allSvgs.find(svg => svg.id === `svg-${services[activeIndex].id}`);
      
      gsap.to(allSvgs, { autoAlpha: 0, duration: 0.4 });
      
      if(activeSvg) {
          gsap.fromTo(activeSvg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
          const paths = gsap.utils.toArray<SVGPathElement>('path', activeSvg);
          if (paths.length > 0) {
            paths.forEach(path => {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
                gsap.to(path, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' });
            });
          }
          const circles = gsap.utils.toArray<SVGCircleElement>('.strategy-circle', activeSvg);
          if (circles.length > 0) {
            gsap.fromTo(circles, { scale: 0, transformOrigin: 'center' }, { scale: 1, stagger: 0.2, duration: 1, ease: 'elastic.out(1, 0.5)' });
          }
      }

    }, sectionRef);
    return () => ctx.revert();
  }, [activeIndex, isHovering, runAutoplay]);
  
  const handleMouseEnter = (index: number) => {
    setIsHovering(true);
    progressTl.current?.pause();
    if(index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    progressTl.current?.play();
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-background py-24 md:py-32"
    >
      <InteractiveOrbs />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-8">
            <h2 className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl">
              Anatomy of Excellence
            </h2>

            <ul className="border-t border-border" onMouseLeave={handleMouseLeave}>
              {services.map((service, index) => (
                <li
                  key={service.id}
                  className="relative border-b border-border"
                  onMouseEnter={() => handleMouseEnter(index)}
                >
                   <div className="absolute left-0 top-0 h-full w-px bg-border/30">
                    <div className="progress-bar-fill h-full w-full bg-primary" />
                  </div>
                  <div
                    className={cn(
                      'group flex w-full cursor-pointer items-center justify-between py-8 pl-6 text-left transition-colors duration-300'
                    )}
                  >
                    <h3
                      className={cn(
                        'font-headline text-3xl font-medium sm:text-4xl transition-colors',
                        activeIndex === index
                          ? 'text-primary'
                          : 'text-foreground/60 group-hover:text-foreground'
                      )}
                    >
                      {service.title}
                    </h3>
                    <span
                      className={cn(
                        'material-symbols-outlined text-4xl text-primary transition-all duration-500 ease-in-out',
                        activeIndex === index
                          ? 'translate-x-0 opacity-100'
                          : '-translate-x-4 opacity-0'
                      )}
                    >
                      arrow_right_alt
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex min-h-[450px] w-full flex-col items-center justify-center rounded-lg lg:min-h-[30rem]">
            <div
              className="absolute inset-x-0 top-0 flex h-1/2 w-full items-center justify-center p-8"
            >
              {services.map(service => (
                <svg
                  key={service.id}
                  id={`svg-${service.id}`}
                  viewBox="0 0 600 200"
                  className="service-svg absolute h-full w-full opacity-0"
                  preserveAspectRatio="xMidYMid meet"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {service.svg}
                </svg>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex h-1/2 w-full items-center justify-center p-4">
              <p className="service-description relative z-10 max-w-md text-center text-lg text-muted-foreground">
                {services[activeIndex].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
