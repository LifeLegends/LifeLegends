'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import type { TimelineEvent } from '@/lib/types/domain';
import styles from './BioTimeline.module.css';

export interface BioTimelineProps {
  events: TimelineEvent[];
}

/**
 * BioTimeline — vertical, scroll-scrubbed timeline. Ported from the
 * approved prototype's `.timeline-vert` behavior, now driven by the
 * shared gsap/ScrollTrigger singleton from lib/motion instead of a
 * page-local <script> block.
 */
export function BioTimeline({ events }: BioTimelineProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!wrapRef.current || !fillRef.current || events.length === 0) return;
    registerGsap();

    if (prefersReducedMotion) {
      gsap.set(fillRef.current, { height: '100%' });
      eventRefs.current.forEach((el) => el?.classList.add(styles.inView));
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(fillRef.current, {
        height: '100%',
        ease: 'none',
        scrollTrigger: { trigger: wrapRef.current, start: 'top 70%', end: 'bottom 70%', scrub: true },
      });

      eventRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } },
        );
        ScrollTrigger.create({
          trigger: el,
          start: 'top 65%',
          end: 'bottom 65%',
          onEnter: () => el.classList.add(styles.inView),
          onLeaveBack: () => el.classList.remove(styles.inView),
        });
      });
    }, wrapRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={wrapRef} className={styles.wrap}>
      {events.length === 0 ? (
        <p className={styles.empty}>No timeline has been documented for this legend yet.</p>
      ) : (
        <>
          <div ref={fillRef} className={styles.fill} />
          {events.map((event, i) => (
            <div
              key={event.year}
              ref={(el) => { eventRefs.current[i] = el; }}
              className={styles.event}
            >
              <div className={styles.node} />
              <div className={styles.year}>{event.year}</div>
              <h4 className={styles.title}>{event.title}</h4>
              <p className={styles.desc}>{event.description}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default BioTimeline;
