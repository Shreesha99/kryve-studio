"use client";

import FlowingMenu from "@/components/FlowingMenu";

const projects = [
  {
    text: "Mojave",
    link: "#",
    image: "https://picsum.photos/600/400?random=1",
  },
  {
    text: "Sonoma",
    link: "#",
    image: "https://picsum.photos/600/400?random=2",
  },
  {
    text: "Monterey",
    link: "#",
    image: "https://picsum.photos/600/400?random=3",
  },
  {
    text: "Sequoia",
    link: "#",
    image: "https://picsum.photos/600/400?random=4",
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative w-full bg-background py-32">
      {/* TITLE */}
      <div className="mb-20 text-center">
        <h2 className="font-headline text-4xl sm:text-5xl font-semibold tracking-tight">
          Selected Work
        </h2>
      </div>

      {/* MENU CONTAINER (controls height explicitly) */}
      <div className="relative mx-auto h-[600px] w-full ">
        <FlowingMenu
          items={projects}
          speed={15}
          textColor="#ffffff"
          bgColor="#50C878"
          marqueeBgColor="#ffffff"
          marqueeTextColor="#013220"
          borderColor="#0B6E4F"
        />
      </div>
    </section>
  );
}
