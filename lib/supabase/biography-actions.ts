'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

export interface ActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Biography CRUD Server Actions. Each mutates `biographies` plus its
 * related child tables (timeline_events, achievements, quotes, facts,
 * sources) in one request. Child rows are replaced wholesale on save
 * (delete + reinsert) rather than diffed — simpler and correct at this
 * content volume; worth revisiting with per-row upserts if the editor
 * needs granular undo later.
 */

interface BiographyFormShape {
  slug: string;
  name: string;
  roles: string[];
  birthYear: number;
  deathYear: number | null;
  nationality: string;
  profession: string;
  tagline: string;
  intro: string;
  fullBiography: string;
  categorySlug: string;
  heroImage: { storagePath: string; altText: string; caption: string } | null;
  gallery: { storagePath: string; altText: string; caption: string; title: string; description: string }[];
  overviewTitle: string;
  overview: string[];
  stats: { value: string; label: string }[];
  timeline: { year: number; title: string; description: string }[];
  achievements: { counter: string; title: string; description: string }[];
  quotes: { text: string; attribution: string; featured: boolean }[];
  facts: { summary: string; expand: string }[];
  sources: { name: string; description: string; url?: string }[];
  seoTitle: string;
  seoDescription: string;
}

/**
 * A biography cannot be published without a hero image and its alt text —
 * this is the concrete "Biography can now be published" gate from the
 * image-system requirements, enforced server-side (not just a UI hint).
 */
function validateForPublish(data: BiographyFormShape): string | null {
  if (!data.heroImage) return 'A hero image is required before publishing.';
  if (!data.heroImage.altText.trim()) return 'Hero image alt text is required before publishing (for SEO and accessibility).';
  return null;
}

async function upsertChildRows(
  supabase: ReturnType<typeof createClient>,
  biographyId: string,
  data: BiographyFormShape,
) {
  await Promise.all([
    supabase.from('timeline_events').delete().eq('biography_id', biographyId),
    supabase.from('achievements').delete().eq('biography_id', biographyId),
    supabase.from('quotes').delete().eq('biography_id', biographyId),
    supabase.from('facts').delete().eq('biography_id', biographyId),
    supabase.from('sources').delete().eq('biography_id', biographyId),
    supabase.from('gallery_images').delete().eq('biography_id', biographyId),
  ]);

  await Promise.all([
    data.timeline.length > 0 &&
      supabase.from('timeline_events').insert(
        data.timeline.map((t, i) => ({ ...t, biography_id: biographyId, sort_order: i })),
      ),
    data.achievements.length > 0 &&
      supabase.from('achievements').insert(
        data.achievements.map((a, i) => ({ ...a, biography_id: biographyId, sort_order: i })),
      ),
    data.quotes.length > 0 &&
      supabase.from('quotes').insert(
        data.quotes.map((q, i) => ({ ...q, biography_id: biographyId, sort_order: i })),
      ),
    data.facts.length > 0 &&
      supabase.from('facts').insert(
        data.facts.map((f, i) => ({ ...f, biography_id: biographyId, sort_order: i })),
      ),
    data.sources.length > 0 &&
      supabase.from('sources').insert(
        data.sources.map((s, i) => ({ ...s, biography_id: biographyId, sort_order: i })),
      ),
    data.gallery.length > 0 &&
      supabase.from('gallery_images').insert(
        data.gallery.map((g, i) => ({
          biography_id: biographyId,
          storage_path: g.storagePath,
          alt_text: g.altText,
          caption: g.caption || null,
          title: g.title || null,
          description: g.description || null,
          sort_order: i,
        })),
      ),
  ]);

  await supabase.from('seo_metadata').upsert(
    {
      biography_id: biographyId,
      meta_title: data.seoTitle,
      meta_description: data.seoDescription,
      canonical_path: `/legends/${data.slug}`,
    },
    { onConflict: 'biography_id' },
  );

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', data.categorySlug)
    .single()
    .returns<{ id: string }>();
  if (category) {
    await supabase.from('biography_categories').delete().eq('biography_id', biographyId);
    await supabase.from('biography_categories').insert({ biography_id: biographyId, category_id: category.id, is_primary: true });
  }
}

