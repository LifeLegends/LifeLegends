import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { HeroCinematic } from '@/components/hero/HeroCinematic';
import { LegendCard } from '@/components/cards/LegendCard';
import { CategoryCard } from '@/components/cards/CategoryCard';
import { CardGrid } from '@/components/cards/CardGrid';
import { TrendingRow } from '@/components/cards/TrendingRow';
import { getFeaturedLegends, getTrendingLegends, getAllCategories } from '@/lib/data/legends';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'LifeLegends',
  description:
    'The stories that shape humanity — discover the extraordinary lives of iconic people who changed the world forever.',
  path: '/',
});

/**
 * Homepage — Server Component. Fetches through the data-access layer
 * (lib/data/legends.ts) so this file has zero knowledge of whether data
 * comes from seed content or Supabase. Section order and content match
 * the approved lifelegends-homepage.html prototype exactly.
 *
 * NOTE: Website/Organization JSON-LD is injected once, site-wide, in
 * app/layout.tsx — it must not be re-declared here (previously duplicated,
 * fixed in the Phase 1 production foundation review).
 */
export default async function HomePage() {
  const [featured, trending, categories] = await Promise.all([
    getFeaturedLegends(4),
    getTrendingLegends(5),
    getAllCategories(),
  ]);

  return (
    <>
      <SiteHeader activePath="/" />
      <main id="main">
        <HeroCinematic />

        <section className={styles.section} id="categories">
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>Explore</span>
              <h2 className={styles.sectionTitle}>Legends by Category</h2>
            </div>
          </div>
          <CardGrid columns={4}>
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} count={cat.count} />
            ))}
          </CardGrid>
        </section>

        <section className={styles.section} id="legends">
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>Featured</span>
              <h2 className={styles.sectionTitle}>Trending Personalities</h2>
            </div>
          </div>
          <CardGrid columns={4}>
            {featured.map((legend) => (
              <LegendCard
                key={legend.slug}
                legend={legend}
                categoryLabel={categories.find((c) => c.slug === legend.categorySlug)?.name ?? ''}
              />
            ))}
          </CardGrid>
        </section>

        <section className={styles.section} id="trending">
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>Right Now</span>
              <h2 className={styles.sectionTitle}>Trending Legends</h2>
            </div>
          </div>
          <TrendingRow legends={trending} />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
