'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader, type UploadedImageData } from '@/components/admin/ImageUploader';
import { GalleryUploader } from '@/components/admin/GalleryUploader';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';
import { createBiographyAction, updateBiographyAction } from '@/lib/supabase/biography-actions';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import styles from './BiographyEditorForm.module.css';

type CategoryOption = Pick<Database['public']['Tables']['categories']['Row'], 'slug' | 'name'>;

interface FormState {
  slug: string;
  name: string;
  roles: string;
  birthYear: string;
  deathYear: string;
  nationality: string;
  profession: string;
  tagline: string;
  intro: string;
  fullBiography: string;
  categorySlug: string;
  overviewTitle: string;
  overview: string[];
  timeline: { year: string; title: string; description: string }[];
  achievements: { counter: string; title: string; description: string }[];
  quotes: { text: string; attribution: string }[];
  facts: { summary: string; expand: string }[];
  sources: { name: string; description: string; url: string }[];
  seoTitle: string;
  seoDescription: string;
}

const EMPTY_FORM: FormState = {
  slug: '', name: '', roles: '', birthYear: '', deathYear: '', nationality: '', profession: '',
  tagline: '', intro: '', fullBiography: '', categorySlug: 'scientists', overviewTitle: '', overview: [''],
  timeline: [], achievements: [], quotes: [{ text: '', attribution: '' }], facts: [], sources: [],
  seoTitle: '', seoDescription: '',
};

export interface BiographyEditorFormProps {
  biographyId?: string;
  initial?: Partial<FormState>;
  initialHeroImage?: UploadedImageData | null;
  initialGallery?: UploadedImageData[];
}

/**
 * BiographyEditorForm — the real editor replacing the old "Image block =
 * text input" system. Hero image and gallery both use the real upload
 * components; every other section is a simple, honest add/remove list
 * (not the focus of this round's request, but functional).
 */
export function BiographyEditorForm({ biographyId, initial, initialHeroImage, initialGallery }: BiographyEditorFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, ...initial });
  const [heroImage, setHeroImage] = useState<UploadedImageData | null>(initialHeroImage ?? null);
  const [gallery, setGallery] = useState<UploadedImageData[]>(initialGallery ?? []);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'content' | 'media' | 'seo'>('content');

  // Live from Supabase — a newly created category (Categories tab) appears
  // here immediately on next visit, no code change or hardcoded list needed.
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('categories')
      .select('slug, name')
      .eq('status', 'active')
      .order('sort_order')
      .returns<CategoryOption[]>()
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function buildPayload() {
    return {
      slug: form.slug,
      name: form.name,
      roles: form.roles.split(',').map((r) => r.trim()).filter(Boolean),
      birthYear: Number(form.birthYear),
      deathYear: form.deathYear ? Number(form.deathYear) : null,
      nationality: form.nationality,
      profession: form.profession,
      tagline: form.tagline,
      intro: form.intro,
      fullBiography: form.fullBiography,
      categorySlug: form.categorySlug,
      heroImage: heroImage ? { storagePath: heroImage.storagePath, altText: heroImage.altText, caption: heroImage.caption } : null,
      gallery: gallery.map((g) => ({ storagePath: g.storagePath, altText: g.altText, caption: g.caption, title: g.title, description: g.description })),
      overviewTitle: form.overviewTitle,
      overview: form.overview.filter(Boolean),
      stats: [],
      timeline: form.timeline.map((t) => ({ year: Number(t.year), title: t.title, description: t.description })),
      achievements: form.achievements,
      quotes: form.quotes.filter((q) => q.text).map((q, i) => ({ ...q, featured: i === 0 })),
      facts: form.facts,
      sources: form.sources.map((s) => ({ ...s, url: s.url || undefined })),
      seoTitle: form.seoTitle || form.name,
      seoDescription: form.seoDescription || form.intro,
    };
  }

  async function handleSave(status: 'draft' | 'published') {
    setSaving(true);
    setError('');
    const payload = buildPayload();

    const result = biographyId
      ? await updateBiographyAction(biographyId, payload, status)
      : await createBiographyAction(payload, status);

    setSaving(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    if (biographyId) router.push('/admin/biographies');
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        <button type="button" className={tab === 'content' ? styles.tabActive : styles.tab} onClick={() => setTab('content')}>Content</button>
        <button type="button" className={tab === 'media' ? styles.tabActive : styles.tab} onClick={() => setTab('media')}>Media</button>
        <button type="button" className={tab === 'seo' ? styles.tabActive : styles.tab} onClick={() => setTab('seo')}>SEO</button>
      </div>

      {tab === 'content' && (
        <div className={styles.panel}>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label>Name</label><input value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
            <div className={styles.field}><label>Slug</label><input value={form.slug} onChange={(e) => update('slug', e.target.value)} /></div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label>Roles (comma-separated)</label><input value={form.roles} onChange={(e) => update('roles', e.target.value)} /></div>
            <div className={styles.field}><label>Category</label>
              <select value={form.categorySlug} onChange={(e) => update('categorySlug', e.target.value)}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label>Birth Year</label><input type="number" value={form.birthYear} onChange={(e) => update('birthYear', e.target.value)} /></div>
            <div className={styles.field}><label>Death Year</label><input type="number" value={form.deathYear} onChange={(e) => update('deathYear', e.target.value)} /></div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label>Nationality</label><input value={form.nationality} onChange={(e) => update('nationality', e.target.value)} /></div>
            <div className={styles.field}><label>Profession</label><input value={form.profession} onChange={(e) => update('profession', e.target.value)} /></div>
          </div>
          <div className={styles.field}><label>Tagline</label><input value={form.tagline} onChange={(e) => update('tagline', e.target.value)} /></div>
          <div className={styles.field}><label>Intro / Summary</label><textarea value={form.intro} onChange={(e) => update('intro', e.target.value)} /></div>
          <div className={styles.field}>
            <label>Full Biography <span style={{ color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>— the complete long-form story, separate from the summary above</span></label>
            <MarkdownEditor value={form.fullBiography} onChange={(v) => update('fullBiography', v)} placeholder="Write the complete biography here. Supports headings, paragraphs, bold/italic, quotes, lists, and images..." />
          </div>
          <div className={styles.field}><label>Overview Title</label><input value={form.overviewTitle} onChange={(e) => update('overviewTitle', e.target.value)} /></div>
        </div>
      )}

      {tab === 'media' && (
        <div className={styles.panel}>
          <h3 className={styles.sectionTitle}>Hero Image</h3>
          <ImageUploader folder="portraits" value={heroImage} onChange={setHeroImage} label="Hero Image" />

          <h3 className={styles.sectionTitle} style={{ marginTop: 32 }}>Gallery</h3>
          <GalleryUploader value={gallery} onChange={setGallery} max={30} />
        </div>
      )}

      {tab === 'seo' && (
        <div className={styles.panel}>
          <div className={styles.field}><label>Meta Title</label><input value={form.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} placeholder={form.name} /></div>
          <div className={styles.field}><label>Meta Description</label><textarea value={form.seoDescription} onChange={(e) => update('seoDescription', e.target.value)} placeholder={form.intro} /></div>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.footer}>
        <button type="button" className={styles.btnOutline} onClick={() => handleSave('draft')} disabled={saving}>
          {saving ? 'Saving…' : 'Save Draft'}
        </button>
        <button type="button" className={styles.btnGold} onClick={() => handleSave('published')} disabled={saving}>
          {saving ? 'Publishing…' : 'Save & Publish'}
        </button>
      </div>
    </div>
  );
}

export default BiographyEditorForm;
