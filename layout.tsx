import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import styles from './admin-layout.module.css';

/**
 * Admin layout — wraps every /admin/* page except /admin/login and
 * /admin/reset-password (those render their own full-screen layout).
 * Route protection itself lives in middleware.ts; this layout only reads
 * the user to display their email in the sidebar.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className={styles.shell}>
      <AdminSidebar userEmail={user?.email} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
