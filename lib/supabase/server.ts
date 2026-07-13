/**
 * Server-side Supabase client for Server Components, Route Handlers, and
 * Server Actions. Uses the anon key + cookie-based session by default;
 * the service-role key (server-only, never exposed to the client) is
 * reserved for admin write paths behind auth — see SDD §7.7 Security.
 *
 * Every request uses a bounded fetch timeout (8s). Without this, a
 * misconfigured or unreachable Supabase project (wrong URL, project
 * paused, DNS failure) causes the underlying fetch to hang with no
 * default timeout — which is exactly what produces an infinitely
 * loading homepage. Fixed here at the client level, once, rather than
 * in every call site.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

const FETCH_TIMEOUT_MS = 8000;

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
}

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      global: {
        fetch: fetchWithTimeout,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component with no response to write to —
            // safe to ignore when middleware handles session refresh.
          }
        },
      },
    },
  );
}
