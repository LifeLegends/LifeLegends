import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { publicMediaUrl } from '@/lib/supabase/storage';
import type { Biography, Category } from '@/lib/types/domain';

/**
 * Data access layer — backed entirely by Supabase. Local seed data
 * (lib/content/seed-*.ts) is not read at runtime; those files exist only
 * as the source for `supabase/seed.sql`.
 *
 * Every function below is defensive on purpose: a thrown error (network
 * timeout, DNS failure, misconfigured env vars) is caught and logged,
 * resolving to an empty/null result instead of throwing — so a Supabase
 * outage degrades to "no content shown" rather than an infinitely
 * loading page or an uncaught exception.
 *
 * IMPORTANT: the join to biography_categories is a LEFT join (not
 * `!inner`). An inner join would silently exclude any biography that
 * has no category assigned yet from every single query, including its
 * own detail page — this was a real bug, fixed here.
 */

const BIOGRAPHY_SELECT = `
  id, slug, name, roles, birth_year, death_year, nationality, profession,
  tagline, intro, full_biography, hero_image_path, hero_image_alt, hero_image_caption, thumbnail_path, overview_title, overview,
  stats, featured, view_count, status,
  timeline_events ( year, title, description, sort_order ),
  achievements ( counter, title, description, sort_order ),
  quotes ( text, attribution, featured, sort_order ),
  gallery_images ( storage_path, alt_text, caption, sort_order ),
  facts ( summary, expand, sort_order ),
  sources ( name, description, url, sort_order ),
  seo_metadata ( meta_title, meta_description, canonical_path, og_image_path ),
  biography_categories ( is_primary, categories ( slug, name ) )
`;

/** Maps a raw Supabase row (with joined child tables) into the canonical Biography shape. */
function mapRowToBiography(row: any): Biography {
  const primaryCategory = row.biography_categories?.find((bc: any) => bc.is_primary) ?? row.biography_categories?.[0];

  return {
    slug: row.slug,
    name: row.name,
    roles: row.roles ?? [],
    birthYear: row.birth_year,
    deathYear: row.death_year,
    nationality: row.nationality,
    profession: row.profession,
    tagline: row.tagline,
    intro: row.intro,
    heroImage: publicMediaUrl(row.hero_image_path),
    heroImageAlt: row.hero_image_alt || `${row.name} portrait`,
    heroImageCaption: row.hero_image_caption || undefined,
    thumbnail: publicMediaUrl(row.thumbnail_path),
    categorySlug: primaryCategory?.categories?.slug ?? '',
    featured: row.featured,
    viewCount: row.view_count,
    status: row.status,
    overviewTitle: row.overview_title,
    overview: row.overview ?? [],
    fullBiography: row.full_biography ?? '',
    stats: (row.stats ?? []).map((s: any) => ({ value: s.value, label: s.label })),
    timeline: (row.timeline_events ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((t: any) => ({ year: t.year, title: t.title, description: t.description })),
    achievements: (row.achievements ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((a: any) => ({ counter: a.counter, title: a.title, description: a.description })),
    quotes: (row.quotes ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((q: any) => ({ text: q.text, attribution: q.attribution, featured: q.featured })),
    gallery: (row.gallery_images ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((g: any) => ({ url: publicMediaUrl(g.storage_path), alt: g.alt_text, caption: g.caption })),
    facts: (row.facts ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((f: any) => ({ summary: f.summary, expand: f.expand })),
    sources: (row.sources ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((s: any) => ({ name: s.name, description: s.description, url: s.url })),
    seo: {
      metaTitle: row.seo_metadata?.meta_title ?? row.name,
      metaDescription: row.seo_metadata?.meta_description ?? row.intro,
      canonicalPath: row.seo_metadata?.canonical_path ?? `/legends/${row.slug}`,
      ogImage: publicMediaUrl(row.seo_metadata?.og_image_path) || publicMediaUrl(row.hero_image_path),
    },
  };
}

export async function getFeaturedLegends(limit = 4): Promise<Biography[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('biographies')
      .select(BIOGRAPHY_SELECT)
      .eq('status', 'published')
      .eq('featured', true)
      .limit(limit);

    if (error) {
      console.error('getFeaturedLegends failed:', error.message);
      return [];
    }
    return (data ?? []).map(mapRowToBiography);
  } catch (err) {
    console.error('getFeaturedLegends threw:', err);
    return [];
  }
}

export async function getTrendingLegends(limit = 5): Promise<Biography[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('biographies')
      .select(BIOGRAPHY_SELECT)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('getTrendingLegends failed:', error.message);
      return [];
    }
    return (data ?? []).map(mapRowToBiography);
  } catch (err) {
    console.error('getTrendingLegends threw:', err);
    return [];
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('slug, name, description, biography_categories(count)')
      .eq('status', 'active')
      .order('sort_order');

    if (error) {
      console.error('getAllCategories failed:', error.message);
      return [];
    }

    return (data ?? []).map((row: any) => ({
      slug: row.slug,
      name: row.name,
      description: row.description ?? '',
      hasContent: (row.biography_categories?.[0]?.count ?? 0) > 0,
      count: row.biography_categories?.[0]?.count ?? 0,
    }));
  } catch (err) {
    console.error('getAllCategories threw:', err);
    return [];
  }
}

export async function getLegendBySlug(slug: string): Promise<Biography | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('biographies')
      .select(BIOGRAPHY_SELECT)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) {
      console.error('getLegendBySlug failed:', error.message);
      return null;
    }
    return data ? mapRowToBiography(data) : null;
  } catch (err) {
    console.error('getLegendBySlug threw:', err);
    return null;
  }
}

