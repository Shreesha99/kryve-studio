'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { AnimateOnScroll } from '../common/animate-on-scroll';
import { PenTool, CodeXml, Users } from 'lucide-react';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    icon: PenTool,
    title: 'Purposeful Design',
    description:
      'Beyond aesthetics, we craft intuitive experiences that tell a compelling story and guide users with purpose.',
    svgPath: 'M 5, 5 C 150, 5, 150, 100, 300, 100',
  },
  {
    icon: CodeXml,
    title: 'Precision Engineering',
    description:
      'Our code is as clean as our designs. We build robust, scalable, and performant applications for a seamless experience.',
    svgPath: 'M 5, 120 L 100, 120 L 100, 200 L 200, 200 L 200, 80 L 300, 80',
  },
  {
    icon: Users,
    title: 'Creative Partnership',
    description:
      'We are your creative partner, collaborating closely to transform your vision into a digital reality.',
    svgPath: 'M 5, 220 C 100, 180, 200, 280, 300, 220',
  },
];

export function About() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<SVGPathElement[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure this runs only on the client
    const aboutSection = sectionRef.current;
    if (!aboutSection || !svgRef.current) return;

    const paths = pathRefs.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    paths.forEach((path, index) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      const principleContent = path
        .closest('.principle-item')
        ?.querySelector('.principle-content');
        
      if (principleContent) {
        tl.to(
          path,
          { strokeDashoffset: 0, duration: 2, ease: 'power1.inOut' },
          index * 0.5
        ).fromTo(
          principleContent,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
          '<'
        );
      }
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-background py-24 md:py-32 lg:py-40"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-5 lg:gap-24">
          <AnimateOnScroll className="lg:col-span-2">
            <h2 className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl">
              Where Artistry Meets Architecture
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
              We're a studio founded on a single belief: that the most powerful
              digital experiences are born at the intersection of beautiful
              design and flawless engineering.
            </p>
          </AnimateOnScroll>

          <div className="relative lg:col-span-3">
            <div
              className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-50"
              aria-hidden="true"
            >
              <svg
                ref={svgRef}
                viewBox="0 0 305 240"
                className="h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {principles.map((item, index) => (
                  <path
                    key={`path-${index}`}
                    ref={(el) => (pathRefs.current[index] = el!)}
                    d={item.svgPath}
                    stroke="hsl(var(--primary))"
                    fill="none"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ))}
              </svg>
            </div>
            <div className="space-y-12">
              {principles.map((item) => (
                <div
                  key={item.title}
                  className="principle-item relative flex items-start gap-6"
                >
                  <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary/10 bg-primary/5 p-4 backdrop-blur-sm">
                    <item.icon
                      className="h-6 w-6 text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="principle-content opacity-0">
                    <h3 className="font-headline text-2xl font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
