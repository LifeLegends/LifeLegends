/**
 * Central GSAP setup. Imported once (from MotionProvider) so plugins are
 * registered exactly one time for the whole app. Components never import
 * 'gsap' directly — they import `gsap` and `ScrollTrigger` from here so
 * registration order is always guaranteed.
 */
'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerGsap() {
  if (registered) return;
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Default easing/duration align with design tokens (§3.5 of the SDD).
  gsap.defaults({
    ease: 'expo.out',
    duration: 0.4,
  });

  registered = true;
}

export { gsap, ScrollTrigger };
