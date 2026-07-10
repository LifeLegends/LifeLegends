'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchOverlay } from '@/lib/providers/SearchProvider';
import styles from './SearchOverlay.module.css';

interface SearchResult {
  slug: string;
  name: string;
  profession: string;
  thumbnail: string;
  nationality: string;
}

const POPULAR_SEARCHES = ['Albert Einstein', 'Marie Curie', 'Nikola Tesla', 'Leonardo da Vinci'];
const RECENT_SEARCHES_KEY_LIMIT = 4;

/**
 * SearchOverlay — full-screen search, mounted once in the root layout.
 * Real debounced fetch to /api/search with genuine loading/empty states
 * (not simulated with setTimeout against a hardcoded array).
 */
export function SearchOverlay() {
  const { isOpen, close } = useSearchOverlay();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
    else {
      setQuery('');
      setResults(null);
      setStatus('idle');
    }
  }, [isOpen]);

  function runSearch(q: string) {
    setQuery(q);
    clearTimeout(debounceRef.current);

    if (!q.trim()) {
      setResults(null);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error('Search request failed');
        const data = await res.json();
        setResults(data.results);
        setStatus('idle');
        setRecentSearches((prev) => [q, ...prev.filter((r) => r !== q)].slice(0, RECENT_SEARCHES_KEY_LIMIT));
      } catch {
        setStatus('error');
        setResults(null);
      }
    }, 300);
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Search LifeLegends">
      <div className={styles.nebula} aria-hidden="true" />
      <button type="button" className={styles.closeBtn} onClick={close}>Close ✕</button>

      <div className={styles.inner}>
        <h2>Who are you looking for?</h2>
        <div className={styles.box}>
          <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a legend..."
            autoComplete="off"
            value={query}
            onChange={(e) => runSearch(e.target.value)}
          />
          <span className={styles.kbd}>ESC</span>
        </div>

        {!query && (
          <>
            <div className={styles.metaRow}>
              <h5>Popular Searches</h5>
              <div className={styles.chips}>
                {POPULAR_SEARCHES.map((term) => (
                  <button key={term} type="button" className={styles.pill} onClick={() => runSearch(term)}>{term}</button>
                ))}
              </div>
            </div>
            {recentSearches.length > 0 && (
              <div className={styles.metaRow}>
                <h5>Recent Searches</h5>
                <div className={styles.chips}>
                  {recentSearches.map((term) => (
                    <button key={term} type="button" className={styles.pill} onClick={() => runSearch(term)}>{term}</button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className={styles.results}>
          {status === 'loading' && (
            <div className={styles.loadingRow}>
              <div className={styles.skelThumb} />
              <div className={styles.skelLines}>
                <div className={styles.skelLine} style={{ width: '50%' }} />
                <div className={styles.skelLine} style={{ width: '30%' }} />
              </div>
            </div>
          )}

          {status === 'error' && <p className={styles.empty}>Something went wrong — please try again.</p>}

          {status === 'idle' && results !== null && results.length === 0 && (
            <p className={styles.empty}>No legends found for &ldquo;{query}&rdquo;.</p>
          )}

          {status === 'idle' && results !== null && results.length > 0 && results.map((r) => (
            <Link key={r.slug} href={`/legends/${r.slug}`} className={styles.resultItem} onClick={close}>
              <Image src={r.thumbnail} alt={r.name} width={44} height={44} className={styles.thumb} />
              <div>
                <div className={styles.resultName}>{r.name}</div>
                <div className={styles.resultRole}>{r.profession} · {r.nationality}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
