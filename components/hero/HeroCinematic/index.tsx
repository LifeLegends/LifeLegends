'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParallax } from '@/lib/motion/useParallax';
import styles from './HeroCinematic.module.css';

/**
 * HeroCinematic — the homepage hero, ported 1:1 from the approved
 * lifelegends-homepage.html hero section. Uses next/image for the
 * portrait (real optimization/responsive srcset instead of a static
 * <img>) and the Phase 1 useParallax hook instead of a hand-rolled
 * mousemove listener.
 */
export function HeroCinematic() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  useParallax(portraitRef, 0.5);
  useParallax(arcRef, 0.9);

  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <span className={styles.eyebrow}>The Stories That Shape Humanity</span>
        <h1 className={styles.headline}>
          <span className={styles.line}>Legends</span>
          <span className={styles.line}>Never Die</span>
        </h1>
        <p className={styles.paragraph}>
          Discover the extraordinary lives of iconic people who changed the world forever — preserved here as a
          living, breathing archive.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/legends" className={styles.ctaGold}>
            <span>Explore Legends</span>
          </Link>
        </div>
      </div>

      <div className={styles.arcWrap}>
        <div ref={arcRef} className={styles.arc} aria-hidden="true" />
      </div>

      <div className={styles.portrait}>
        <div ref={portraitRef} className={styles.frame}>
          <Image
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo%20da%20Vinci%20-%20presumed%20self-portrait%20-%20WGA12798.jpg"
            alt=""
            fill
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjUiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjUiIGZpbGw9IiMwZDBkMTYiLz48L3N2Zz4="
            sizes="(max-width: 900px) 80vw, 38vw"
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          />
          <div className={styles.duotone} />
          <div className={styles.vignette} />
          <div className={styles.rim} />
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.metaIdx}>01</span> / 03
      </div>
      <div className={styles.scrollHint}>
        <span className={styles.scrollLine} />
        Scroll to explore
      </div>
    </section>
  );
}

export default HeroCinematic;