export async function getLegendsByCategory(categorySlug: string): Promise<Biography[]> {
  try {
    const supabase = createClient();

    const { data: category } = await supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle();
    if (!category) return [];

    const { data: links } = await supabase
      .from('biography_categories')
      .select('biography_id')
      .eq('category_id', category.id);

    const biographyIds = (links ?? []).map((l) => l.biography_id);
    if (biographyIds.length === 0) return [];

    const { data, error } = await supabase
      .from('biographies')
      .select(BIOGRAPHY_SELECT)
      .eq('status', 'published')
      .in('id', biographyIds);

    if (error) {
      console.error('getLegendsByCategory failed:', error.message);
      return [];
    }
    return (data ?? []).map(mapRowToBiography);
  } catch (err) {
    console.error('getLegendsByCategory threw:', err);
    return [];
  }
}

export async function getRelatedLegends(currentSlug: string, categorySlug: string, limit = 4): Promise<Biography[]> {
  try {
    const sameCategory = await getLegendsByCategory(categorySlug);
    const filtered = sameCategory.filter((l) => l.slug !== currentSlug);

    if (filtered.length >= limit) return filtered.slice(0, limit);

    const supabase = createClient();
    const { data } = await supabase
      .from('biographies')
      .select(BIOGRAPHY_SELECT)
      .eq('status', 'published')
      .neq('slug', currentSlug)
      .limit(limit - filtered.length);

    const fallback = (data ?? []).map(mapRowToBiography).filter((l) => !filtered.find((f) => f.slug === l.slug));
    return [...filtered, ...fallback].slice(0, limit);
  } catch (err) {
    console.error('getRelatedLegends threw:', err);
    return [];
  }
}

export async function getAdjacentLegends(currentSlug: string): Promise<{ prev: Biography; next: Biography } | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('biographies')
      .select('slug')
      .eq('status', 'published')
      .order('created_at');

    if (error || !data || data.length === 0) return null;

    const slugs = data.map((r) => r.slug);
    const i = slugs.indexOf(currentSlug);
    if (i === -1) return null;

    const prevSlug = slugs[(i - 1 + slugs.length) % slugs.length];
    const nextSlug = slugs[(i + 1) % slugs.length];

    const [prev, next] = await Promise.all([getLegendBySlug(prevSlug), getLegendBySlug(nextSlug)]);
    if (!prev || !next) return null;
    return { prev, next };
  } catch (err) {
    console.error('getAdjacentLegends threw:', err);
    return null;
  }
}

export async function searchLegends(query: string, page = 1, pageSize = 10): Promise<{ results: Biography[]; total: number }> {
  const q = query.trim();
  if (!q) return { results: [], total: 0 };

  try {
    const supabase = createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('biographies')
      .select(BIOGRAPHY_SELECT, { count: 'exact' })
      .eq('status', 'published')
      .ilike('name', `%${q}%`)
      .range(from, to);

    if (error) {
      console.error('searchLegends failed:', error.message);
      return { results: [], total: 0 };
    }
    return { results: (data ?? []).map(mapRowToBiography), total: count ?? 0 };
  } catch (err) {
    console.error('searchLegends threw:', err);
    return { results: [], total: 0 };
  }
}
