'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from './gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * Pointer-follow "magnetic" effect for CTAs (SDD §5). Auto-disabled on
 * touch devices (no `pointer: fine`) and under prefers-reduced-motion.
 *
 * @param strength 0–1, how far the element travels toward the pointer.
 */
export function useMagnetic(ref: RefObject<HTMLElement>, strength = 0.3) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    function handleMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.4,
        ease: 'expo.out',
      });
    }

    function handleLeave() {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'expo.out' });
    }

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerleave', handleLeave);

    return () => {
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerleave', handleLeave);
    };
  }, [ref, strength, prefersReducedMotion]);
}
