/**
 * Environment variable validation. Imported once from the root layout so
 * a missing/misconfigured env var fails loudly and immediately at server
 * startup, instead of surfacing later as a cryptic Supabase network error
 * deep in a random page.
 */

const REQUIRED_PUBLIC_VARS = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SITE_URL'] as const;

function validateEnv() {
  const missing = REQUIRED_PUBLIC_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const message = [
      '',
      '⚠️  LifeLegends: missing required environment variables:',
      ...missing.map((key) => `   - ${key}`),
      '',
      '   Copy .env.example to .env.local and fill in your Supabase project',
      '   details (Project Settings → API in the Supabase dashboard).',
      '',
    ].join('\n');

    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    } else {
      // eslint-disable-next-line no-console
      console.warn(message);
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url && !url.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a full https:// URL (e.g. https://xxxx.supabase.co).');
  }
}

validateEnv();

export {};
