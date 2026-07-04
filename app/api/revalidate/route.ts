import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Called by a Supabase webhook (or the admin LegendEditor) after a
 * publish/edit, to revalidate just the affected biography page instead
 * of a full site rebuild (SDD §7.2).
 *
 * Expects: POST { slug: string, secret: string }
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.secret || body.secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret.' }, { status: 401 });
  }

  if (!body?.slug || typeof body.slug !== 'string') {
    return NextResponse.json({ message: 'Missing slug.' }, { status: 400 });
  }

  revalidatePath(`/legends/${body.slug}`);
  return NextResponse.json({ revalidated: true, slug: body.slug });
}
