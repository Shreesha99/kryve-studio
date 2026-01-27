'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';

type LenisContextType = Lenis | null;

const LenisContext = createContext<LenisContextType>(null);

export const useLenis = () => {
    return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        const l = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
        });

        lenisRef.current = l;
        setLenis(l);
        
        const update = (time: number) => {
            l.raf(time * 1000);
        }
        
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
            l.destroy();
            lenisRef.current = null;
            setLenis(null);
        };
    }, []);

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    )
}
