'use client';

import { useEffect, type RefObject } from 'react';
import { gsap, registerGsap } from './gsap';
import { useReducedMotion } from './useReducedMotion';

export type RevealVariant = 'fade-up' | 'fade-scale' | 'clip-reveal' | 'stagger-children';

/**
 * Central scroll-reveal hook. Every section on Home/Bio should use this
 * instead of hand-rolled ScrollTrigger calls, so easing/duration/threshold
 * stay consistent app-wide (SDD §5).
 *
 * `variant="stagger-children"` animates the direct children of the ref'd
 * element with a staggered offset, rather than the element itself.
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement>,
  variant: RevealVariant = 'fade-up',
) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;

    registerGsap();

    if (prefersReducedMotion) {
      gsap.set(ref.current, { opacity: 1, y: 0, scale: 1, clipPath: 'none' });
      return;
    }

    const el = ref.current;
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      };

      switch (variant) {
        case 'fade-up':
          gsap.from(el, { opacity: 0, y: 40, duration: 0.8, ease: 'expo.out', scrollTrigger: trigger });
          break;
        case 'fade-scale':
          gsap.from(el, { opacity: 0, scale: 0.94, duration: 0.8, ease: 'expo.out', scrollTrigger: trigger });
          break;
        case 'clip-reveal':
          gsap.from(el, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 1.0,
            ease: 'expo.out',
            scrollTrigger: trigger,
          });
          break;
        case 'stagger-children':
          gsap.from(el.children, {
            opacity: 0,
            y: 24,
            duration: 0.6,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: trigger,
          });
          break;
      }
    }, el);

    return () => ctx.revert();
  }, [ref, variant, prefersReducedMotion]);
}
