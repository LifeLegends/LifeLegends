import Link from 'next/link';
import { ImageWithFallback } from '@/components/system/ImageWithFallback';
import type { Legend } from '@/lib/content/seed-legends';
import styles from './LegendCard.module.css';

export interface LegendCardProps {
  legend: Pick<Legend, 'slug' | 'name' | 'profession' | 'thumbnail'>;
  categoryLabel: string;
}

/**
 * LegendCard — the single card anatomy used for Featured Legends, Related
 * Legends, and category results (Design Bible §19: "all cards share one
 * anatomy"). Server Component; hover state is pure CSS, no JS needed.
 */
export function LegendCard({ legend, categoryLabel }: LegendCardProps) {
  return (
    <Link href={`/legends/${legend.slug}`} className={styles.card}>
      <span className={styles.chip}>{categoryLabel}</span>
      <div className={styles.portrait}>
        <ImageWithFallback
          src={legend.thumbnail}
          alt={`${legend.name}, ${legend.profession}`}
          fallbackLabel={legend.name}
          fill
          sizes="(max-width: 900px) 45vw, 22vw"
          style={{ objectFit: 'cover', objectPosition: 'center 18%' }}
        />
      </div>
      <div className={styles.duotone} />
      <div className={styles.overlay} />
      <div className={styles.info}>
        <div className={styles.name}>{legend.name}</div>
        <div className={styles.role}>{legend.profession}</div>
      </div>
      <div className={styles.arrow} aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 17L17 7M17 7H8M17 7V16" />
        </svg>
      </div>
    </Link>
  );
}

export default LegendCard;