export async function createBiographyAction(data: BiographyFormShape, status: 'draft' | 'published'): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  if (status === 'published') {
    const validationError = validateForPublish(data);
    if (validationError) return { error: validationError };
  }

  const { data: bio, error } = await supabase
    .from('biographies')
    .insert({
      slug: data.slug,
      name: data.name,
      roles: data.roles,
      birth_year: data.birthYear,
      death_year: data.deathYear,
      nationality: data.nationality,
      profession: data.profession,
      tagline: data.tagline,
      intro: data.intro,
      full_biography: data.fullBiography,
      hero_image_path: data.heroImage?.storagePath ?? null,
      hero_image_alt: data.heroImage?.altText ?? null,
      hero_image_caption: data.heroImage?.caption ?? null,
      overview_title: data.overviewTitle,
      overview: data.overview,
      stats: data.stats,
      status,
      created_by: user.id,
    })
    .select('id')
    .single()
    .returns<{ id: string }>();

  await upsertChildRows(supabase, bio.id, data);

  revalidatePath('/admin/biographies');
  revalidatePath('/');
  revalidatePath(`/legends/${data.slug}`);
  redirect('/admin/biographies');
}

export async function updateBiographyAction(id: string, data: BiographyFormShape, status: 'draft' | 'published'): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  if (status === 'published') {
    const validationError = validateForPublish(data);
    if (validationError) return { error: validationError };
  }

  const { error } = await supabase
    .from('biographies')
    .update({
      slug: data.slug,
      name: data.name,
      roles: data.roles,
      birth_year: data.birthYear,
      death_year: data.deathYear,
      nationality: data.nationality,
      profession: data.profession,
      tagline: data.tagline,
      intro: data.intro,
      full_biography: data.fullBiography,
      hero_image_path: data.heroImage?.storagePath ?? null,
      hero_image_alt: data.heroImage?.altText ?? null,
      hero_image_caption: data.heroImage?.caption ?? null,
      overview_title: data.overviewTitle,
      overview: data.overview,
      stats: data.stats,
      status,
    })
    .eq('id', id);

  if (error) return { error: error.message };

  await upsertChildRows(supabase, id, data);

  revalidatePath('/admin/biographies');
  revalidatePath('/');
  revalidatePath(`/legends/${data.slug}`);
  return { success: true };
}

export async function deleteBiographyAction(id: string, slug: string): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase.from('biographies').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/biographies');
  revalidatePath('/');
  revalidatePath(`/legends/${slug}`);
  return { success: true };
}

export async function duplicateBiographyAction(id: string): Promise<ActionResult> {
  const supabase = createClient();
  const { data: original } = await supabase
    .from('biographies')
    .select('*')
    .eq('id', id)
    .single()
    .returns<Database['public']['Tables']['biographies']['Row']>();
  if (!original) return { error: 'Biography not found.' };

  const { data: copy, error } = await supabase
    .from('biographies')
    .insert({
      ...original,
      id: undefined,
      slug: `${original.slug}-copy-${Date.now()}`,
      name: `${original.name} (Copy)`,
      status: 'draft',
      view_count: 0,
    })
    .select('id')
    .single()
    .returns<{ id: string }>();

  if (error || !copy) return { error: error?.message ?? 'Failed to duplicate.' };

  revalidatePath('/admin/biographies');
  return { success: true };
}

export async function setPublishStatusAction(id: string, slug: string, status: 'draft' | 'published'): Promise<ActionResult> {
  const supabase = createClient();

  if (status === 'published') {
    const { data: bio } = await supabase
      .from('biographies')
      .select('hero_image_path, hero_image_alt')
      .eq('id', id)
      .single()
      .returns<{ hero_image_path: string | null; hero_image_alt: string | null }>();
    if (!bio?.hero_image_path) return { error: 'Cannot publish — this biography has no hero image yet.' };
    if (!bio?.hero_image_alt) return { error: 'Cannot publish — the hero image needs alt text first.' };
  }

  const { error } = await supabase.from('biographies').update({ status }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/biographies');
  revalidatePath('/');
  revalidatePath(`/legends/${slug}`);
  return { success: true };
}
