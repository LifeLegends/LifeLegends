import Link from 'next/link';
import type { Category } from '@/lib/content/seed-categories';
import styles from './CategoryCard.module.css';

export interface CategoryCardProps {
  category: Category;
  count: number;
}

/**
 * CategoryCard — abstract gold/violet art per category (Design Bible §29:
 * illustration, not photography, for conceptual categories). Categories
 * without real content render as disabled "Coming Soon" cards rather than
 * a dead-end click, per the Polish Sprint fix.
 */
export function CategoryCard({ category, count }: CategoryCardProps) {
  const content = (
    <>
      <div className={styles.art} aria-hidden="true">
        <svg viewBox="0 0 160 160" width="60%">
          <circle cx="80" cy="80" r="50" fill="none" stroke="var(--accent-violet)" strokeWidth="1.4" opacity="0.55" />
          <circle cx="80" cy="80" r="30" fill="none" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
      <div className={styles.overlay} />
      {!category.hasContent && <div className={styles.soonBadge}>Coming Soon</div>}
      <div className={styles.label}>
        <div className={styles.name}>{category.name}</div>
        <div className={styles.count}>{category.hasContent ? `${count} ${count === 1 ? 'Biography' : 'Biographies'}` : 'Coming Soon'}</div>
      </div>
    </>
  );

  if (!category.hasContent) {
    return (
      <div className={`${styles.card} ${styles.disabled}`} aria-disabled="true" aria-label={`${category.name} — coming soon`}>
        {content}
      </div>
    );
  }

  return (
    <Link href={`/categories/${category.slug}`} className={styles.card}>
      {content}
    </Link>
  );
}

export default CategoryCard;
