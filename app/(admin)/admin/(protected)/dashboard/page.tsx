import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';
import styles from './page.module.css';

type RecentBiographyRow = Pick<Database['public']['Tables']['biographies']['Row'], 'name' | 'status' | 'updated_at'>;

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    { count: total },
    { count: published },
    { count: draft },
    { count: categoryCount },
    { data: recent },
  ] = await Promise.all([
    supabase.from('biographies').select('*', { count: 'exact', head: true }),
    supabase.from('biographies').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('biographies').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase
      .from('biographies')
      .select('name, status, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5)
      .returns<RecentBiographyRow[]>(),
  ]);

  return (
    <div>
      <div className={styles.head}>
        <h1>Welcome back 👋</h1>
        <p>Here&apos;s what&apos;s happening with your platform today.</p>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.stat}><div className={styles.lbl}>Total Biographies</div><div className={styles.num}>{total ?? 0}</div></div>
        <div className={styles.stat}><div className={styles.lbl}>Published</div><div className={styles.num}>{published ?? 0}</div></div>
        <div className={styles.stat}><div className={styles.lbl}>Drafts</div><div className={styles.num}>{draft ?? 0}</div></div>
        <div className={styles.stat}><div className={styles.lbl}>Categories</div><div className={styles.num}>{categoryCount ?? 0}</div></div>
      </div>

      <div className={styles.panel}>
        <h3>Recently Updated</h3>
        {(recent ?? []).length === 0 ? (
          <p className={styles.empty}>No biographies yet — create the first one from the Biographies tab.</p>
        ) : (
          <div>
            {recent!.map((r) => (
              <div key={r.name} className={styles.activityItem}>
                <span>{r.name}</span>
                <span className={styles.muted}>{r.status} · {new Date(r.updated_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
