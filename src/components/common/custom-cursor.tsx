'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const onMouseEnterLink = () => {
      gsap.to(follower, {
        scale: 3,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    const onMouseLeaveLink = () => {
      gsap.to(follower, {
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterLink);
      el.addEventListener('mouseleave', onMouseLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor-dot" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
}
