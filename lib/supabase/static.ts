import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Build-time Supabase client — used only inside generateStaticParams,
 * which runs at build time with no request/cookie context available
 * (the cookie-based client in server.ts requires next/headers' request
 * scope and cannot be used here). Read-only, anon-key access is
 * sufficient since generateStaticParams only needs published slugs.
 */
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  );
}
