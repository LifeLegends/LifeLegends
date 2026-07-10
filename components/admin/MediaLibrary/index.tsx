'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './MediaLibrary.module.css';

export interface MediaFile {
  path: string;
  name: string;
  folder: string;
  publicUrl: string;
  size: number;
  contentType: string;
  createdAt: string;
}

export interface MediaLibraryProps {
  /** If provided, clicking an image calls this instead of just previewing — used when picking an existing image for reuse. */
  onSelect?: (file: MediaFile) => void;
  selectable?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * MediaLibrary — real Supabase Storage listing (via /api/admin/media), not
 * a mock array. Supports folder filter, search, sort, delete, and an
 * optional "pick to reuse" mode for the image uploaders above.
 */
export function MediaLibrary({ onSelect, selectable = false }: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState<'all' | 'portraits' | 'gallery' | 'categories'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'size'>('newest');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  async function load(reset = true) {
    setLoading(true);
    const params = new URLSearchParams();
    if (folder !== 'all') params.set('folder', folder);
    if (search) params.set('search', search);
    params.set('offset', String(reset ? 0 : offset));
    params.set('limit', '40');

    const res = await fetch(`/api/admin/media?${params.toString()}`);
    const data = await res.json();
    setFiles((prev) => (reset ? data.files : [...prev, ...data.files]));
    setHasMore((data.files ?? []).length === 40);
    setOffset(reset ? 40 : offset + 40);
    setLoading(false);
  }

  useEffect(() => { load(true); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [folder, search]);

  async function handleDelete(path: string) {
    if (!confirm('Delete this image permanently? This cannot be undone.')) return;
    await fetch('/api/admin/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path }) });
    setFiles((prev) => prev.filter((f) => f.path !== path));
  }

  const sorted = [...files].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'size') return b.size - a.size;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search filenames..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className={styles.select} value={folder} onChange={(e) => setFolder(e.target.value as any)}>
          <option value="all">All folders</option>
          <option value="portraits">Portraits</option>
          <option value="gallery">Gallery</option>
          <option value="categories">Categories</option>
        </select>
        <select className={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="newest">Newest first</option>
          <option value="name">Name (A–Z)</option>
          <option value="size">Largest first</option>
        </select>
      </div>

      {loading && files.length === 0 && (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className={styles.skeleton} />)}
        </div>
      )}

      {!loading && sorted.length === 0 && <p className={styles.empty}>No images found. Upload one from a biography editor to see it here.</p>}

      {sorted.length > 0 && (
        <>
          <div className={styles.grid}>
            {sorted.map((file) => (
              <div key={file.path} className={styles.item}>
                <button
                  type="button"
                  className={styles.itemImageBtn}
                  onClick={() => onSelect?.(file)}
                  disabled={!selectable}
                >
                  <div className={styles.itemImage}>
                    <Image src={file.publicUrl} alt={file.name} fill sizes="180px" style={{ objectFit: 'cover' }} />
                  </div>
                </button>
                <div className={styles.itemMeta}>
                  <div className={styles.itemName}>{file.name}</div>
                  <div className={styles.itemSub}>{formatBytes(file.size)} · {file.folder}</div>
                </div>
                <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(file.path)} aria-label={`Delete ${file.name}`}>✕</button>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className={styles.loadMoreWrap}>
              <button type="button" className={styles.loadMoreBtn} onClick={() => load(false)} disabled={loading}>
                {loading ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MediaLibrary;
