'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 'design',
    title: 'Visual Craft',
    description:
      'We forge digital identities. Our design philosophy merges aesthetic intuition with data-driven strategy to build interfaces that are not only beautiful but deeply functional and unforgettable.',
    svgPath: 'M 50 100 C 150 20, 250 180, 350 100 S 550 0, 550 150',
  },
  {
    id: 'development',
    title: 'Code Artistry',
    description:
      'Our code is clean, efficient, and built to last. We use cutting-edge technologies to engineer robust, scalable, and lightning-fast web experiences that perform flawlessly under pressure.',
    svgPath: 'M 100 150 L 150 100 L 200 150 M 250 100 L 350 100 M 400 150 L 450 100 L 500 150',
  },
  {
    id: 'branding',
    title: 'Identity Design',
    description:
      'A brand is a story, a feeling, a promise. We help you define and articulate your unique identity, creating a cohesive brand world that resonates with your audience and stands the test of time.',
    svgPath: 'M 300 50 L 320 150 L 250 100 H 350 L 280 150 Z',
  },
  {
    id: 'ecommerce',
    title: 'Commerce Platforms',
    description:
      'We build powerful e-commerce engines designed for growth. From seamless user journeys to secure payment gateways, we create online stores that convert visitors into loyal customers.',
    svgPath: 'M 100 150 H 130 L 160 50 H 450 L 420 150 H 180 M 200 180 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0 M 350 180 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0',
  },
];

export function Services() {
  const [activeService, setActiveService] = useState(services[0]);
  const sectionRef = useRef<HTMLElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!svgContainerRef.current || !descRef.current || !activeService) return;

      const svg = svgContainerRef.current.querySelector(`#svg-${activeService.id}`) as SVGSVGElement | null;
      if (!svg) return;
      
      const path = svg.querySelector('path');
      if (!path) return;

      const length = path.getTotalLength();
      
      const masterTl = gsap.timeline();
      
      masterTl.fromTo(descRef.current, 
          { autoAlpha: 0, y: 15 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      masterTl.to(svgContainerRef.current.querySelectorAll('svg:not(#' + svg.id + ')'), { autoAlpha: 0, duration: 0.4 }, 0);
      
      const svgTl = gsap.timeline();
      svgTl.set(path, { strokeDasharray: length, strokeDashoffset: length, autoAlpha: 1 })
        .to(svg, { autoAlpha: 1 }, 0)
        .to(path, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' });

      masterTl.add(svgTl, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, [activeService]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-8">
             <h2 className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl">
              Anatomy of Excellence
             </h2>
            
            <ul className="border-t border-border">
              {services.map((service) => (
                <li key={service.id}>
                  <button
                    onMouseEnter={() => setActiveService(service)}
                    className={cn(
                      'group flex w-full cursor-pointer items-center justify-between border-b border-border py-8 text-left transition-colors duration-300'
                    )}
                  >
                    <h3 className={cn(
                        'font-headline text-3xl font-medium sm:text-4xl transition-colors',
                         activeService.id === service.id ? 'text-primary' : 'text-foreground/60 group-hover:text-foreground'
                        )}>
                      {service.title}
                    </h3>
                    <span className={cn(
                        "material-symbols-outlined text-4xl text-primary transition-all duration-500 ease-in-out",
                        activeService.id === service.id ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        )}>
                        arrow_right_alt
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex h-80 min-h-[300px] w-full flex-col items-center justify-center rounded-lg lg:h-96">
              <div ref={svgContainerRef} className="absolute inset-0 flex items-center justify-center p-8">
              {services.map(service => (
                  <svg
                  key={service.id}
                  id={`svg-${service.id}`}
                  viewBox="0 0 600 200"
                  className="absolute h-full w-full opacity-0"
                  preserveAspectRatio="xMidYMid meet"
                  fill="none"
                  >
                  <path
                      d={service.svgPath}
                      stroke="hsl(var(--primary))"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                  />
                  </svg>
              ))}
              </div>
              <p ref={descRef} className="relative mt-8 text-center text-lg text-muted-foreground opacity-0 lg:mt-16">
                  {activeService.description}
              </p>
          </div>
        </div>
      </div>
    </section>
  );
}
