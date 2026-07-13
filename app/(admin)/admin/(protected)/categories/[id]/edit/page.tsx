import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { publicMediaUrl } from '@/lib/supabase/storage';
import { CategoryEditorForm } from '@/components/admin/CategoryEditorForm';
import type { UploadedImageData } from '@/components/admin/ImageUploader';
import type { Database } from '@/lib/supabase/types';

type CategoryRow = Database['public']['Tables']['categories']['Row'];

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();
  const { data: cat } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .maybeSingle()
    .returns<CategoryRow | null>();
  if (!cat) notFound();

  const image: UploadedImageData | null = cat.cover_image_path
    ? {
        storagePath: cat.cover_image_path,
        publicUrl: publicMediaUrl(cat.cover_image_path),
        filename: cat.cover_image_path.split('/').pop() ?? 'category-image',
        size: 0, altText: cat.name, caption: '', title: '', description: '',
      }
    : null;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)' }}>Edit — {cat.name}</h1>
      </div>
      <CategoryEditorForm
        categoryId={cat.id}
        initialImage={image}
        initial={{
          name: cat.name, slug: cat.slug, description: cat.description ?? '',
          featured: cat.featured, status: cat.status, seoTitle: cat.seo_title ?? '', seoDescription: cat.seo_description ?? '',
        }}
      />
    </div>
  );
}
