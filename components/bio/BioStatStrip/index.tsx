'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './BioStatStrip.module.css';

export interface BioStat {
  value: number | string;
  label: string;
}

export interface BioStatStripProps {
  stats: BioStat[];
}

/** BioStatStrip — animated counters, only for genuinely numeric stats (never a fake counter on text like "AC"). */
export function BioStatStrip({ stats }: BioStatStripProps) {
  return (
    <div className={styles.strip}>
      {stats.map((stat) => (
        <StatItem key={stat.label} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
}

function StatItem({ value, label }: BioStat) {
  const isNumeric = typeof value === 'number';
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!isNumeric || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const target = value as number;
        const duration = 1200;
        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(Math.round(target * progress));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isNumeric, value]);

  return (
    <div ref={ref} className={styles.item}>
      <div className={styles.num}>{display}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default BioStatStrip;
