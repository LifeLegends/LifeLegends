'use client';

import { useEffect, useState } from 'react';
import styles from './ReadingProgressBar.module.css';

/** ReadingProgressBar — thin gold bar at the top of the viewport tracking scroll position. */
export function ReadingProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      setPct(scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div className={styles.bar} style={{ width: `${pct}%` }} aria-hidden="true" />;
}

export default ReadingProgressBar;
