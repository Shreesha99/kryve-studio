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
      const travel = window.innerHeight;
      const isTouch = ScrollTrigger.isTouch === 1;

      // 🔧 IMPORTANT FIX:
      // All cards start below, NO special-casing first card
      gsap.set(cards, {
        y: travel,
        scale: 0.96,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${(cards.length - 1) * 100}%`,
          pin: true,
          scrub: isTouch ? 1.4 : 1,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
          ...(isTouch
            ? {}
            : {
                snap: {
                  snapTo: 1 / (cards.length - 1),
                  duration: 0.25,
                  ease: "power2.out",
                },
              }),
        },
      });

      tl.to(cards[0], {
        y: 0,
        scale: 1,
        duration: 0,
        immediateRender: true,
      });

      cards.forEach((card, i) => {
        if (i === 0) return;

        // Incoming card
        tl.to(card, {
          y: 0,
          scale: 1,
          ease: "power2.out",
          duration: 1,
        });

        // Previous cards recede smoothly
        for (let j = 0; j < i; j++) {
          tl.to(
            cards[j],
            {
              y: -40 - j * 20,
              scale: 0.96 - j * 0.04,
              ease: "none",
              duration: 1,
            },
            "<"
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className="relative h-screen bg-background"
      >
        {/* Stacked stage */}
        <div className="relative flex h-screen items-center justify-center overflow-hidden pt-20 md:pt-24 lg:pt-24 touch-pan-y">
          {Projects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="
                absolute inset-0 mx-auto flex
                w-[94vw] sm:w-[92vw] lg:w-[90vw]
                max-w-7xl
                cursor-pointer
                items-center justify-center
              "
              onClick={() => {
                setActiveProject(project);
                setOpen(true);
              }}
            >
              <div
                className="
                  relative w-full
                  aspect-[4/5] sm:aspect-[16/9]
                  min-h-[70vh] sm:min-h-0
                  overflow-hidden
                  rounded-2xl md:rounded-3xl
                  shadow-[0_40px_120px_-25px_rgba(0,0,0,0.6)]
                "
              >
                <Image
                  src={project.imageUrl}
                  alt={project.title ?? "Project"}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 1100px, 94vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

                {/* Title */}
                <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                  <h3 className="font-headline text-3xl sm:text-4xl font-semibold text-white">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="mt-2 max-w-md text-sm text-white/70">
                      {project.subtitle}
                    </p>
                  )}
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

              <p className="text-lg text-muted-foreground">
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
