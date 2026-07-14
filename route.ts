import { NextRequest, NextResponse } from 'next/server';
import { searchLegends } from '@/lib/data/legends';

/**
 * GET /api/search?q=...&page=1&pageSize=10
 * Thin route handler wrapping the data-access layer's searchLegends().
 * Supports pagination so the search overlay (or a future full /search
 * results page) can page through results rather than always returning
 * everything at once.
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') ?? '';
  const page = Math.max(1, Number(request.nextUrl.searchParams.get('page') ?? '1') || 1);
  const pageSize = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get('pageSize') ?? '10') || 10));

  if (!query.trim()) {
    return NextResponse.json({ results: [], total: 0, page, pageSize });
  }

  try {
    const { results, total } = await searchLegends(query, page, pageSize);
    return NextResponse.json({
      results: results.map((l) => ({
        slug: l.slug,
        name: l.name,
        profession: l.profession,
        thumbnail: l.thumbnail,
        nationality: l.nationality,
      })),
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Search failed.' }, { status: 500 });
  }
}
