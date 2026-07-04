'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from './gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * Mouse-parallax for layered hero art (portrait / light-arc / particles —
 * reference panels 1 & 3). Each layer passes a different `depth` so they
 * drift at different rates, producing the "floating layers" effect.
 *
 * @param depth 0–1, higher = moves more.
 */
export function useParallax(ref: RefObject<HTMLElement>, depth = 0.2) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    function handleMove(event: MouseEvent) {
      const { innerWidth, innerHeight } = window;
      const relX = (event.clientX / innerWidth - 0.5) * 2;
      const relY = (event.clientY / innerHeight - 0.5) * 2;

      gsap.to(el, {
        x: relX * 30 * depth,
        y: relY * 30 * depth,
        duration: 0.6,
        ease: 'expo.out',
      });
    }

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [ref, depth, prefersReducedMotion]);
}
