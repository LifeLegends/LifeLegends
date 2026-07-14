/**
 * Framer Motion variants for route-level page transitions, consumed by
 * components/layout/PageTransition. GSAP/Lenis own scroll-driven and
 * pointer-driven motion; Framer Motion owns declarative enter/exit
 * transitions for whole route segments (simpler to coordinate with
 * React's mount/unmount lifecycle via AnimatePresence).
 */
import type { Variants } from 'framer-motion';

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] },
  },
};
