'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { AnimateOnScroll } from '../common/animate-on-scroll';
import { PenTool, CodeXml, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    icon: PenTool,
    title: 'Visionary Design',
    description:
      "We don't follow trends; we set them. Our design philosophy is about creating immersive visual narratives that are not just seen, but felt, turning casual visitors into devoted brand advocates.",
  },
  {
    icon: CodeXml,
    title: 'Flawless Engineering',
    description:
      'Our code is our craft. We build with surgical precision, creating robust, scalable, and lightning-fast digital platforms that deliver a seamless experience on any device, every time.',
  },
  {
    icon: Users,
    title: 'Enduring Partnership',
    description:
      'Your vision is our blueprint. We function as a true extension of your team, fostering a deep collaborative relationship to build not just a project, but a long-term digital legacy.',
  },
];

const bgPaths = [
  "M -100 100 C 100 0, 200 200, 400 100 S 600 0, 800 100",
  "M 800 200 C 600 300, 500 100, 300 200 S 100 300, -100 200",
  "M -50 350 C 150 250, 250 450, 450 350 S 650 250, 850 350"
];


function PrincipleCard({ principle, index }: { principle: typeof principles[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const hoverTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const shine = shineRef.current;
    if (!card || !shine) return;

    const onMouseEnter = () => {
      if (hoverTl.current) {
        hoverTl.current.kill();
      }
      hoverTl.current = gsap.timeline();
      hoverTl.current
        .set(shine, { x: '-120%', skewX: -25, opacity: 0.15 })
        .to(shine, { x: '120%', duration: 0.75, ease: 'power2.out' });
    };

    card.addEventListener('mouseenter', onMouseEnter);

    return () => {
      card.removeEventListener('mouseenter', onMouseEnter);
      hoverTl.current?.kill();
    };
  }, []);

  return (
    <AnimateOnScroll delay={`${index * 150}ms`}>
      <div ref={cardRef} className="relative h-full overflow-hidden rounded-lg border bg-card p-8 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
        <div ref={shineRef} className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/10 bg-primary/5">
          <principle.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="mb-3 font-headline text-2xl font-bold">{principle.title}</h3>
        <p className="text-muted-foreground">{principle.description}</p>
      </div>
    </AnimateOnScroll>
  );
}

export function About() {
  const bgSvgRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paths = gsap.utils.toArray<SVGPathElement>('path', bgSvgRef.current);
    const bgTl = gsap.timeline({
      scrollTrigger: {
        trigger: bgSvgRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
      }
    });
    
    paths.forEach(path => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      bgTl.to(path, { strokeDashoffset: 0, duration: 3, ease: 'power1.inOut' }, 0);
    });
    
    const contentTl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
        }
    });
    
    if (titleRef.current) {
        const titleSpans = gsap.utils.toArray('span', titleRef.current);
        contentTl.fromTo(
            titleSpans,
            { yPercent: 120 },
            { yPercent: 0, stagger: 0.1, duration: 1.2, ease: 'power3.out' }
        );
    }
    if (paragraphRef.current) {
        contentTl.fromTo(
            paragraphRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            '-=0.8'
        );
    }

    return () => {
      bgTl.kill();
      contentTl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10 dark:opacity-5">
        <svg ref={bgSvgRef} width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 800 400">
          {bgPaths.map((path, i) => (
            <path
              key={i}
              d={path}
              stroke="hsl(var(--primary))"
              fill="none"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
            <h2 ref={titleRef} className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl">
                <div className="overflow-hidden py-1">
                    <span className="inline-block">We Don't Just Build Websites.</span>
                </div>
                <div className="overflow-hidden py-1">
                    <span className="inline-block">We Build Digital Landmarks.</span>
                </div>
            </h2>
          <p ref={paragraphRef} className="mx-auto mt-6 text-lg text-muted-foreground opacity-0">
            At Zenith, we believe a digital presence should be more than a URL. It should be a destination. We merge bold design with flawless engineering to create unforgettable online experiences that stand the test of time.
          </p>
        </div>
        
        <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <PrincipleCard key={p.title} principle={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
