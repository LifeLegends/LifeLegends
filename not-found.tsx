import Link from 'next/link';
import styles from './error.module.css';

/** Global 404 — used whenever notFound() is called (e.g. an invalid legend/category slug). */
export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <span className={styles.eyebrow}>404</span>
      <h1 className={styles.title}>This legend hasn&apos;t been written yet.</h1>
      <p className={styles.desc}>The page you&apos;re looking for doesn&apos;t exist, or hasn&apos;t been published.</p>
      <Link href="/" className={styles.btn}>Return Home</Link>
    </div>
  );
}
