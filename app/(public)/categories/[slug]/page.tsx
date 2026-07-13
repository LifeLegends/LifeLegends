import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbSchema } from '@/lib/seo/jsonld';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { CategoryDiscovery } from '@/components/cards/CategoryDiscovery';
import { getAllCategories, getLegendsByCategory } from '@/lib/data/legends';
import { createStaticClient } from '@/lib/supabase/static';
import styles from './page.module.css';

interface CategoryStaticParamRow {
  slug: string;
  biography_categories: { count: number }[] | null;
}

/** Pre-render only categories that currently have at least one published biography. */
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('categories')
    .select('slug, biography_categories(count)')
    .eq('status', 'active')
    .returns<CategoryStaticParamRow[]>();
  return (data ?? [])
    .filter((c) => (c.biography_categories?.[0]?.count ?? 0) > 0)
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return buildMetadata({ title: 'Category Not Found', path: `/categories/${slug}`, noIndex: true });
  return buildMetadata({ title: category.name, description: category.description, path: `/categories/${category.slug}` });
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allCategories = await getAllCategories();
  const category = allCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  const legends = await getLegendsByCategory(category.slug);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: category.name, path: `/categories/${category.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteHeader activePath="/categories" />
      <main id="main" className={styles.main}>
        <div className={styles.catHero}>
          <div className={styles.catHeroBg} aria-hidden="true" />
          <div className={styles.catHeroContent}>
            <span className={styles.eyebrow}>Category</span>
            <h1 className={styles.title}>{category.name}</h1>
            <p className={styles.desc}>{category.description}</p>
          </div>
        </div>

        <CategoryDiscovery legends={legends} categories={allCategories} categoryHasContent={category.hasContent} />
      </main>
      <SiteFooter />
    </>
  );
}
