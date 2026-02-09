"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import "./FlowingMenu.css";

/* ---------------- TYPES ---------------- */

type Item = {
  link: string;
  text: string;
  image: string;
  status?: "live" | "wip";
};

type FlowingMenuProps = {
  items: Item[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  disableRepeat?: boolean; // 👈 NEW
};

/* ---------------- ROOT ---------------- */

export default function FlowingMenu({
  items,
  speed = 15,
  textColor = "#ffffff",
  bgColor = "#060010",
  marqueeBgColor = "#ffffff",
  marqueeTextColor = "#060010",
  borderColor = "#ffffff",
}: FlowingMenuProps) {
  const hintRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- MOBILE HINT ---------------- */

  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    if (!isTouch || !hintRef.current) return;

    gsap.fromTo(
      hintRef.current,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.6,
      }
    );

    gsap.to(hintRef.current, {
      opacity: 0,
      y: -6,
      duration: 0.6,
      ease: "power2.in",
      delay: 3,
    });
  }, []);

  return (
    <div className="menu-wrap relative" style={{ backgroundColor: bgColor }}>
      {/* MOBILE HINT */}
      <div
        ref={hintRef}
        className="
          pointer-events-none
          absolute bottom-6 left-1/2 -translate-x-1/2
          rounded-full
          bg-black/60
          px-4 py-2
          text-xs font-medium
          text-white/80
          backdrop-blur-md
          sm:hidden
        "
      >
        Tap & hold on a project
      </div>

      <nav className="menu">
        {items.map((item, index) => (
          <MenuItem
            key={index}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  );
}

/* ---------------- ITEM ---------------- */

type MenuItemProps = Item & {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  disableRepeat?: boolean;
};

function MenuItem({
  link,
  text,
  image,
  status,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
}: MenuItemProps) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const marqueeInnerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.5, ease: "power3.out" };

  /* ---------------- HELPERS ---------------- */

  const dist = (x1: number, y1: number, x2: number, y2: number) =>
    (x1 - x2) ** 2 + (y1 - y2) ** 2;

  const closestEdge = (x: number, y: number, w: number, h: number) => {
    const top = dist(x, y, w / 2, 0);
    const bottom = dist(x, y, w / 2, h);
    return top < bottom ? "top" : "bottom";
  };

  const triggerMarquee = (edge: "top" | "bottom") => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return;

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .set(marqueeInnerRef.current, {
        y: edge === "top" ? "101%" : "-101%",
      })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" });
  };

  const leaveMarquee = (edge: "top" | "bottom") => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return;

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .to(marqueeInnerRef.current, {
        y: edge === "top" ? "101%" : "-101%",
      });
  };

  /* ---------------- CALCULATE REPS ---------------- */

  useEffect(() => {
    if (!marqueeInnerRef.current) return;

    const content =
      marqueeInnerRef.current.querySelector<HTMLElement>(".marquee__part");
    if (!content) return;

    const needed = Math.ceil(window.innerWidth / content.offsetWidth) + 2;
    setRepetitions(Math.max(4, needed));
  }, [text, image]);

  /* ---------------- MARQUEE LOOP ---------------- */

  useEffect(() => {
    if (!marqueeInnerRef.current) return;

    const part =
      marqueeInnerRef.current.querySelector<HTMLElement>(".marquee__part");
    if (!part) return;

    animationRef.current?.kill();

    const raf = requestAnimationFrame(() => {
      animationRef.current = gsap.to(marqueeInnerRef.current!, {
        x: -part.offsetWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      animationRef.current?.kill();
      animationRef.current = null;
    };
  }, [repetitions, speed]);

  /* ---------------- DESKTOP + MOBILE ---------------- */

  const onEnter = (e: React.MouseEvent) => {
    if (!itemRef.current) return;

    const r = itemRef.current.getBoundingClientRect();
    const edge = closestEdge(
      e.clientX - r.left,
      e.clientY - r.top,
      r.width,
      r.height
    );

    triggerMarquee(edge);
  };

  const onLeave = (e: React.MouseEvent) => {
    if (!itemRef.current) return;

    const r = itemRef.current.getBoundingClientRect();
    const edge = closestEdge(
      e.clientX - r.left,
      e.clientY - r.top,
      r.width,
      r.height
    );

    leaveMarquee(edge);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!itemRef.current) return;

    const r = itemRef.current.getBoundingClientRect();
    const touch = e.touches[0];

    const edge = closestEdge(
      touch.clientX - r.left,
      touch.clientY - r.top,
      r.width,
      r.height
    );

    triggerMarquee(edge);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!itemRef.current) return;

    const r = itemRef.current.getBoundingClientRect();
    const touch = e.changedTouches[0];

    const edge = closestEdge(
      touch.clientX - r.left,
      touch.clientY - r.top,
      r.width,
      r.height
    );

    leaveMarquee(edge);
  };

  /* ---------------- JSX ---------------- */

  return (
    <div ref={itemRef} className="menu__item relative" style={{ borderColor }}>
      {/* STATUS BADGE */}
      {status && (
        <div
          className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-semibold ${
            status === "live"
              ? "bg-green-500 text-black animate-pulse"
              : "bg-yellow-400 text-black"
          }`}
        >
          {status === "live" ? "LIVE" : "IN PROGRESS"}
        </div>
      )}

      <a
        href={status === "wip" ? undefined : link}
        target={status === "live" ? "_blank" : undefined}
        rel={status === "live" ? "noopener noreferrer" : undefined}
        className={`menu__item-link ${
          status === "wip" ? "cursor-not-allowed" : ""
        }`}
        style={{ color: textColor }}
        onMouseEnter={status === "wip" ? undefined : onEnter}
        onMouseLeave={status === "wip" ? undefined : onLeave}
        onTouchStart={status === "wip" ? undefined : onTouchStart}
        onTouchEnd={status === "wip" ? undefined : onTouchEnd}
        onTouchCancel={status === "wip" ? undefined : onTouchEnd}
      >
        {text}
        {/* {status === "wip" && (
          <span className="ml-2 text-xs opacity-70">(WIP)</span>
        )} */}
      </a>

      <div
        ref={marqueeRef}
        className="marquee"
        style={{ backgroundColor: marqueeBgColor }}
      >
        <div className="marquee__inner-wrap">
          <div ref={marqueeInnerRef} className="marquee__inner">
            {Array.from({ length: repetitions }).map((_, i) => (
              <div
                key={i}
                className="marquee__part"
                style={{ color: marqueeTextColor }}
              >
                <span>{text}</span>
                <div
                  className="marquee__img"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
