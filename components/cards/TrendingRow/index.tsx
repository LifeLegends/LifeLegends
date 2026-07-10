import Link from 'next/link';
import type { Legend } from '@/lib/content/seed-legends';
import styles from './TrendingRow.module.css';

export interface TrendingRowProps {
  legends: Pick<Legend, 'slug' | 'name' | 'viewCount'>[];
}

/**
 * TrendingRow — horizontal-scroll ranked list, distinct in rhythm from
 * CardGrid (Design Bible: Trending should read differently from Featured,
 * not as a duplicate section). Single source of truth for this pattern —
 * do not reimplement inline in a page again.
 */
export function TrendingRow({ legends }: TrendingRowProps) {
  return (
    <div className={styles.row}>
      {legends.map((legend, i) => (
        <Link key={legend.slug} href={`/legends/${legend.slug}`} className={styles.card}>
          <span className={styles.rank}>{String(i + 1).padStart(2, '0')}</span>
          <div className={styles.info}>
            <div className={styles.name}>{legend.name}</div>
            <div className={styles.views}>{legend.viewCount.toLocaleString()} views</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default TrendingRow;
