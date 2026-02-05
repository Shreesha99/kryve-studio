"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import "./FlowingMenu.css";

/* ---------------- TYPES ---------------- */

type Item = {
  link: string;
  text: string;
  image: string;
};

type FlowingMenuProps = {
  items: Item[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
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
  return (
    <div className="menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
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
};

function MenuItem({
  link,
  text,
  image,
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

  const animationDefaults = { duration: 0.6, ease: "expo.out" };

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

    animationRef.current = gsap.to(marqueeInnerRef.current, {
      x: -part.offsetWidth,
      duration: speed,
      ease: "none",
      repeat: -1,
    });

    return () => {
      animationRef.current?.kill();
      animationRef.current = null;
    };
  }, [repetitions, speed]);

  /* ---------------- DESKTOP HOVER ---------------- */

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

  /* ---------------- MOBILE TOUCH = HOVER ---------------- */

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
    <div ref={itemRef} className="menu__item" style={{ borderColor }}>
      <a
        href={link}
        className="menu__item-link"
        style={{ color: textColor }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {text}
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
