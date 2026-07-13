import { createClient } from '@/lib/supabase/server';

/**
 * Storage helpers — thin wrappers around Supabase Storage for the three
 * asset categories the CMS manages: biography portraits, gallery images,
 * and category cover images. All live in one 'media' bucket, namespaced
 * by folder, so a single public-read Storage policy covers everything.
 */

const BUCKET = 'media';

export async function uploadImage(file: File, folder: 'portraits' | 'gallery' | 'categories'): Promise<{ path: string; publicUrl: string } | { error: string }> {
  const supabase = createClient();
  const ext = file.name.split('.').pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function replaceImage(oldPath: string, file: File, folder: 'portraits' | 'gallery' | 'categories') {
  const supabase = createClient();
  const uploadResult = await uploadImage(file, folder);
  if ('error' in uploadResult) return uploadResult;

  // Delete the old file only after the new upload succeeds, so a failed
  // upload never leaves the biography pointing at a deleted image.
  await supabase.storage.from(BUCKET).remove([oldPath]);
  return uploadResult;
}

export async function deleteImage(path: string): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) return { error: error.message };
  return {};
}

export function getPublicUrl(path: string): string {
  const supabase = createClient();
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Pure, no-round-trip version of getPublicUrl — Supabase Storage public
 * URLs are deterministic, so building the string directly avoids an API
 * call per image when mapping a whole list of biographies.
 */
export function publicMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path; // already a full URL (e.g. legacy external source)
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}
