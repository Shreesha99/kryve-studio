'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { usePreloaderDone } from './app-providers';

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  animationClassName?: string;
  delay?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function AnimateOnScroll({
  children,
  className,
  animationClassName = 'animate-fade-in-up',
  delay = '0s',
  threshold = 0.1,
  triggerOnce = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { preloaderDone } = usePreloaderDone();

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef || !preloaderDone) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(currentRef);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, triggerOnce, preloaderDone]);

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0',
        isVisible && 'opacity-100',
        isVisible && animationClassName,
        className
      )}
      style={{ animationDelay: isVisible ? delay : undefined, animationFillMode: 'forwards' }}
    >
      {children}
    </div>
  );
}
