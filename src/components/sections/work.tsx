'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { Projects, type ImagePlaceholder } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const [activeProject, setActiveProject] =
    useState<ImagePlaceholder | null>(null);
  const [detailViewIndex, setDetailViewIndex] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Refs for the detail view elements
  const detailViewRef = useRef<HTMLDivElement>(null);
  const detailTopPaneRef = useRef<HTMLDivElement>(null);
  const detailBottomPaneRef = useRef<HTMLDivElement>(null);
  const detailContentRef = useRef<HTMLDivElement>(null);

  const mainTl = useRef<gsap.core.Timeline | null>(null);
  const mainSt = useRef<ScrollTrigger | null>(null);
  const detailSt = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const panels = gsap.utils.toArray<HTMLDivElement>('.project-panel');

    const ctx = gsap.context(() => {
      mainTl.current = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${panels.length * (window.innerHeight * 0.8)}`,
        },
      });

      mainSt.current = mainTl.current.scrollTrigger;

      panels.forEach((panel, i) => {
        mainTl.current!.addLabel(`project${i}`);
        if (i > 0) {
          mainTl.current!.from(panel, { autoAlpha: 0 });
        }
        if (i < panels.length - 1) {
          mainTl.current!.to(panel, { autoAlpha: 0 });
        }
        mainTl.current!.addLabel(`project${i}-end`);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleProjectClick = (project: ImagePlaceholder, index: number) => {
    if (isDetailOpen) return;
    setActiveProject(project);
    setDetailViewIndex(index);
    setIsDetailOpen(true);
  };

  useEffect(() => {
    if (isDetailOpen && activeProject) {
      mainSt.current?.disable();

      gsap.set(detailViewRef.current, { display: 'block' });
      const imageUrl = activeProject.imageUrl;
      gsap.set(detailTopPaneRef.current, {
        backgroundImage: `url(${imageUrl})`,
      });
      gsap.set(detailBottomPaneRef.current, {
        backgroundImage: `url(${imageUrl})`,
      });

      const openTl = gsap.timeline({
        onComplete: () => {
          // Add a small delay to avoid scroll momentum from instantly closing the overlay
          gsap.delayedCall(0.1, () => {
            detailSt.current = ScrollTrigger.create({
              trigger: 'body',
              start: 'top top-=1', // Close on the slightest scroll down
              once: true,
              onEnter: () => setIsDetailOpen(false),
            });
          });
        },
      });

      openTl
        .fromTo(
          detailTopPaneRef.current,
          { yPercent: 0 },
          { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }
        )
        .fromTo(
          detailBottomPaneRef.current,
          { yPercent: 0 },
          { yPercent: 100, duration: 0.7, ease: 'power3.inOut' },
          '<'
        )
        .fromTo(
          detailContentRef.current,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        );
    } else if (!isDetailOpen && activeProject && detailViewIndex !== null) {
      detailSt.current?.kill();

      const closeTl = gsap.timeline({
        onComplete: () => {
          gsap.set(detailViewRef.current, { display: 'none' });

          if (mainSt.current && detailViewIndex !== null) {
            const nextIndex = (detailViewIndex + 1) % Projects.length;
            const targetScroll = mainSt.current.labelToScroll(`project${nextIndex}`);

            // Scroll to the next project, then re-enable the main scroll trigger
            gsap.to(window, {
              duration: 1,
              scrollTo: targetScroll,
              ease: 'power3.inOut',
              onComplete: () => {
                mainSt.current?.enable();
                // It's good practice to refresh ScrollTrigger after animations and enabling
                ScrollTrigger.refresh();
              },
            });
          } else {
            mainSt.current?.enable();
          }

          setActiveProject(null);
          setDetailViewIndex(null);
        },
      });

      closeTl
        .to(detailContentRef.current, {
          autoAlpha: 0,
          y: 30,
          duration: 0.4,
          ease: 'power2.in',
        })
        .to(
          detailTopPaneRef.current,
          { yPercent: 0, duration: 0.6, ease: 'power3.inOut' },
          '-=0.1'
        )
        .to(
          detailBottomPaneRef.current,
          { yPercent: 0, duration: 0.6, ease: 'power3.inOut' },
          '<'
        );
    }
  }, [isDetailOpen, activeProject, detailViewIndex]);

  return (
    <>
      <section id="work" ref={sectionRef} className="relative w-full bg-background">
        <div
          ref={titleContainerRef}
          className="container mx-auto flex h-[20vh] items-center px-4 md:px-6"
        >
          <div className="text-left">
            <h2
              ref={titleRef}
              className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              Curated Craft
            </h2>
            <p
              ref={paragraphRef}
              className="mt-4 max-w-2xl text-lg text-muted-foreground"
            >
              A portfolio of partnerships where design and technology converge
              to create value.
            </p>
          </div>
        </div>

        <div
          ref={triggerRef}
          className="relative h-screen w-full"
          style={{ marginTop: '-20vh' }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {Projects.map((project, i) => (
              <div
                key={project.id}
                className="project-panel absolute inset-0 h-full w-full"
                onClick={() => handleProjectClick(project, i)}
              >
                <div className="group relative h-full w-full cursor-pointer">
                  <Image
                    src={project.imageUrl}
                    alt={project.title || 'Project image'}
                    fill
                    className="object-cover"
                    data-ai-hint={project.imageHint}
                    priority={i === 0}
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex items-center gap-4">
                      <h3 className="font-headline text-5xl font-bold text-white sm:text-6xl md:text-7xl">
                        {project.title}
                      </h3>
                      <ArrowRight className="h-10 w-10 text-white transition-transform duration-300 ease-in-out group-hover:rotate-45" />
                      <div className="absolute -bottom-2 left-0 h-1 w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail View */}
      <div
        ref={detailViewRef}
        className="fixed inset-0 z-[60] hidden overflow-hidden"
      >
        <div
          ref={detailTopPaneRef}
          className="absolute top-0 left-0 h-1/2 w-full bg-cover"
          style={{ backgroundPosition: 'center top' }}
        />
        <div
          ref={detailBottomPaneRef}
          className="absolute bottom-0 left-0 h-1/2 w-full bg-cover"
          style={{ backgroundPosition: 'center bottom' }}
        />
        <div
          ref={detailContentRef}
          className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 p-8 text-center opacity-0 backdrop-blur-md"
        >
          {activeProject && (
            <div className="max-w-2xl space-y-6 text-foreground">
              <h2 className="font-headline text-4xl font-bold">
                {activeProject.title}
              </h2>
              <p className="text-lg">{activeProject.description}</p>
              {activeProject.testimonial && (
                 <blockquote className="border-l-4 border-primary pl-6">
                 <p className="text-xl italic">
                   "{activeProject.testimonial}"
                 </p>
                 <footer className="mt-2 text-base font-semibold text-primary">
                   — {activeProject.client}
                 </footer>
               </blockquote>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
