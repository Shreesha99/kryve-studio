"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Projects, type ImagePlaceholder } from "@/lib/placeholder-images";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnimateOnScroll } from "../common/animate-on-scroll";

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeProject, setActiveProject] = useState<ImagePlaceholder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const trigger = triggerRef.current;
      if (!track || !trigger) return;

      // Use a timeout to ensure all images are loaded and dimensions are correct
      const timeoutId = setTimeout(() => {
        if (!track || !trigger) return;
        
        const scrollAmount = track.scrollWidth - window.innerWidth;
        
        if (scrollAmount > 0) {
            gsap.to(track, {
                x: -scrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: trigger,
                    start: "top top",
                    end: () => `+=${scrollAmount}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });
        }
      }, 500);

      return () => {
          clearTimeout(timeoutId);
          ScrollTrigger.getAll().forEach(t => t.kill());
      };

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleProjectClick = (project: ImagePlaceholder) => {
    setActiveProject(project);
    setIsDetailOpen(true);
  };

  return (
    <>
      <section id="work" ref={sectionRef} className="relative w-full bg-background">
        <div className="container mx-auto flex h-auto min-h-[20vh] items-center px-4 py-16 md:px-6">
            <AnimateOnScroll>
                <div className="text-left">
                    <h2 className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl">
                    Curated Craft
                    </h2>
                    <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                    A portfolio of partnerships where design and technology converge
                    to create value.
                    </p>
                </div>
            </AnimateOnScroll>
        </div>

        <div ref={triggerRef} className="relative h-screen w-full">
            {/* This div is the sticky container for the animation */}
            <div className="absolute top-0 left-0 flex h-full w-full items-center overflow-hidden">
                <div ref={trackRef} className="flex h-full items-center gap-12 px-[5vw]">
                    {Projects.map((project) => (
                    <div
                        key={project.id}
                        className="group relative h-[75vh] w-[60vw] shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-2xl md:w-[40vw]"
                        onClick={() => handleProjectClick(project)}
                    >
                        <Image
                            src={project.imageUrl}
                            alt={project.title || "Project image"}
                            fill
                            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                            data-ai-hint={project.imageHint}
                            sizes="(min-width: 768px) 40vw, 60vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <h3 className="font-headline text-4xl font-bold text-white opacity-0 drop-shadow-md transition-all duration-300 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0">
                                {project.title}
                            </h3>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl bg-background/90 backdrop-blur-md">
            {activeProject && (
            <div className="space-y-6 text-center">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                    src={activeProject.imageUrl}
                    alt={activeProject.title || 'Project image'}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 720px, 100vw"
                />
                </div>

                <h2 className="font-headline text-4xl font-bold">
                {activeProject.title}
                </h2>

                <p className="text-lg text-muted-foreground">
                {activeProject.description}
                </p>

                {activeProject.testimonial && (
                <blockquote className="border-l-4 border-primary pl-6 text-left">
                    <p className="text-xl italic">
                    "{activeProject.testimonial}"
                    </p>
                    <footer className="mt-2 font-semibold text-primary">
                    — {activeProject.client}
                    </footer>
                </blockquote>
                )}
            </div>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
