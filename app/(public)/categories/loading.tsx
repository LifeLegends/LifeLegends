import styles from './loading.module.css';

export default function CategoriesLoading() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-label="Loading categories">
      <div className={styles.introSkeleton}>
        <div className={styles.line} style={{ width: '20%' }} />
        <div className={styles.line} style={{ width: '45%', height: 32 }} />
      </div>
      <div className={styles.grid}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <div key={i} className={styles.card} />)}
      </div>
    </div>
  );
}
