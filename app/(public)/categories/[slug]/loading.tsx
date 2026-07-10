import styles from './loading.module.css';

export default function CategoryLoading() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-label="Loading category">
      <div className={styles.hero} />
      <div className={styles.grid}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.card} />
        ))}
      </div>
    </div>
  );
}
