'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/types/domain';
import styles from './BioGallery.module.css';

export interface BioGalleryProps {
  images: GalleryImage[];
  legendName: string;
}

/**
 * BioGallery — responsive grid + lightbox. Uses real per-image alt text
 * from the domain model (not a generic "photo N" string). Shows an
 * explicit empty state when a biography has no gallery images yet,
 * rather than rendering a blank section.
 */
export function BioGallery({ images, legendName }: BioGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  function open(i: number) {
    lastFocused.current = document.activeElement as HTMLElement;
    setOpenIndex(i);
  }
  function close() {
    setOpenIndex(null);
    lastFocused.current?.focus();
  }

  useEffect(() => {
    if (openIndex !== null) closeBtnRef.current?.focus();
  }, [openIndex]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, images.length]);

  if (images.length === 0) {
    return (
      <div className={styles.empty}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <p>No archival images have been added for {legendName} yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {images.map((img, i) => (
          <button key={img.url} type="button" className={styles.item} onClick={() => open(i)}>
            <Image src={img.url} alt={img.alt} fill sizes="25vw" style={{ objectFit: 'cover' }} />
            <div className={styles.duotone} />
            <span className={styles.zoom} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={`${legendName} photo viewer`}>
          <button ref={closeBtnRef} type="button" className={styles.lbClose} onClick={close}>Close ✕</button>
          <button
            type="button"
            className={`${styles.lbNav} ${styles.lbPrev}`}
            onClick={() => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))}
            aria-label="Previous image"
          >‹</button>
          <div className={styles.lbImageWrap}>
            <Image src={images[openIndex].url} alt={images[openIndex].alt} fill sizes="80vw" style={{ objectFit: 'contain' }} />
            {images[openIndex].caption && <p className={styles.caption}>{images[openIndex].caption}</p>}
          </div>
          <button
            type="button"
            className={`${styles.lbNav} ${styles.lbNext}`}
            onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))}
            aria-label="Next image"
          >›</button>
        </div>
      )}
    </>
  );
}

export default BioGallery;
