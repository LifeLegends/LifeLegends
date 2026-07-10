import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { publicMediaUrl } from '@/lib/supabase/storage';
import { BiographyEditorForm } from '@/components/admin/BiographyEditorForm';
import type { UploadedImageData } from '@/components/admin/ImageUploader';

export default async function EditBiographyPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: bio } = await supabase
    .from('biographies')
    .select(`
      id, slug, name, roles, birth_year, death_year, nationality, profession, tagline, intro, full_biography,
      hero_image_path, hero_image_alt, hero_image_caption, overview_title, overview,
      biography_categories ( categories ( slug ) ),
      timeline_events ( year, title, description, sort_order ),
      achievements ( counter, title, description ),
      quotes ( text, attribution ),
      facts ( summary, expand ),
      sources ( name, description, url ),
      gallery_images ( storage_path, alt_text, caption, title, description, sort_order ),
      seo_metadata ( meta_title, meta_description )
    `)
    .eq('id', params.id)
    .maybeSingle();

  if (!bio) notFound();

  const heroImage: UploadedImageData | null = bio.hero_image_path
    ? {
        storagePath: bio.hero_image_path,
        publicUrl: publicMediaUrl(bio.hero_image_path),
        filename: bio.hero_image_path.split('/').pop() ?? 'hero-image',
        size: 0,
        altText: bio.hero_image_alt ?? '',
        caption: bio.hero_image_caption ?? '',
        title: '',
        description: '',
      }
    : null;

  const gallery: UploadedImageData[] = (bio.gallery_images ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((g: any) => ({
      storagePath: g.storage_path,
      publicUrl: publicMediaUrl(g.storage_path),
      filename: g.storage_path.split('/').pop() ?? 'image',
      size: 0,
      altText: g.alt_text ?? '',
      caption: g.caption ?? '',
      title: g.title ?? '',
      description: g.description ?? '',
    }));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)' }}>Edit — {bio.name}</h1>
      </div>
      <BiographyEditorForm
        biographyId={bio.id}
        initialHeroImage={heroImage}
        initialGallery={gallery}
        initial={{
          slug: bio.slug,
          name: bio.name,
          roles: (bio.roles ?? []).join(', '),
          birthYear: String(bio.birth_year ?? ''),
          deathYear: bio.death_year ? String(bio.death_year) : '',
          nationality: bio.nationality ?? '',
          profession: bio.profession ?? '',
          tagline: bio.tagline ?? '',
          intro: bio.intro ?? '',
          fullBiography: bio.full_biography ?? '',
          categorySlug: (bio.biography_categories as any)?.[0]?.categories?.slug ?? 'scientists',
          overviewTitle: bio.overview_title ?? '',
          overview: (bio.overview ?? []).length ? bio.overview : [''],
          timeline: (bio.timeline_events ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((t: any) => ({ year: String(t.year), title: t.title, description: t.description })),
          achievements: bio.achievements ?? [],
          quotes: (bio.quotes ?? []).length ? bio.quotes : [{ text: '', attribution: '' }],
          facts: bio.facts ?? [],
          sources: (bio.sources ?? []).map((s: any) => ({ name: s.name, description: s.description ?? '', url: s.url ?? '' })),
          seoTitle: (bio.seo_metadata as any)?.meta_title ?? '',
          seoDescription: (bio.seo_metadata as any)?.meta_description ?? '',
        }}
      />
    </div>
  );
}
