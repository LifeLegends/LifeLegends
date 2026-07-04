/**
 * Creates a single Lenis instance at the app root and exposes it via
 * context so any component can call `useLenis().scrollTo(...)` — used by
 * BioTimelineNav, footer anchor links, and the "scroll to explore" hint.
 *
 * Also ticks GSAP's ScrollTrigger on every Lenis frame so the two stay in
 * sync (a common footgun when combining Lenis + ScrollTrigger).
 */
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, registerGsap } from './gsap';
import { useReducedMotion } from './useReducedMotion';

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafId = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();

    // Respect prefers-reduced-motion: skip Lenis entirely and let the
    // browser's native (instant) scroll take over.
    if (prefersReducedMotion) {
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    instance.on('scroll', ScrollTrigger.update);

    function raf(time: number) {
      instance.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }
    rafId.current = requestAnimationFrame(raf);

    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      instance.destroy();
    };
  }, [prefersReducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
