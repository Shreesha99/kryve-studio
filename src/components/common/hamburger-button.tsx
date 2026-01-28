'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className="group relative z-50 h-10 w-10"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="relative h-4 w-6">
          <span
            className={cn(
              'absolute block h-0.5 w-full transform bg-current transition-all duration-300 ease-in-out',
              isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
            )}
          />
          <span
            className={cn(
              'absolute top-1/2 block h-0.5 w-full -translate-y-1/2 transform bg-current transition-opacity duration-200',
              isOpen ? 'opacity-0' : 'opacity-100'
            )}
          />
          <span
            className={cn(
              'absolute block h-0.5 w-full transform bg-current transition-all duration-300 ease-in-out',
              isOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-0'
            )}
          />
        </div>
      </div>
    </Button>
  );
}
