import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { marked } from 'marked';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildPersonSchema, buildBreadcrumbSchema } from '@/lib/seo/jsonld';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BioHero } from '@/components/bio/BioHero';
import { BioStatStrip } from '@/components/bio/BioStatStrip';
import { BioTimeline } from '@/components/bio/BioTimeline';
import { BioTimelineNav } from '@/components/bio/BioTimelineNav';
import { BioQuoteBlock } from '@/components/bio/BioQuoteBlock';
import { BioGallery } from '@/components/bio/BioGallery';
import { BioFacts } from '@/components/bio/BioFacts';
import { BioSources } from '@/components/bio/BioSources';
import { RelatedLegends } from '@/components/bio/RelatedLegends';
import { ReadingProgressBar } from '@/components/bio/ReadingProgressBar';
import { BookmarkButton } from '@/components/bio/BookmarkButton';
import { ShareButtons } from '@/components/bio/ShareButtons';
import {
  getLegendBySlug,
  getAdjacentLegends,
  getRelatedLegends,
  getAllCategories,
} from '@/lib/data/legends';
import { createStaticClient } from '@/lib/supabase/static';
import { estimateReadingMinutes } from '@/lib/utils';
import styles from './page.module.css';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'full-biography', label: 'Full Story' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'facts', label: 'Facts' },
  { id: 'related', label: 'Related' },
  { id: 'sources', label: 'Sources' },
];

/** Pre-render every published legend at build time (SSG, per SDD §7.2). */
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from('biographies').select('slug').eq('status', 'published');
  return (data ?? []).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const legend = await getLegendBySlug(params.slug);
  if (!legend) return buildMetadata({ title: 'Legend Not Found', path: `/legends/${params.slug}`, noIndex: true });

  return buildMetadata({
    title: legend.name,
    description: legend.intro,
    path: `/legends/${legend.slug}`,
    ogImage: legend.heroImage,
  });
}

export default async function BiographyPage({ params }: { params: { slug: string } }) {
  const legend = await getLegendBySlug(params.slug);
  if (!legend) notFound();

  const [adjacent, related, categories] = await Promise.all([
    getAdjacentLegends(legend.slug),
    getRelatedLegends(legend.slug, legend.categorySlug, 4),
    getAllCategories(),
  ]);

  const readTimeMinutes = estimateReadingMinutes(legend.overview.join(' '));
  const featuredQuote = legend.quotes.find((q) => q.featured) ?? legend.quotes[0];

  const personSchema = buildPersonSchema({
    name: legend.name,
    description: legend.intro,
    imageUrl: legend.heroImage,
    birthYear: legend.birthYear,
    deathYear: legend.deathYear,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Legends', path: '/legends' },
    { name: legend.name, path: `/legends/${legend.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ReadingProgressBar />

      <header className={styles.miniHeader}>
        <Link href="/legends" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
          Back
        </Link>
        <div className={styles.headerActions}>
          <BookmarkButton legendSlug={legend.slug} />
          <ShareButtons title={legend.name} />
        </div>
      </header>

      <BioHero legend={legend} readTimeMinutes={readTimeMinutes} />

      <div className={styles.container}>
        <div className={styles.layout}>
          <main id="main">
            <section className={styles.section} id="overview">
              <span className={styles.eyebrow}>Overview</span>
              <h2 className={styles.sectionTitle}>{legend.overviewTitle}</h2>
              <div className={styles.overviewGrid}>
                <div className={styles.overviewText}>
                  {legend.overview.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
                </div>
                <BioStatStrip stats={legend.stats.map((s) => ({ value: s.value, label: s.label }))} />
              </div>
            </section>

            {legend.fullBiography?.trim() && (
              <section className={styles.section} id="full-biography">
                <span className={styles.eyebrow}>The Full Story</span>
                <h2 className={styles.sectionTitle}>Biography</h2>
                <div
                  className={styles.fullBiographyContent}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: marked.parse(legend.fullBiography) as string }}
                />
              </section>
            )}

            <section className={styles.section} id="timeline">
              <span className={styles.eyebrow}>A Timeline of Greatness</span>
              <h2 className={styles.sectionTitle}>Life Journey</h2>
              <BioTimeline events={legend.timeline} />
            </section>

            <section className={styles.section} id="achievements">
              <span className={styles.eyebrow}>Legacy</span>
              <h2 className={styles.sectionTitle}>Achievements</h2>
              <div className={styles.achieveGrid}>
                {legend.achievements.map((a) => (
                  <div key={a.title} className={styles.achieveCard}>
                    <div className={styles.achieveCounter}>{a.counter}</div>
                    <div className={styles.achieveTitle}>{a.title}</div>
                    <div className={styles.achieveDesc}>{a.description}</div>
                  </div>
                ))}
              </div>
            </section>

            {featuredQuote && <BioQuoteBlock quote={featuredQuote.text} attribution={featuredQuote.attribution} />}

            <section className={styles.section} id="gallery">
              <span className={styles.eyebrow}>Visual Archive</span>
              <h2 className={styles.sectionTitle}>Gallery</h2>
              <BioGallery images={legend.gallery} legendName={legend.name} />
            </section>

            <section className={styles.section} id="facts">
              <span className={styles.eyebrow}>Did You Know</span>
              <h2 className={styles.sectionTitle}>Interesting Facts</h2>
              <BioFacts facts={legend.facts} />
            </section>

            <section className={styles.section} id="related">
              <span className={styles.eyebrow}>Continue Exploring</span>
              <h2 className={styles.sectionTitle}>Related Legends</h2>
              <RelatedLegends legends={related} categories={categories} />
            </section>

            <section className={styles.section} id="sources" style={{ borderBottom: 'none' }}>
              <span className={styles.eyebrow}>References</span>
              <h2 className={styles.sectionTitle}>Sources</h2>
              <BioSources sources={legend.sources} />
            </section>
          </main>

          <BioTimelineNav sections={SECTIONS} />
        </div>
      </div>

      <div className={styles.container} style={{ padding: '60px 48px 20px' }}>
        <div className={styles.prevNextRow}>
          {adjacent ? (
            <>
              <Link href={`/legends/${adjacent.prev.slug}`} className={`${styles.pnCard} ${styles.pnPrev}`}>
                <span className={styles.pnLabel}>‹ Previous Legend</span>
                <span className={styles.pnName}>{adjacent.prev.name}</span>
              </Link>
              <Link href="/legends" className={`${styles.pnCard} ${styles.pnAll}`}>
                <span className={styles.pnLabel}>All Legends</span>
              </Link>
              <Link href={`/legends/${adjacent.next.slug}`} className={`${styles.pnCard} ${styles.pnNext}`}>
                <span className={styles.pnLabel}>Next Legend ›</span>
                <span className={styles.pnName}>{adjacent.next.name}</span>
              </Link>
            </>
          ) : (
            <Link href="/legends" className={`${styles.pnCard} ${styles.pnAll}`} style={{ gridColumn: '1 / -1' }}>
              <span className={styles.pnLabel}>Browse All Legends</span>
            </Link>
          )}
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
