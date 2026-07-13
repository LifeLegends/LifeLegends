'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import styles from './ImageWithFallback.module.css';

export interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  /** Shown in place of the image if it fails to load (e.g. a broken/removed source URL). */
  fallbackLabel?: string;
}

/**
 * ImageWithFallback — single source of truth for "what happens when an
 * image 404s." Wraps next/image with real onError handling; on failure,
 * renders a quiet gold-on-void placeholder instead of a broken-image icon
 * or empty space, so a bad source URL never looks like a product bug.
 */
export function ImageWithFallback({ fallbackLabel, alt, ...props }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={styles.fallback} role="img" aria-label={typeof alt === 'string' ? alt : 'Image unavailable'}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        {fallbackLabel && <span>{fallbackLabel}</span>}
      </div>
    );
  }

  return <Image alt={alt} {...props} onError={() => setFailed(true)} />;
}

export default ImageWithFallback;
