'use client';

import { useMemo, useState } from 'react';
import { LegendCard } from '@/components/cards/LegendCard';
import { CardGrid } from '@/components/cards/CardGrid';
import type { Legend } from '@/lib/content/seed-legends';
import type { Category } from '@/lib/types/domain';
import styles from './CategoryDiscovery.module.css';

export interface CategoryDiscoveryProps {
  legends: Legend[];
  categories: Category[];
  /** False when this category has no published biographies at all yet (distinct from a filter producing zero results). */
  categoryHasContent: boolean;
}

type SortOption = 'popularity' | 'alpha' | 'recent' | 'reading';

/**
 * CategoryDiscovery — client-side filter/sort panel + result grid.
 * Filtering happens client-side against the (small, already-fetched)
 * category's legend list; if the catalog grows large, this becomes a
 * server-side filtered query instead — the UI/props shape wouldn't change.
 */
export function CategoryDiscovery({ legends, categories, categoryHasContent }: CategoryDiscoveryProps) {
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [professionFilter, setProfessionFilter] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);

  const professions = useMemo(() => Array.from(new Set(legends.map((l) => l.profession))), [legends]);
  const countries = useMemo(() => Array.from(new Set(legends.map((l) => l.nationality))), [legends]);

  const filtered = useMemo(() => {
    let result = legends.filter(
      (l) =>
        (professionFilter.length === 0 || professionFilter.includes(l.profession)) &&
        (countryFilter.length === 0 || countryFilter.includes(l.nationality)),
    );
    if (sortBy === 'alpha') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'recent') result = [...result].sort((a, b) => b.birthYear - a.birthYear);
    else if (sortBy === 'reading') result = [...result].sort((a, b) => a.name.length - b.name.length);
    else result = [...result].sort((a, b) => b.viewCount - a.viewCount);
    return result;
  }, [legends, professionFilter, countryFilter, sortBy]);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  if (!categoryHasContent) {
    return (
      <div className={styles.comingSoon}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
        <p>This category is still being written. Check back soon — new legends are added regularly.</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.filterPanel}>
        <div className={styles.filterGroup}>
          <h4>Sort By</h4>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className={styles.select}>
            <option value="popularity">Popularity</option>
            <option value="alpha">Alphabetical</option>
            <option value="recent">Recently Added</option>
            <option value="reading">Reading Time</option>
          </select>
        </div>

        {professions.length > 0 && (
          <div className={styles.filterGroup}>
            <h4>Profession</h4>
            {professions.map((p) => (
              <label key={p} className={styles.option}>
                <input type="checkbox" checked={professionFilter.includes(p)} onChange={() => toggle(professionFilter, p, setProfessionFilter)} />
                {p}
              </label>
            ))}
          </div>
        )}

        {countries.length > 0 && (
          <div className={styles.filterGroup}>
            <h4>Country</h4>
            {countries.map((c) => (
              <label key={c} className={styles.option}>
                <input type="checkbox" checked={countryFilter.includes(c)} onChange={() => toggle(countryFilter, c, setCountryFilter)} />
                {c}
              </label>
            ))}
          </div>
        )}
      </aside>

      <div>
        <div className={styles.toolbar}>
          <div className={styles.count}>{filtered.length} legend{filtered.length !== 1 ? 's' : ''} found</div>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>No legends match these filters yet.</p>
          </div>
        ) : (
          <CardGrid columns={3}>
            {filtered.map((legend) => (
              <LegendCard
                key={legend.slug}
                legend={legend}
                categoryLabel={categories.find((c) => c.slug === legend.categorySlug)?.name ?? ''}
              />
            ))}
          </CardGrid>
        )}
      </div>
    </div>
  );
}

export default CategoryDiscovery;
