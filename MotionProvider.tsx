'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { LenisProvider } from '@/lib/motion/LenisProvider';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { useDeviceTier, type DeviceTier } from '@/lib/motion/useDeviceTier';

interface MotionContextValue {
  prefersReducedMotion: boolean;
  deviceTier: DeviceTier;
}

const MotionContext = createContext<MotionContextValue>({
  prefersReducedMotion: false,
  deviceTier: 'high',
});

export function useMotionSettings() {
  return useContext(MotionContext);
}

/**
 * Wraps the app once at the root layout. Any component can call
 * `useMotionSettings()` to read the resolved reduced-motion + device-tier
 * state instead of re-deriving it — see SDD §5.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const deviceTier = useDeviceTier();

  return (
    <MotionContext.Provider value={{ prefersReducedMotion, deviceTier }}>
      <LenisProvider>{children}</LenisProvider>
    </MotionContext.Provider>
  );
}
