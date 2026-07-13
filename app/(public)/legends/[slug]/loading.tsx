import styles from './loading.module.css';

/**
 * loading.tsx — Next.js Suspense boundary shown while the biography
 * page's data fetch resolves. Mirrors the real page's section shapes
 * (hero, overview, timeline, gallery grid, related cards) so there's
 * no layout shift when real content arrives.
 */
export default function BiographyLoading() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-label="Loading biography">
      <div className={styles.heroSkeleton} />

      <div className={styles.container}>
        {/* Overview */}
        <div className={styles.line} style={{ width: '20%' }} />
        <div className={styles.line} style={{ width: '55%', height: 30, marginBottom: 28 }} />
        <div className={styles.line} style={{ width: '90%' }} />
        <div className={styles.line} style={{ width: '80%' }} />
        <div className={styles.line} style={{ width: '70%', marginBottom: 48 }} />

        {/* Timeline */}
        <div className={styles.timelineSkeleton}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.timelineNode} />
          ))}
        </div>

        {/* Gallery */}
        <div className={styles.gallerySkeleton}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.galleryTile} />
          ))}
        </div>

        {/* Related legends */}
        <div className={styles.relatedSkeleton}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.relatedCard} />
          ))}
        </div>
      </div>
    </div>
  );
}
