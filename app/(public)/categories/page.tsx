import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { CategoryCard } from '@/components/cards/CategoryCard';
import { CardGrid } from '@/components/cards/CardGrid';
import { getAllCategories } from '@/lib/data/legends';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Categories',
  description: 'Browse LifeLegends by category — Scientists, Inventors, Freedom Fighters, Artists, and more.',
  path: '/categories',
});

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  return (
    <>
      <SiteHeader activePath="/categories" />
      <main id="main" className={styles.main}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>Explore</span>
          <h1 className={styles.title}>Legends by Category</h1>
          <p className={styles.desc}>
            Ten pillars of human achievement — choose a category to discover the lives that defined it.
          </p>
        </div>
        <CardGrid columns={4}>
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} count={cat.count} />
          ))}
        </CardGrid>
      </main>
      <SiteFooter />
    </>
  );
}
