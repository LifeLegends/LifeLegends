import { ImageWithFallback } from '@/components/system/ImageWithFallback';
import Link from 'next/link';
import type { Legend } from '@/lib/content/seed-legends';
import styles from './BioHero.module.css';

export interface BioHeroProps {
  legend: Legend;
  readTimeMinutes: number;
}

/**
 * BioHero — full-width cinematic hero for a biography page. Ported from
 * the approved lifelegends-biography.html `.bio-hero` markup.
 */
export function BioHero({ legend, readTimeMinutes }: BioHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <ImageWithFallback
          src={legend.heroImage}
          alt={legend.heroImageAlt}
          fallbackLabel={legend.name}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
        />
        <div className={styles.duotone} />
        <div className={styles.scrim} />
      </div>

      <div className={styles.content}>
        <div className={styles.roleTags}>
          {legend.roles.map((role) => (
            <span key={role} className={styles.roleTag}>{role}</span>
          ))}
        </div>
        <h1 className={styles.name}>{legend.name}</h1>
        <div className={styles.metaRow}>
          <span>{legend.birthYear} – {legend.deathYear}</span>
          <span className={styles.dot} />
          <span>{legend.nationality}</span>
          <span className={styles.dot} />
          <span>{legend.profession}</span>
        </div>
        <p className={styles.tagline}>{legend.tagline}</p>
        <p className={styles.intro}>{legend.intro}</p>
        <div className={styles.ctaRow}>
          <a href="#overview" className={styles.ctaGold}><span>Read Full Story</span></a>
          <a href="#gallery" className={styles.ctaOutline}>View Gallery</a>
        </div>
      </div>

      <div className={styles.readMeta}>
        <div>{readTimeMinutes} min read</div>
      </div>
    </section>
  );
}

export default BioHero;
