'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import type { UploadedImageData } from '@/components/admin/ImageUploader';
import styles from './GalleryUploader.module.css';

export interface GalleryUploaderProps {
  value: UploadedImageData[];
  onChange: (value: UploadedImageData[]) => void;
  max?: number;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE_BYTES = 20 * 1024 * 1024;

interface PendingUpload {
  id: string;
  filename: string;
  progress: number;
  error?: string;
}

/**
 * GalleryUploader — multi-file drag & drop upload with per-file progress,
 * drag-to-reorder (native HTML5 DnD, no extra dependency), replace/delete
 * per image, and a hard cap of `max` images.
 */
export function GalleryUploader({ value, onChange, max = 30 }: GalleryUploaderProps) {
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function uploadOne(file: File) {
    const id = crypto.randomUUID();

    if (!ALLOWED_TYPES.includes(file.type)) {
      setPending((p) => [...p, { id, filename: file.name, progress: 0, error: 'Unsupported format' }]);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setPending((p) => [...p, { id, filename: file.name, progress: 0, error: 'File too large (max 20MB)' }]);
      return;
    }

    setPending((p) => [...p, { id, filename: file.name, progress: 0 }]);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload');
    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const pct = Math.round((e.loaded / e.total) * 100);
      setPending((p) => p.map((item) => (item.id === id ? { ...item, progress: pct } : item)));
    };
    xhr.onload = () => {
      setPending((p) => p.filter((item) => item.id !== id));
      if (xhr.status >= 200 && xhr.status < 300) {
        const result = JSON.parse(xhr.responseText);
        onChange([
          ...value,
          {
            storagePath: result.storagePath,
            publicUrl: result.publicUrl,
            filename: result.filename,
            size: result.size,
            altText: '',
            caption: '',
            title: '',
            description: '',
          },
        ]);
      } else {
        const result = JSON.parse(xhr.responseText || '{}');
        setPending((p) => [...p, { id, filename: file.name, progress: 0, error: result.error ?? 'Upload failed' }]);
      }
    };
    xhr.onerror = () => {
      setPending((p) => p.map((item) => (item.id === id ? { ...item, error: 'Network error' } : item)));
    };
    xhr.send(formData);
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = max - value.length - pending.length;
    const toUpload = Array.from(files).slice(0, Math.max(0, remaining));
    toUpload.forEach(uploadOne);
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOverItem(e: React.DragEvent, index: number) {
    e.preventDefault();

    if (dragIndex.current === null || dragIndex.current === index) {
      return;
    }

    const next = [...value];
    const moved = next.splice(dragIndex.current, 1)[0];

    if (!moved) {
      return;
    }

    next.splice(index, 0, moved);
    dragIndex.current = index;
    onChange(next);
  }

  function handleDragEnd() {
    dragIndex.current = null;
  }

  const atMax = value.length + pending.length >= max;

  return (
    <div className={styles.wrap}>
      {!atMax && (
        <div
          className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            <path d="M12 3v12M6 9l6-6 6 6" />
            <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
          <p>Drag & drop images, or <span className={styles.browseText}>browse</span></p>
          <p className={styles.hint}>{value.length + pending.length}/{max} images · JPG, PNG, WEBP, AVIF · up to 20MB each</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {pending.length > 0 && (
        <div className={styles.pendingList}>
          {pending.map((p) => (
            <div key={p.id} className={styles.pendingItem}>
              <span className={styles.pendingName}>{p.filename}</span>
              {p.error ? (
                <span className={styles.pendingError}>{p.error}</span>
              ) : (
                <div className={styles.pendingBarTrack}>
                  <div className={styles.pendingBarFill} style={{ width: `${p.progress}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className={styles.grid}>
          {value.map((img, i) => (
            <div
              key={img.storagePath}
              className={styles.item}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOverItem(e, i)}
              onDragEnd={handleDragEnd}
            >
              <div className={styles.itemImage}>
                <Image src={img.publicUrl} alt={img.altText || img.filename} fill sizes="140px" style={{ objectFit: 'cover' }} />
              </div>
              <input
                className={styles.altInput}
                placeholder="Alt text..."
                value={img.altText}
                onChange={(e) => {
                  const current = value[i];
                  if (!current) return;

                  const next = [...value];
                  next[i] = { ...current, altText: e.target.value };
                  onChange(next);
                }}
              />
              <button type="button" className={styles.removeBtn} onClick={() => removeAt(i)} aria-label={`Remove ${img.filename}`}>✕</button>
              <span className={styles.dragHandle} aria-hidden="true">⠿</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GalleryUploader;
