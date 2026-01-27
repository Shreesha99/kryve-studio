'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Autoplay from 'embla-carousel-autoplay';
import { Projects } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const AUTOPLAY_DURATION = 5000;

export function Work() {
  const projects = Projects;
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const progressRingRef = useRef<SVGCircleElement>(null);
  const progressTween = useRef<gsap.core.Tween | null>(null);

  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const autoplayPlugin = useRef(
    Autoplay({ delay: AUTOPLAY_DURATION, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  // Animate the section title and paragraph
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

  const animateProgressRing = useCallback(() => {
    if (progressTween.current) {
      progressTween.current.kill();
    }
    gsap.set(progressRingRef.current, { strokeDashoffset: 301.59 });
    progressTween.current = gsap.to(progressRingRef.current, {
      strokeDashoffset: 0,
      duration: AUTOPLAY_DURATION / 1000,
      ease: 'linear',
    });
  }, []);

  const onSelect = useCallback((api: CarouselApi) => {
    setCurrentSlide(api.selectedScrollSnap());
    animateProgressRing();
  }, [animateProgressRing]);

  useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api) return;
    
    if (isDialogOpen) {
      autoplayPlugin.current.stop();
      progressTween.current?.pause();
    } else {
      autoplayPlugin.current.play();
      progressTween.current?.resume();
    }
  }, [isDialogOpen, api]);

  const handleProjectClick = (project: (typeof projects)[0]) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Carousel
            setApi={setApi}
            plugins={[autoplayPlugin.current]}
            opts={{ loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {projects.map((project) => (
                <CarouselItem key={project.id} className="md:basis-1/2">
                  <DialogTrigger asChild onClick={() => handleProjectClick(project)}>
                    <div className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg">
                      <div className="aspect-video w-full">
                        <Image
                          src={project.imageUrl}
                          alt={project.description}
                          width={800}
                          height={600}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint={project.imageHint}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="font-headline text-3xl font-bold text-white transition-transform duration-300 group-hover:-translate-y-1">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                  </DialogTrigger>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-12 flex items-center justify-center gap-6">
              <CarouselPrevious className="static h-12 w-12 -translate-y-0" />
              <div className="relative h-24 w-24">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-border/20"
                    strokeWidth="5"
                    fill="transparent"
                    r="48"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    ref={progressRingRef}
                    className="stroke-primary -rotate-90 origin-center"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="transparent"
                    r="48"
                    cx="50"
                    cy="50"
                    strokeDasharray="301.59"
                    strokeDashoffset="301.59"
                  />
                </svg>
                <div className="absolute inset-0 flex items-baseline justify-center">
                  <span className="font-headline text-3xl font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
                </div>
              </div>
              <CarouselNext className="static h-12 w-12 -translate-y-0" />
            </div>
          </Carousel>

          {selectedProject && (
            <DialogContent className="max-h-[90vh] max-w-4xl p-0">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  data-ai-hint={selectedProject.imageHint}
                />
              </div>
              <DialogHeader className="p-6 text-left">
                <DialogTitle className="font-headline text-4xl">{selectedProject.title}</DialogTitle>
                <DialogDescription className="pt-2 text-base text-muted-foreground">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  );
}
