'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader, type UploadedImageData } from '@/components/admin/ImageUploader';
import { createCategoryAction, updateCategoryAction } from '@/lib/supabase/category-actions';
import { slugify } from '@/lib/utils';
import styles from './CategoryEditorForm.module.css';

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  featured: boolean;
  status: 'active' | 'disabled';
  seoTitle: string;
  seoDescription: string;
}

export interface CategoryEditorFormProps {
  categoryId?: string;
  initial?: Partial<CategoryFormState>;
  initialImage?: UploadedImageData | null;
}

export function CategoryEditorForm({ categoryId, initial, initialImage }: CategoryEditorFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CategoryFormState>({
    name: '', slug: '', description: '', featured: false, status: 'active', seoTitle: '', seoDescription: '', ...initial,
  });
  const [image, setImage] = useState<UploadedImageData | null>(initialImage ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof CategoryFormState>(key: K, value: CategoryFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      coverImagePath: image?.storagePath ?? null,
      featured: form.featured,
      status: form.status,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      ogImagePath: image?.storagePath ?? null,
    };

    const result = categoryId ? await updateCategoryAction(categoryId, payload) : await createCategoryAction(payload);
    setSaving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }
    router.push('/admin/categories');
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Category Name</label>
            <input
              value={form.name}
              onChange={(e) => {
                update('name', e.target.value);
                if (!categoryId) update('slug', slugify(e.target.value));
              }}
            />
          </div>
          <div className={styles.field}><label>Slug</label><input value={form.slug} onChange={(e) => update('slug', e.target.value)} /></div>
        </div>
        <div className={styles.field}><label>Description</label><textarea value={form.description} onChange={(e) => update('description', e.target.value)} /></div>

        <div className={styles.field}>
          <label>Category Image</label>
          <ImageUploader folder="categories" value={image} onChange={setImage} label="Category Image" />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value as 'active' | 'disabled')}>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
              Featured Category
            </label>
          </div>
        </div>

        <h3 className={styles.sectionTitle}>SEO</h3>
        <div className={styles.field}><label>SEO Title</label><input value={form.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} placeholder={form.name} /></div>
        <div className={styles.field}><label>Meta Description</label><textarea value={form.seoDescription} onChange={(e) => update('seoDescription', e.target.value)} placeholder={form.description} /></div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.footer}>
        <button type="button" className={styles.btnOutline} onClick={() => router.push('/admin/categories')}>Cancel</button>
        <button type="button" className={styles.btnGold} onClick={handleSave} disabled={saving || !form.name}>
          {saving ? 'Saving…' : 'Save Category'}
        </button>
      </div>
    </div>
  );
}

export default CategoryEditorForm;
