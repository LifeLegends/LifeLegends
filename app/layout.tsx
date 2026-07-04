import type { Metadata } from 'next';
import { fontVariables } from '@/lib/fonts';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildWebsiteSchema, buildOrganizationSchema } from '@/lib/seo/jsonld';
import { MotionProvider } from '@/lib/providers/MotionProvider';
import '@/styles/globals.css';

/**
 * Root layout — infrastructure only. No homepage/marketing content lives
 * here; that's Phase 2. This file is responsible for:
 *   - font variables on <html>
 *   - global stylesheet
 *   - default site-wide metadata + root JSON-LD (WebSite/Organization)
 *   - the app-wide MotionProvider (Lenis + reduced-motion + device tier)
 *   - the skip-to-content link (accessibility)
 */

export const metadata: Metadata = buildMetadata({
  title: 'LifeLegends',
  description:
    'The stories that shape humanity — discover the extraordinary lives of iconic people who changed the world forever.',
  path: '/',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteSchema = buildWebsiteSchema();
  const organizationSchema = buildOrganizationSchema();

  return (
    <html lang="en" className={fontVariables}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <MotionProvider>
          {/* SiteHeader / SiteFooter / CustomCursor / LoadingSequence are
              wired in during Phase 2 once there is a homepage to frame. */}
          <main id="main-content">{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}
