'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Projects } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimateOnScroll } from '../common/animate-on-scroll';

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const projects = Projects;
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
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
      contentTl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} className="w-full bg-secondary py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 ref={titleRef} className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl">
            <div className="overflow-hidden py-1">
              <span className="inline-block">Featured Work</span>
            </div>
          </h2>
          <p ref={paragraphRef} className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground opacity-0">
            A selection of projects that showcase our passion for digital excellence.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {projects.map((project, index) => (
            <AnimateOnScroll key={project.id} delay={`${index * 150}ms`}>
              <Card className="overflow-hidden transition-all hover:shadow-xl">
                <CardHeader className="p-0">
                  <div className="aspect-video w-full overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.description}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      data-ai-hint={project.imageHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">{project.description}</CardDescription>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
