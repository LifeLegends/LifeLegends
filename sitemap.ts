import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/metadata';

/**
 * Next.js App Router sitemap convention. Static routes are listed now;
 * published legend/category slugs will be appended here once Supabase
 * queries exist (Phase 5) — this file's shape does not need to change,
 * only the data source inside it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  // TODO (Phase 5): fetch published legends + categories from Supabase and
  // append `{ url: `${SITE_URL}/legends/${slug}`, ... }` entries here.

  return staticRoutes;
}
