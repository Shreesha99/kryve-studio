'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Projects } from '@/lib/placeholder-images';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AUTOPLAY_DURATION = 5; // seconds

export function Work() {
  const projects = Projects;
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] =
    useState<(typeof projects)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const autoplayTl = useRef<gsap.core.Timeline | null>(null);
  const imageAnimation = useRef<gsap.core.Tween | null>(null);

  // Animate the section title and paragraph on scroll
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
      gsap
        .getTweensOf([titleRef.current, paragraphRef.current])
        .forEach((t) => t.kill());
    };
  }, []);

  // Handle image and title animations when activeIndex changes
  useEffect(() => {
    if (!listRef.current || !imageContainerRef.current) return;

    const allImages = gsap.utils.toArray<HTMLDivElement>(
      '.project-image',
      imageContainerRef.current
    );
    const allListItems = gsap.utils.toArray<HTMLLIElement>('li', listRef.current);
    const allProgressBars = gsap.utils.toArray<HTMLDivElement>(
      '.progress-bar-inner',
      listRef.current
    );

    const activeImage = allImages[activeIndex];

    // Kill previous animation to avoid conflicts
    if (imageAnimation.current) {
      imageAnimation.current.kill();
    }

    gsap.to(allImages, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
    gsap.to(activeImage, { opacity: 1, duration: 0.5, ease: 'power2.inOut' });

    // Ken Burns effect
    if (activeImage) {
      imageAnimation.current = gsap.fromTo(
        activeImage.querySelector('img'),
        { scale: 1.05, y: '2%' },
        { scale: 1, y: '0%', duration: AUTOPLAY_DURATION + 2, ease: 'linear' }
      );
    }

    // Update titles style
    allListItems.forEach((listItem, index) => {
      const title = listItem.querySelector('h3');
      if (title) {
        gsap.to(title, {
          color:
            index === activeIndex
              ? 'hsl(var(--primary))'
              : 'hsl(var(--muted-foreground))',
          duration: 0.5,
        });
      }
    });

    // Reset and start progress bar for the active item
    gsap.set(allProgressBars, { scaleX: 0 });
    if (autoplayTl.current && !autoplayTl.current.paused()) {
      gsap.to(allProgressBars[activeIndex], {
        scaleX: 1,
        duration: AUTOPLAY_DURATION,
        ease: 'linear',
      });
    }
  }, [activeIndex]);

  // Handle autoplay logic
  useEffect(() => {
    if (isHovering || isDialogOpen) {
      autoplayTl.current?.pause();
      return;
    }

    autoplayTl.current = gsap.timeline({
      onRepeat: () => {
        const allProgressBars = gsap.utils.toArray<HTMLDivElement>(
          '.progress-bar-inner',
          listRef.current
        );
        gsap.set(allProgressBars, { scaleX: 0 }); // Reset all on loop
      },
      repeat: -1,
    });

    projects.forEach((_, index) => {
      autoplayTl.current?.add(() => {
        setActiveIndex(index);
      }, `+=${AUTOPLAY_DURATION}`);
    });

    // Initial start
    const allProgressBars = gsap.utils.toArray<HTMLDivElement>(
      '.progress-bar-inner',
      listRef.current
    );
    if (allProgressBars[activeIndex]) {
      gsap.to(allProgressBars[activeIndex], {
        scaleX: 1,
        duration: AUTOPLAY_DURATION,
        ease: 'linear',
      });
    }

    return () => {
      autoplayTl.current?.kill();
    };
  }, [isHovering, isDialogOpen, projects.length, activeIndex]);

  const handleMouseEnter = (index: number) => {
    setIsHovering(true);
    setActiveIndex(index);
    // Pause current progress bar animation
    const allProgressBars = gsap.utils.toArray<HTMLDivElement>(
      '.progress-bar-inner',
      listRef.current
    );
    gsap.killTweensOf(allProgressBars);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleProjectClick = (project: (typeof projects)[0]) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
    setIsHovering(true); // Pauses autoplay
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setIsHovering(false); // Resume autoplay when dialog closes
    }
  }, [isDialogOpen]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="w-full bg-secondary py-24 md:py-32 lg:py-40"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2
            ref={titleRef}
            className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            <div className="overflow-hidden py-1">
              <span className="inline-block">Curated Craft</span>
            </div>
          </h2>
          <p
            ref={paragraphRef}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground opacity-0"
          >
            A portfolio of partnerships where design and technology converge to
            create value.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div
            className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2"
            onMouseLeave={handleMouseLeave}
          >
            {/* Left: List of Projects */}
            <ul ref={listRef} className="flex flex-col">
              {projects.map((project, index) => (
                <li
                  key={project.id}
                  className="group relative cursor-pointer border-t border-border last:border-b"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex items-center justify-between p-8">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-headline text-3xl font-medium text-muted-foreground sm:text-4xl">
                        {project.title}
                      </h3>
                    </div>
                    <ArrowUpRight className="h-10 w-10 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:rotate-45" />
                  </div>
                  <div className="progress-bar absolute bottom-0 left-0 h-px w-full bg-border/30">
                    <div className="progress-bar-inner h-full w-full origin-left scale-x-0 bg-primary" />
                  </div>
                </li>
              ))}
            </ul>

            {/* Right: Image Display */}
            <div
              ref={imageContainerRef}
              className="sticky top-24 aspect-video w-full"
            >
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={cn(
                    'project-image absolute inset-0 h-full w-full overflow-hidden rounded-lg opacity-0 shadow-xl'
                  )}
                  onClick={() => handleProjectClick(projects[activeIndex])}
                >
                  <Image
                    src={project.imageUrl}
                    alt={project.description}
                    fill
                    className="cursor-pointer object-cover"
                    data-ai-hint={project.imageHint}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

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
                <DialogTitle className="font-headline text-4xl">
                  {selectedProject.title}
                </DialogTitle>
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
