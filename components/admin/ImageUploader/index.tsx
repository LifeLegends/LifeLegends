'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './ImageUploader.module.css';

export interface UploadedImageData {
  storagePath: string;
  publicUrl: string;
  filename: string;
  size: number;
  altText: string;
  caption: string;
  title: string;
  description: string;
}

export interface ImageUploaderProps {
  folder: 'portraits' | 'gallery' | 'categories';
  value: UploadedImageData | null;
  onChange: (value: UploadedImageData | null) => void;
  label?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE_BYTES = 20 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * ImageUploader — replaces the old "paste a URL into a text field" image
 * block entirely. Real drag & drop, real upload progress (via XHR, since
 * fetch() can't report upload progress), real Supabase Storage upload,
 * real preview, and structured alt/caption/title/description fields.
 *
 * Not included in this pass (flagged, not silently skipped): in-browser
 * crop/rotate, and duplicate-hash detection. Clipboard paste IS included.
 */
export function ImageUploader({ folder, value, onChange, label = 'Image' }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Unsupported format. Please use JPG, PNG, WEBP, or AVIF.';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `Image is too large (${formatBytes(file.size)}). Maximum size is 20MB.`;
    }
    return null;
  };

  const uploadFile = useCallback((file: File) => {
    const validationError = validate(file);
    if (validationError) {
      setStatus('error');
      setErrorMessage(validationError);
      return;
    }

    setStatus('uploading');
    setProgress(0);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const result = JSON.parse(xhr.responseText);
        setStatus('success');
        setProgress(100);
        onChange({
          storagePath: result.storagePath,
          publicUrl: result.publicUrl,
          filename: result.filename,
          size: result.size,
          altText: '',
          caption: '',
          title: '',
          description: '',
        });
      } else {
        const result = JSON.parse(xhr.responseText || '{}');
        setStatus('error');
        setErrorMessage(result.error ?? 'Upload failed. Please try again.');
      }
    };

    xhr.onerror = () => {
      setStatus('error');
      setErrorMessage('Network error — please check your connection and retry.');
    };

    xhr.send(formData);
  }, [folder, onChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith('image/'));
    const file = item?.getAsFile();
    if (file) uploadFile(file);
  };

  function updateMeta(patch: Partial<UploadedImageData>) {
    if (!value) return;
    onChange({ ...value, ...patch });
  }

  function handleRemove() {
    onChange(null);
    setStatus('idle');
    setProgress(null);
  }

  if (value && status !== 'uploading') {
    return (
      <div className={styles.wrap}>
        <div className={styles.previewCard}>
          <div className={styles.previewImage}>
            <Image src={value.publicUrl} alt={value.altText || value.filename} fill sizes="200px" style={{ objectFit: 'cover' }} />
          </div>
          <div className={styles.previewMeta}>
            <div className={styles.filename}>{value.filename}</div>
            <div className={styles.filesize}>{formatBytes(value.size)}</div>
            <div className={styles.previewActions}>
              <button type="button" className={styles.linkBtn} onClick={() => inputRef.current?.click()}>Replace</button>
              <button type="button" className={styles.linkBtnDanger} onClick={handleRemove}>Remove</button>
              <button type="button" className={styles.linkBtn} onClick={() => navigator.clipboard.writeText(value.publicUrl)}>Copy URL</button>
            </div>
          </div>
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label>Alt Text <span className={styles.required}>required for SEO</span></label>
            <input value={value.altText} onChange={(e) => updateMeta({ altText: e.target.value })} placeholder="Describe the image for screen readers and search engines" />
          </div>
          <div className={styles.field}>
            <label>Caption</label>
            <input value={value.caption} onChange={(e) => updateMeta({ caption: e.target.value })} placeholder="Shown beneath the image, optional" />
          </div>
          <div className={styles.field}>
            <label>Title</label>
            <input value={value.title} onChange={(e) => updateMeta({ title: e.target.value })} placeholder="Optional title attribute" />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea value={value.description} onChange={(e) => updateMeta({ description: e.target.value })} placeholder="Optional longer description" />
          </div>
        </div>

        <input ref={inputRef} type="file" accept={ALLOWED_TYPES.join(',')} hidden onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        role="button"
        aria-label={`Upload ${label}`}
      >
        {status === 'uploading' ? (
          <div className={styles.progressWrap}>
            <div className={styles.spinner} />
            <p>Uploading… {progress ?? 0}%</p>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${progress ?? 0}%` }} />
            </div>
          </div>
        ) : (
          <>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
              <path d="M12 3v12M6 9l6-6 6 6" />
              <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            <p>
              Drag & drop {label.toLowerCase()} here, or{' '}
              <button type="button" className={styles.browseBtn} onClick={() => inputRef.current?.click()}>browse files</button>
            </p>
            <p className={styles.hint}>JPG, PNG, WEBP, or AVIF · up to 20MB · or paste from clipboard</p>
          </>
        )}
      </div>

      {status === 'error' && (
        <div className={styles.errorBox}>
          <span>{errorMessage}</span>
          <button type="button" onClick={() => { setStatus('idle'); inputRef.current?.click(); }}>Retry Upload</button>
        </div>
      )}

      <input ref={inputRef} type="file" accept={ALLOWED_TYPES.join(',')} hidden onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
    </div>
  );
}

export default ImageUploader;
