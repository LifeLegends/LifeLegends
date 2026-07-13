/**
 * Canonical domain model for LifeLegends.
 *
 * This file is the single source of truth for content shape across the
 * entire app. Components, the data-access layer (lib/data/legends.ts),
 * and — eventually — the Supabase schema all conform to these types.
 * Nothing should redeclare an inline shape that duplicates one of these.
 */

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}

export interface Achievement {
  counter: number | string;
  title: string;
  description: string;
}

export interface Fact {
  summary: string;
  expand: string;
}

export interface Source {
  name: string;
  description: string;
  url?: string;
}

export interface Quote {
  text: string;
  attribution: string;
  /** Marks the single quote shown in the biography page's QuoteBlock. */
  featured?: boolean;
}

export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface SEOMetadata {
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  ogImage: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  /** False when no published biographies exist yet — drives the "Coming Soon" state. */
  hasContent: boolean;
  /** Real published-biography count for this category, for card display. */
  count: number;
}

/** Minimal shape used for related-legend / card references, without the full biography body. */
export interface RelatedLegendRef {
  slug: string;
  name: string;
  profession: string;
  thumbnail: string;
}

export interface Biography {
  slug: string;
  name: string;
  roles: string[];
  birthYear: number;
  deathYear: number;
  nationality: string;
  profession: string;
  tagline: string;
  intro: string;
  heroImage: string;
  heroImageAlt: string;
  heroImageCaption?: string;
  thumbnail: string;
  categorySlug: string;
  featured: boolean;
  viewCount: number;
  status: 'draft' | 'published';

  overviewTitle: string;
  overview: string[];
  fullBiography: string;
  stats: { value: number | string; label: string }[];

  timeline: TimelineEvent[];
  achievements: Achievement[];
  quotes: Quote[];
  gallery: GalleryImage[];
  facts: Fact[];
  sources: Source[];

  seo: SEOMetadata;
}
