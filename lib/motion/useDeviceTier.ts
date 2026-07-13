'use client';

import { useEffect, useState } from 'react';

export type DeviceTier = 'low' | 'mid' | 'high';

/** Minimal, properly-typed shape of the non-standard Network Information API. */
interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformationLike;
}

/**
 * Cheap, one-time heuristic used to scale down ambient particles / blur
 * effects on low-end devices (SDD §5, "Adaptive quality"). Not a perfect
 * benchmark — just enough signal to avoid tanking frame rate on old phones.
 *
 * Signals used:
 *  - navigator.hardwareConcurrency (logical cores)
 *  - navigator.connection.saveData / effectiveType, if available
 *  - a single requestAnimationFrame timing sample as a coarse frame-time probe
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('high');

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const connection = (navigator as NavigatorWithConnection).connection;

    let score = 0;
    if (cores <= 2) score -= 2;
    else if (cores <= 4) score -= 1;

    if (connection?.saveData) score -= 2;
    if (connection?.effectiveType && /2g|3g/.test(connection.effectiveType)) score -= 1;

    const frameStart = performance.now();
    requestAnimationFrame(() => {
      const frameTime = performance.now() - frameStart;
      if (frameTime > 32) score -= 2; // sub-30fps first frame — treat as weak GPU
      const resolved: DeviceTier = score <= -3 ? 'low' : score <= -1 ? 'mid' : 'high';
      setTier(resolved);
    });
  }, []);

  return tier;
}

