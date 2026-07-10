import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { CategoryRowActions } from '@/components/admin/CategoryRowActions';
import styles from './page.module.css';

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, status, featured, created_at, updated_at, biography_categories(count)')
    .order('sort_order');

  return (
    <div>
      <div className={styles.head}>
        <div>
          <h1>Categories</h1>
          <p>Organize biographies into browsable collections.</p>
        </div>
        <Link href="/admin/categories/new" className={styles.btnGold}>+ New Category</Link>
      </div>

      {error && <p className={styles.error}>Failed to load categories: {error.message}</p>}

      {!error && (
        <table className={styles.table}>
          <thead>
            <tr><th>Name</th><th>Slug</th><th>Biographies</th><th>Status</th><th>Updated</th><th /></tr>
          </thead>
          <tbody>
            {(categories ?? []).map((c: any) => (
              <tr key={c.id}>
                <td>{c.name}{c.featured && <span className={styles.featuredBadge}>Featured</span>}</td>
                <td className={styles.muted}>/{c.slug}</td>
                <td>{c.biography_categories?.[0]?.count ?? 0}</td>
                <td><span className={`${styles.badge} ${c.status === 'active' ? styles.active : styles.disabled}`}>{c.status}</span></td>
                <td className={styles.muted}>{new Date(c.updated_at).toLocaleDateString()}</td>
                <td><CategoryRowActions categoryId={c.id} categoryName={c.name} status={c.status} allCategories={(categories ?? []).filter((x: any) => x.id !== c.id).map((x: any) => ({ id: x.id, name: x.name }))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
