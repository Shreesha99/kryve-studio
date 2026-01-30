'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { MessageSquareQuote } from 'lucide-react';

const hints = [
  "Psst... the keyboard on the blog page has secrets. Try typing 'elysium'.",
  "A little bird told me that typing 'gsap' or 'nextjs' on the blog keyboard reveals something.",
  "Whispers on the digital wind say 'firebase' is a magic word on the blog page's keyboard.",
  "Unlock a little secret by typing 'tailwind' on the interactive keyboard.",
];

export function EasterEggHint() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentHint, setCurrentHint] = useState('');
    const hintIndexRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const scheduleNextHint = () => {
            // Clear any existing timer
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set a long, random delay for the next hint to appear
            const nextAppearanceDelay = gsap.utils.random(15000, 30000); // 15-30 seconds

            timeoutRef.current = setTimeout(() => {
                // Update hint text
                setCurrentHint(hints[hintIndexRef.current]);
                hintIndexRef.current = (hintIndexRef.current + 1) % hints.length;

                // Animate in
                setIsVisible(true);

                // Set timer to hide the hint after a while
                const visibilityDuration = 7000; // 7 seconds
                timeoutRef.current = setTimeout(() => {
                    setIsVisible(false);
                    // After hiding, schedule the next one
                    scheduleNextHint();
                }, visibilityDuration);

            }, nextAppearanceDelay);
        };

        // Start the cycle
        scheduleNextHint();

        // Cleanup on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                'fixed bottom-6 left-6 z-50 flex items-start gap-3 rounded-lg border bg-card/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-500 ease-out max-w-xs',
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
            )}
            role="status"
            aria-live="polite"
        >
            <MessageSquareQuote className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground">{currentHint}</p>
        </div>
    );
}
