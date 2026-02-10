"use client";

import FlowingMenu from "@/components/FlowingMenu";
import { useRef } from "react";

const projects = [
  {
    text: "Suprabha Electricals",
    link: "https://www.suprabha-electricals.in/",
    image: "/projects/1.jpg",
    status: "live" as const,
  },
  {
    text: "Commerce Platform",
    link: "#",
    image: "https://picsum.photos/600/400?random=2",
    status: "wip" as const,
  },
  {
    text: "SaaS Dashboard",
    link: "#",
    image: "https://picsum.photos/600/400?random=3",
    status: "wip" as const,
  },
  {
    text: "Motion Experiments",
    link: "#",
    image: "https://picsum.photos/600/400?random=4",
    status: "wip" as const,
  },
];

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  return (
    <section id="work" className="relative w-full bg-background py-32">
      {/* TITLE */}
      <div className="mb-20 text-center">
        <h2 className="font-headline text-4xl sm:text-5xl font-semibold tracking-tight">
          Selected Work
        </h2>
      </div>

      {/* MENU CONTAINER */}
      <div
        ref={containerRef}
        className="relative mx-auto h-[600px] w-full overflow-hidden"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchMove={(e) => {
          if (!containerRef.current) return;

          const currentX = e.touches[0].clientX;
          const deltaX = touchStartX.current - currentX;

          containerRef.current.scrollLeft += deltaX;
          touchStartX.current = currentX;
        }}
      >
        <FlowingMenu
          items={projects}
          speed={15}
          textColor="#c6a44a" // gold main text
          bgColor="#0b1f2a" // elysium deep blue
          marqueeBgColor="#7a1e1e" // 🔴 forged crimson
          marqueeTextColor="#c6a44a" // gold on red = premium
          borderColor="#7e6728" // gold shadow
        />
      </div>
    </section>
  );
}
