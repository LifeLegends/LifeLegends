import { SITE_NAME, SITE_URL } from './metadata';

/**
 * JSON-LD builders (SDD §7.8). Each returns a plain object — render it via
 * <script type="application/ld+json"> in components/system/SEOHead, or
 * directly in a page's <head> during Phase 2+. No UI is emitted here.
 */

export function buildPersonSchema(legend: {
  name: string;
  description: string;
  imageUrl: string;
  birthYear?: number;
  deathYear?: number;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: legend.name,
    description: legend.description,
    image: legend.imageUrl,
    ...(legend.birthYear && { birthDate: `${legend.birthYear}` }),
    ...(legend.deathYear && { deathDate: `${legend.deathYear}` }),
    ...(legend.sameAs && { sameAs: legend.sameAs }),
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
  };
}

export function buildFaqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
