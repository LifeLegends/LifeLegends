import type { Metadata } from 'next';

const SITE_NAME = 'LifeLegends';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lifelegends.example';
const DEFAULT_DESCRIPTION =
  'The stories that shape humanity — discover the extraordinary lives of iconic people who changed the world forever.';

interface BuildMetadataArgs {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Central metadata builder used by every page's `generateMetadata`, so
 * title templating, canonical URLs and OG/Twitter defaults never drift
 * between pages (SDD §7.8).
 */
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  ogImage,
  noIndex = false,
}: BuildMetadataArgs): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage ?? `${SITE_URL}/og-default.jpg`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export { SITE_NAME, SITE_URL };
