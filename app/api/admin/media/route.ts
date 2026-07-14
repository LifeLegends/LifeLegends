import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const FOLDERS = ['portraits', 'gallery', 'categories'] as const;
type MediaFolder = (typeof FOLDERS)[number];

function isMediaFolder(value: string): value is MediaFolder {
  return (FOLDERS as readonly string[]).includes(value);
}

/**
 * GET /api/admin/media?folder=gallery&search=tesla&limit=40&offset=0
 * Lists real files from Supabase Storage (not a mock array). Supports
 * per-folder browsing, substring search (Storage's native `search` option),
 * and offset-based pagination ("Load more" rather than true infinite
 * scroll, which would need a virtualized list — noted as a follow-up).
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const folderParam = request.nextUrl.searchParams.get('folder');
  const search = request.nextUrl.searchParams.get('search') ?? '';
  const limit = Math.min(100, Number(request.nextUrl.searchParams.get('limit') ?? '40') || 40);
  const offset = Math.max(0, Number(request.nextUrl.searchParams.get('offset') ?? '0') || 0);

  const foldersToScan: MediaFolder[] = folderParam && isMediaFolder(folderParam) ? [folderParam] : [...FOLDERS];

  const results = await Promise.all(
    foldersToScan.map(async (folder) => {
      const { data, error } = await supabase.storage.from('media').list(folder, {
        limit,
        offset,
        search: search || undefined,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error || !data) return [];
      return data
        .filter((item) => item.id) // skip placeholder ".emptyFolderPlaceholder" entries
        .map((item) => {
          const path = `${folder}/${item.name}`;
          const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
          return {
            path,
            name: item.name,
            folder,
            publicUrl: urlData.publicUrl,
            size: item.metadata?.size ?? 0,
            contentType: item.metadata?.mimetype ?? '',
            createdAt: item.created_at,
          };
        });
    }),
  );

  const files = results.flat().sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));

  return NextResponse.json({ files });
}
