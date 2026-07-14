import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

/**
 * POST /api/admin/upload
 * Accepts multipart/form-data: { file: File, folder: 'portraits'|'gallery'|'categories' }
 * Validates type/size server-side (never trust client-side checks alone),
 * uploads to the 'media' Supabase Storage bucket, and returns the public
 * URL + basic file metadata. Requires an authenticated admin session —
 * enforced both here and by Storage RLS policies (0003_storage_policies.sql).
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 });
  }

  const file = formData.get('file');
  const folder = String(formData.get('folder') ?? 'gallery');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }
  if (!['portraits', 'gallery', 'categories'].includes(folder)) {
    return NextResponse.json({ error: 'Invalid folder.' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported format "${file.type}". Please upload JPG, PNG, WEBP, or AVIF.` }, { status: 415 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: `Image is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 20MB.` }, { status: 413 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(path);

  return NextResponse.json({
    storagePath: path,
    publicUrl: publicUrlData.publicUrl,
    filename: file.name,
    size: file.size,
    contentType: file.type,
  });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { path } = await request.json();
  if (!path) return NextResponse.json({ error: 'No path provided.' }, { status: 400 });

  const { error } = await supabase.storage.from('media').remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
