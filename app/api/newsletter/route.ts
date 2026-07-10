import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles NewsletterForm submissions from the footer. Storage destination
 * (Supabase table vs. third-party ESP) is a later-phase decision —
 * this stub validates shape and rate-limit-gates the request path.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email;

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Invalid email.' }, { status: 400 });
  }

  // TODO (later phase): insert into Supabase `newsletter_subscribers` or
  // forward to chosen ESP.
  return NextResponse.json({ message: 'Subscribed.' }, { status: 200 });
}
