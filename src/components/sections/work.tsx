"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Projects, type ImagePlaceholder } from "@/lib/placeholder-images";
import { ArrowRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

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
  const mainSt = useRef<ScrollTrigger | undefined>(undefined);
  const scrollYRef = useRef(0);

  // Effect for main pinned scrolling animation
  useEffect(() => {
    const panels = gsap.utils.toArray<HTMLDivElement>(".project-panel");
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
    setActiveProject(project);
    setIsDetailOpen(true);
  };

  const handleCloseClick = () => {
    setIsDetailOpen(false);
    setActiveProject(null);
  };

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
          style={{ marginTop: "-20vh" }}
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
                    alt={project.title || "Project image"}
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
          style={{ backgroundPosition: "center top" }}
        />
        <div
          ref={detailBottomPaneRef}
          className="absolute bottom-0 left-0 h-1/2 w-full bg-cover"
          style={{ backgroundPosition: "center bottom" }}
        />
        <div
          ref={detailContentRef}
          className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 p-8 text-center opacity-0 backdrop-blur-md"
        >
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className="max-w-3xl bg-background/90 backdrop-blur-md">
              {activeProject && (
                <div className="space-y-6 text-center">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={activeProject.imageUrl}
                      alt="{activeProject.title}"
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

                  <DialogClose asChild>
                    <button
                      onClick={handleCloseClick}
                      className="rounded-full border px-6 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      Close
                    </button>
                  </DialogClose>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
