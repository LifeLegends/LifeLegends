import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { deleteBiographyAction, duplicateBiographyAction, setPublishStatusAction } from '@/lib/supabase/biography-actions';
import styles from './page.module.css';

/**
 * Explicit row shape for the partial-column select below. Supabase-js
 * cannot always statically infer a Row type from a hand-written select
 * string against the Database generic, which is what produced the
 * `biographies` array being inferred as `never[]` — the query needs an
 * explicit `.returns<T[]>()` annotation to resolve correctly, matching
 * the pattern already used in lib/data/legends.ts and the other admin
 * list pages.
 */
interface AdminBiographyRow {
  id: string;
  slug: string;
  name: string;
  status: 'draft' | 'published';
  view_count: number;
  updated_at: string;
}

export default async function AdminBiographiesPage() {
  const supabase = createClient();
  const { data: biographies, error } = await supabase
    .from('biographies')
    .select('id, slug, name, status, view_count, updated_at')
    .order('updated_at', { ascending: false })
    .returns<AdminBiographyRow[]>();

  return (
    <div>
      <div className={styles.head}>
        <div>
          <h1>Biographies</h1>
          <p>Create, edit, publish, and organize every legend on the platform.</p>
        </div>
        <Link href="/admin/biographies/new" className={styles.btnGold}>+ New Biography</Link>
      </div>

      {error && <p className={styles.error}>Failed to load biographies: {error.message}</p>}

      {!error && (biographies ?? []).length === 0 && (
        <p className={styles.empty}>No biographies yet. Create the first one, or run supabase/seed.sql against your database.</p>
      )}

      {!error && (biographies ?? []).length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr><th>Name</th><th>Status</th><th>Views</th><th>Updated</th><th /></tr>
          </thead>
          <tbody>
            {(biographies ?? []).map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td><span className={`${styles.badge} ${b.status === 'published' ? styles.published : styles.draft}`}>{b.status}</span></td>
                <td>{b.view_count.toLocaleString()}</td>
                <td className={styles.muted}>{new Date(b.updated_at).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/biographies/${b.id}/edit`} className={styles.actionBtn}>Edit</Link>
                    <form action={async () => { 'use server'; await duplicateBiographyAction(b.id); }}>
                      <button type="submit" className={styles.actionBtn}>Duplicate</button>
                    </form>
                    <form action={async () => {
                      'use server';
                      await setPublishStatusAction(b.id, b.slug, b.status === 'published' ? 'draft' : 'published');
                    }}>
                      <button type="submit" className={styles.actionBtn}>
                        {b.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </form>
                    <form action={async () => { 'use server'; await deleteBiographyAction(b.id, b.slug); }}>
                      <button type="submit" className={styles.actionBtnDanger}>Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
