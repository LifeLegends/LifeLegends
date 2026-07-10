'use client';

import { useEffect, useState } from 'react';

/**
 * Single source of truth for prefers-reduced-motion. Every animation hook
 * in this folder (useScrollReveal, useMagnetic, useParallax, LenisProvider)
 * reads this instead of re-implementing the media query check.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  return reduced;
}
