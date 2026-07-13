import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles ContactForm submissions. Rate limiting + honeypot check happen
 * here (SDD §7.7); actual email delivery provider is not yet chosen —
 * TODO in a later phase.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
  }

  // Honeypot field — bots fill hidden inputs, humans don't.
  if (body.honeypot) {
    return NextResponse.json({ message: 'Rejected.' }, { status: 400 });
  }

  // TODO (later phase): send via chosen email provider, rate-limit by IP.
  return NextResponse.json({ message: 'Received.' }, { status: 200 });
}
