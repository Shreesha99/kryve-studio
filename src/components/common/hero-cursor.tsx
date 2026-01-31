'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

// Re-creating the icon here to make the component self-contained
function ElysiumIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 1 24 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-auto h-full', className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M25 7H7V13H20V19H7V25H25"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface HeroCursorProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean;
}

export const HeroCursor = forwardRef<HTMLDivElement, HeroCursorProps>(
  ({ isActive, className, ...props }, ref) => {
    const { resolvedTheme } = useTheme();

    return (
      <div
        ref={ref}
        className={cn(
          'pointer-events-none fixed z-[9999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 transition-opacity duration-300',
          isActive && 'opacity-100',
          resolvedTheme === 'dark' ? 'text-white' : 'text-black',
          className
        )}
        {...props}
      >
        <ElysiumIcon />
      </div>
    );
  }
);

HeroCursor.displayName = 'HeroCursor';
