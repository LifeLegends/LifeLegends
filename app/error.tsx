'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

/**
 * Segment-level error boundary. Renders inside the existing root layout
 * (unlike global-error.tsx, which only fires if the root layout itself
 * throws), so it can use normal CSS Modules + design tokens.
 */
export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <span className={styles.eyebrow}>Something went wrong</span>
      <h1 className={styles.title}>This page hit an unexpected error.</h1>
      <p className={styles.desc}>
        Our team preserves every legend carefully — this was just a technical hiccup, not lost content.
      </p>
      <button type="button" className={styles.btn} onClick={reset}>
        Try again
      </button>
    </div>
  );
}
