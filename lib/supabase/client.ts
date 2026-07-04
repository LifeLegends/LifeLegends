/**
 * Browser-side Supabase client. Reads public env vars only — never the
 * service role key. Real project URL/anon key are not yet provisioned;
 * see .env.example. Safe to import from any client component once those
 * values are filled in.
 */
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  );
}
