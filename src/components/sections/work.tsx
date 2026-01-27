'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Projects, type ImagePlaceholder } from '@/lib/placeholder-images';
import { ArrowRight, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const [activeProject, setActiveProject] = useState<ImagePlaceholder | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Refs for the detail view elements
  const detailViewRef = useRef<HTMLDivElement>(null);
  const detailTopPaneRef = useRef<HTMLDivElement>(null);
  const detailBottomPaneRef = useRef<HTMLDivElement>(null);
  const detailContentRef = useRef<HTMLDivElement>(null);
  const detailCloseBtnRef = useRef<HTMLButtonElement>(null);

  const mainTl = useRef<gsap.core.Timeline | null>(null);
  const mainSt = useRef<ScrollTrigger | null>(null);

  // Effect for main pinned scrolling animation
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
          // Fade in the current panel
          mainTl.current!.from(panel, { autoAlpha: 0 });
        }
        if (i < panels.length - 1) {
          // Fade out the current panel to reveal the next
          mainTl.current!.to(panel, { autoAlpha: 0 });
        }
        mainTl.current!.addLabel(`project${i}-end`);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleProjectClick = (project: ImagePlaceholder) => {
    if (isDetailOpen) return;
    setActiveProject(project);
    setIsDetailOpen(true);
  };
  
  const handleCloseClick = () => {
    setIsDetailOpen(false);
  }

  // Effect for opening/closing the detail view
  useEffect(() => {
    // Kill any conflicting tweens before running new ones.
    gsap.killTweensOf([detailViewRef.current, detailContentRef.current]);

    if (isDetailOpen && activeProject) {
      // --- OPEN ANIMATION ---
      mainSt.current?.disable();
      document.body.style.overflow = 'hidden';

      gsap.set(detailViewRef.current, { display: 'block' });
      const imageUrl = activeProject.imageUrl;
      gsap.set(detailTopPaneRef.current, {
        backgroundImage: `url(${imageUrl})`,
      });
      gsap.set(detailBottomPaneRef.current, {
        backgroundImage: `url(${imageUrl})`,
      });

      const openTl = gsap.timeline();

      openTl
        .fromTo(
          [detailTopPaneRef.current, detailBottomPaneRef.current],
          { yPercent: 0 },
          {
            yPercent: (i) => (i === 0 ? -100 : 100),
            duration: 0.8,
            ease: 'power3.inOut',
          }
        )
        .fromTo(
          detailContentRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(
          gsap.utils.toArray('.detail-content-reveal'),
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.3'
        );
    } else if (!isDetailOpen && activeProject) {
      // --- CLOSE ANIMATION ---
      const closeTl = gsap.timeline({
        onComplete: () => {
          gsap.set(detailViewRef.current, { display: 'none' });
          mainSt.current?.enable();
          document.body.style.overflow = '';
          setActiveProject(null);
        },
      });

      closeTl
        .to(gsap.utils.toArray('.detail-content-reveal'), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: 'power2.in',
        })
        .to(detailContentRef.current, { autoAlpha: 0, duration: 0.4 }, '<')
        .to(
          [detailTopPaneRef.current, detailBottomPaneRef.current],
          { yPercent: 0, duration: 0.7, ease: 'power3.inOut' },
          '-=0.2'
        );
    }
  }, [isDetailOpen, activeProject]);

  return (
    <>
      <section
        id="work"
        ref={sectionRef}
        className="relative w-full bg-background"
      >
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
                onClick={() => handleProjectClick(project)}
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
            <div className="relative max-w-2xl space-y-6 text-foreground">
              <button
                ref={detailCloseBtnRef}
                onClick={handleCloseClick}
                className="detail-content-reveal absolute -top-4 -right-4 rounded-full border border-foreground/20 bg-background/50 p-2 text-foreground transition-all hover:scale-110 hover:bg-background"
                aria-label="Close project details"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="detail-content-reveal font-headline text-4xl font-bold">
                {activeProject.title}
              </h2>
              <p className="detail-content-reveal text-lg">
                {activeProject.description}
              </p>
              {activeProject.testimonial && (
                <blockquote className="detail-content-reveal border-l-4 border-primary pl-6">
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
