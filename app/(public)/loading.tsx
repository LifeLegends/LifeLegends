import styles from './loading.module.css';

/**
 * loading.tsx — shown automatically by Next.js while the homepage's
 * Supabase queries resolve. Mirrors the real section shapes (hero,
 * category grid, featured grid) so there's no layout shift, and gives
 * the user a visible "this is working" signal instead of a blank tab.
 */
export default function HomeLoading() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-label="Loading LifeLegends">
      <div className={styles.heroSkeleton}>
        <div className={styles.heroLine} style={{ width: '30%' }} />
        <div className={styles.heroLine} style={{ width: '55%', height: 48 }} />
        <div className={styles.heroLine} style={{ width: '40%', height: 48 }} />
      </div>
      <div className={styles.container}>
        <div className={styles.grid}>
          {[0, 1, 2, 3].map((i) => <div key={i} className={styles.card} />)}
        </div>
      </div>
    </div>
  );
}
