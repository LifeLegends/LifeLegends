/**
 * SEOHead — not a rendered component. Next.js App Router pages export a
 * `generateMetadata` function (using lib/seo/metadata.ts) instead of
 * rendering a <head> component directly; this file re-exports the JSON-LD
 * builders for pages to use inline via <script type="application/ld+json">.
 */
export { buildPersonSchema, buildBreadcrumbSchema, buildWebsiteSchema, buildOrganizationSchema } from '@/lib/seo/jsonld';
