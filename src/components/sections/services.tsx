'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/dist/TextPlugin';
import { cn } from '@/lib/utils';
import { InteractiveOrbs } from '@/components/common/interactive-orbs';

gsap.registerPlugin(TextPlugin);

const services = [
  {
    id: 'design',
    title: 'Visual Craft',
    description:
      'We forge digital identities. Our design philosophy merges aesthetic intuition with data-driven strategy to build interfaces that are not only beautiful but deeply functional and unforgettable.',
    svg: (
      <>
        <path
          className="eye-outline"
          d="M150 100 C 200 25, 400 25, 450 100 C 400 175, 200 175, 150 100 Z"
        />
        <circle className="pupil" cx="300" cy="100" r="30" fill="hsl(var(--primary))" stroke="none" />
        <path
          className="eyelid"
          d="M150 100 C 200 25, 400 25, 450 100"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    id: 'development',
    title: 'Code Artistry',
    description:
      'Our code is clean, efficient, and built to last. We use cutting-edge technologies to engineer robust, scalable, and lightning-fast web experiences that perform flawlessly under pressure.',
    svg: (
      <>
        <path className="bracket" d="M250 50 L150 100 L250 150" />
        <path className="bracket" d="M350 50 L450 100 L350 150" />
        <text
          className="code-tag-text"
          x="300"
          y="112"
          textAnchor="middle"
          fontSize="30"
          fontFamily="monospace"
          stroke="none"
          fill="hsl(var(--primary))"
        ></text>
      </>
    ),
  },
  {
    id: 'branding',
    title: 'Identity & Strategy',
    description:
      'A brand is a story, a feeling, a promise. We help you define and articulate your unique identity, creating a cohesive brand world that resonates with your audience and stands the test of time.',
    svg: (
      <>
        <g className="target-group">
          <circle className="strategy-circle" cx="300" cy="100" r="80" />
          <circle className="strategy-circle" cx="300" cy="100" r="50" />
          <circle
            cx="300"
            cy="100"
            r="10"
            className="fill-primary pupil"
            stroke="none"
          />
        </g>
        <g className="arrow-group" opacity="0" transform="translate(0, 0) scale(1)">
          <path d="M0 0 L-60 0" className="arrow-shaft" strokeWidth="6" />
          <path d="M-5 5 L 0 0 L -5 -5" className="arrow-head" strokeWidth="6"/>
        </g>
      </>
    ),
  },
  {
    id: 'ecommerce',
    title: 'Commerce Platforms',
    description:
      'We build powerful e-commerce engines designed for growth. From seamless user journeys to secure payment gateways, we create online stores that convert visitors into loyal customers.',
    svg: (
      <g className="cart-group">
        <path className="speed-line" d="M130 80 L 160 80" opacity="0"/>
        <path className="speed-line" d="M120 100 L 170 100" opacity="0"/>
        <path className="speed-line" d="M130 120 L 160 120" opacity="0"/>
        
        <g className="cart-container">
          <path className="cart-body" d="M180 150 L160 70 H 440 L 420 150 Z" />
          <circle className="cart-wheel" cx="220" cy="170" r="15" />
          <circle className="cart-wheel" cx="380" cy="170" r="15" />
        </g>
      </g>
    ),
  },
];

const AUTOPLAY_DURATION = 5; // seconds

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const progressTl = useRef<gsap.core.Timeline>();
  const secondaryAnimation = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  const runAutoplay = useCallback((index: number) => {
    if (isTouchDevice) return; 

    progressTl.current?.kill();
    const progressBars = gsap.utils.toArray<HTMLDivElement>(
      '.progress-bar-fill',
      sectionRef.current
    );
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
  }, [isTouchDevice]);

  useEffect(() => {
    secondaryAnimation.current?.kill();

    if (!isHovering && !isTouchDevice) {
      runAutoplay(activeIndex);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-description',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      const allSvgs = gsap.utils.toArray<SVGSVGElement>(
        'svg.service-svg',
        sectionRef.current
      );
      const activeSvg = allSvgs.find(
        (svg) => svg.id === `svg-${services[activeIndex].id}`
      );

      gsap.to(allSvgs, { autoAlpha: 0, duration: 0.4 });

      if (activeSvg) {
        const mainDrawTl = gsap.timeline({
          onComplete: () => {
            secondaryAnimation.current?.kill();
            secondaryAnimation.current = gsap.timeline({repeat: -1, repeatDelay: 1});

            const currentService = services[activeIndex];

            if (currentService.id === 'design') {
                const eyelid = activeSvg.querySelector('.eyelid');
                const blinkTl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1.5 });
                blinkTl.to(eyelid, { 
                  attr: { d: "M150 100 C 200 100, 400 100, 450 100" }, 
                  duration: 0.15, 
                  ease: 'power2.inOut'
                });
                secondaryAnimation.current.add(blinkTl, '+=0.5');
            }

            if (currentService.id === 'development') {
              const textEl = activeSvg.querySelector('.code-tag-text');
              if (textEl) {
                const tags = ['a', 'p', 'h1', 'div'];
                let index = 0;
                gsap.set(textEl, { textContent: tags[0] });
                secondaryAnimation.current.to(textEl, {
                  duration: 1.5,
                  text: {
                    value: () => {
                      index = (index + 1) % tags.length;
                      return tags[index];
                    },
                    delimiter: "",
                  },
                  repeat: -1,
                  repeatDelay: 0.8,
                  ease: 'none',
                }, '+=0.5');
              }
            }

            if (currentService.id === 'branding') {
              const arrowGroup = activeSvg.querySelector('.arrow-group');
              const bullseye = activeSvg.querySelector('.pupil');
              const arrowTl = gsap.timeline();
              arrowTl
                .fromTo(arrowGroup, {opacity: 1, x: 450, y: 80, scale: 1.8}, { x: 300, y: 100, scale: 1, duration: 0.4, ease: 'power2.in', delay: 0.5 })
                .to(bullseye, { scale: 1.5, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center' }, '>-=0.05')
                .to(arrowGroup, { opacity: 0, duration: 0.2 }, '+=0.2');
              secondaryAnimation.current.add(arrowTl);
            }

            if (currentService.id === 'ecommerce') {
              const wheels = activeSvg.querySelectorAll('.cart-wheel');
              const speedLines = activeSvg.querySelectorAll('.speed-line');
              const cartContainer = activeSvg.querySelector('.cart-container');
              const cartMovementTl = gsap.timeline();
              cartMovementTl.to(wheels, {
                  rotation: 360,
                  transformOrigin: 'center',
                  duration: 1,
                  ease: 'none'
              })
              .fromTo(speedLines, 
                  { x: 0, opacity: 1 }, 
                  { x: -30, opacity: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1},
                  "<"
              )
              .to(cartContainer, {y: -3, repeat: 1, yoyo: true, duration: 0.2, ease: 'power2.inOut'}, "<0.1");

              secondaryAnimation.current.add(cartMovementTl, '+=0.5');
            }
          },
        });

        mainDrawTl.fromTo(
          activeSvg,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4 }
        );
        
        const paths = gsap.utils.toArray<SVGPathElement>(
          '.bracket, .eye-outline, .cart-body, .eyelid, .arrow-shaft, .arrow-head',
          activeSvg
        );
        if (paths.length > 0) {
          paths.forEach((path) => {
            const length = path.getTotalLength();
            mainDrawTl.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              {
                strokeDashoffset: 0,
                duration: 1,
                ease: 'power2.inOut',
              },
              '<'
            );
          });
        }
        const circles = gsap.utils.toArray<SVGCircleElement>(
          '.pupil, .strategy-circle, .cart-wheel',
          activeSvg
        );
        if (circles.length > 0) {
          mainDrawTl.fromTo(
            circles,
            { scale: 0, transformOrigin: 'center' },
            {
              scale: 1,
              stagger: 0.15,
              duration: 0.8,
              ease: 'elastic.out(1, 0.6)',
            },
            '<0.2'
          );
        }
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [activeIndex, isHovering, runAutoplay, isTouchDevice]);
  
  const handleClick = (index: number) => {
    if (isTouchDevice && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (isTouchDevice) return;
    setIsHovering(true);
    progressTl.current?.pause();
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
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

            <ul
              className="border-t border-border"
              onMouseLeave={handleMouseLeave}
            >
              {services.map((service, index) => (
                <li
                  key={service.id}
                  className="relative border-b border-border"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={() => handleClick(index)}
                >
                  {!isTouchDevice && (
                    <div className="absolute left-0 top-0 h-full w-px bg-border/30">
                        <div className="progress-bar-fill h-full w-full bg-primary" />
                    </div>
                  )}
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
          <div className="relative flex w-full flex-col lg:min-h-[30rem]">
            <div className="relative flex h-64 w-full items-center justify-center p-8 lg:h-1/2 lg:flex-grow">
              {services.map((service) => (
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
            <div className="relative flex h-48 w-full items-center justify-center p-4">
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
