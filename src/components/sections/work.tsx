"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Projects, type ImagePlaceholder } from "@/lib/placeholder-images";
import { Dialog, DialogContent } from "@/components/ui/dialog";

gsap.registerPlugin(ScrollTrigger);

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const [activeProject, setActiveProject] = useState<ImagePlaceholder | null>(
    null
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;

      gsap.set(cards, {
        opacity: 0,
        scale: 0.85,
        y: 120,
      });

      cards.forEach((card, i) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              start: "top center+=100",
              end: "bottom center",
              scrub: true,
            },
          })
          .to(card, {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "power3.out",
          })
          .to(
            card,
            {
              opacity: 0.2,
              scale: 0.9,
              y: -120,
              ease: "power3.in",
            },
            "+=0.2"
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className="relative min-h-screen bg-background py-32"
      >
        {/* Header */}
        <div className="container mx-auto mb-32 px-4">
          <h2 className="font-headline text-5xl font-semibold tracking-tight">
            Curated Craft
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Selected partnerships where design, motion, and engineering collide.
          </p>
        </div>

        {/* Projects */}
        <div className="relative flex flex-col gap-[30vh]">
          {Projects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="relative mx-auto w-[90vw] max-w-6xl cursor-pointer"
              onClick={() => {
                setActiveProject(project);
                setOpen(true);
              }}
            >
              <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)]">
                <Image
                  src={project.imageUrl}
                  alt={project.title ?? "Project"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 960px, 90vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Title */}
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="font-headline text-4xl font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-white/70">
                    {project.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl overflow-hidden bg-background/95 backdrop-blur-xl">
          {activeProject && (
            <div className="space-y-6">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={activeProject.imageUrl}
                  alt={activeProject.title ?? ""}
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="font-headline text-4xl font-bold">
                {activeProject.title}
              </h2>

              <p className="text-muted-foreground text-lg">
                {activeProject.description}
              </p>

              {activeProject.testimonial && (
                <blockquote className="border-l-4 border-primary pl-6 italic">
                  “{activeProject.testimonial}”
                  <footer className="mt-2 font-semibold">
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
