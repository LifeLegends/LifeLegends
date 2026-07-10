'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface CategoryActionResult {
  error?: string;
  success?: boolean;
  biographyCount?: number;
}

interface CategoryFormShape {
  name: string;
  slug: string;
  description: string;
  coverImagePath: string | null;
  featured: boolean;
  status: 'active' | 'disabled';
  seoTitle: string;
  seoDescription: string;
  ogImagePath: string | null;
}

export async function createCategoryAction(data: CategoryFormShape): Promise<CategoryActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase.from('categories').insert({
    name: data.name,
    slug: data.slug,
    description: data.description,
    cover_image_path: data.coverImagePath,
    featured: data.featured,
    status: data.status,
    seo_title: data.seoTitle || null,
    seo_description: data.seoDescription || null,
    og_image_path: data.ogImagePath,
  });

  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  return { success: true };
}

export async function updateCategoryAction(id: string, data: CategoryFormShape): Promise<CategoryActionResult> {
  const supabase = createClient();
  const { error } = await supabase
    .from('categories')
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description,
      cover_image_path: data.coverImagePath,
      featured: data.featured,
      status: data.status,
      seo_title: data.seoTitle || null,
      seo_description: data.seoDescription || null,
      og_image_path: data.ogImagePath,
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  return { success: true };
}

/** Checks whether biographies reference this category before allowing deletion. */
export async function checkCategoryDeletable(id: string): Promise<CategoryActionResult> {
  const supabase = createClient();
  const { count } = await supabase
    .from('biography_categories')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  return { biographyCount: count ?? 0 };
}

/** Reassigns every biography in `fromCategoryId` to `toCategoryId`, then deletes the empty category. */
export async function reassignAndDeleteCategoryAction(fromCategoryId: string, toCategoryId: string): Promise<CategoryActionResult> {
  const supabase = createClient();

  const { error: reassignError } = await supabase
    .from('biography_categories')
    .update({ category_id: toCategoryId })
    .eq('category_id', fromCategoryId);

  if (reassignError) return { error: reassignError.message };

  const { error: deleteError } = await supabase.from('categories').delete().eq('id', fromCategoryId);
  if (deleteError) return { error: deleteError.message };

  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  return { success: true };
}

/** Deletes a category outright — only safe to call after checkCategoryDeletable confirms 0 biographies. */
export async function deleteCategoryAction(id: string): Promise<CategoryActionResult> {
  const supabase = createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  return { success: true };
}

export async function setCategoryStatusAction(id: string, status: 'active' | 'disabled'): Promise<CategoryActionResult> {
  const supabase = createClient();
  const { error } = await supabase.from('categories').update({ status }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  return { success: true };
}
