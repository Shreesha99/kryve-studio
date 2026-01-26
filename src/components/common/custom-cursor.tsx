'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      gsap.set(cursor, { autoAlpha: 0 });
      return;
    }

    gsap.set(cursor, { xPercent: -5, yPercent: 0 });

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    const onMouseDown = () => {
      gsap.to(cursor, { scale: 0.9, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.1 });
    };

    const onMouseEnterLink = () => {
      gsap.to(cursor, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    const onMouseLeaveLink = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterLink);
      el.addEventListener('mouseleave', onMouseLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        style={{ transform: 'rotate(-15deg)' }}
      >
        <path
          d="M 5 2 L 22 22 L 16 18 L 10 22 Z"
          className="custom-cursor-path"
        />
      </svg>
    </div>
  );
}
