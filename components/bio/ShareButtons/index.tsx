'use client';

import { useState } from 'react';
import styles from './ShareButtons.module.css';

export interface ShareButtonsProps {
  title: string;
}

/** ShareButtons — copies the current page URL to clipboard with explicit success/error feedback. */
export function ShareButtons({ title }: ShareButtonsProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 1800);
  }

  return (
    <button type="button" className={styles.btn} onClick={handleShare} aria-label={`Share ${title}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
      </svg>
      {status === 'copied' && <span className={styles.tooltip}>Link copied!</span>}
      {status === 'error' && <span className={styles.tooltip}>Couldn't copy link</span>}
    </button>
  );
}

export default ShareButtons;
