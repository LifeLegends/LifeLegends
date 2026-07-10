'use client';

import { useState } from 'react';
import styles from './BookmarkButton.module.css';

export interface BookmarkButtonProps {
  legendSlug: string;
}

/**
 * BookmarkButton — client-only toggle for now (no persistence layer yet).
 * TODO(supabase): once user accounts exist, persist to a `bookmarks` table
 * keyed by user_id + legend_id instead of local component state.
 */
export function BookmarkButton({ legendSlug }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      className={`${styles.btn} ${saved ? styles.active : ''}`}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${legendSlug} from bookmarks` : `Bookmark ${legendSlug}`}
      onClick={() => setSaved((s) => !s)}
    >
      <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
        <path d="M6 3h12v18l-6-4-6 4V3z" />
      </svg>
    </button>
  );
}

export default BookmarkButton;
