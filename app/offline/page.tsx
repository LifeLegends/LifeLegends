import styles from '../error.module.css';

/** Shown by the service worker when a navigation request fails while offline. */
export default function OfflinePage() {
  return (
    <div className={styles.wrap}>
      <span className={styles.eyebrow}>You're Offline</span>
      <h1 className={styles.title}>No internet connection.</h1>
      <p className={styles.desc}>
        LifeLegends needs a connection to load new content. Please check your network and try again.
      </p>
    </div>
  );
}
