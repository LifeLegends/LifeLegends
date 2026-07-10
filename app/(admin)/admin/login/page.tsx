import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signInAction } from '@/lib/supabase/auth-actions';
import styles from './page.module.css';

export default function AdminLoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  async function handleSubmit(formData: FormData) {
    'use server';
    if (searchParams.next) formData.set('next', searchParams.next);
    const result = await signInAction(formData);
    if (result?.error) {
      redirect(`/admin/login?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.card}>
        <div className={styles.logo}>LIFELEGENDS</div>
        <p className={styles.sub}>Admin Console</p>

        <form action={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          <button type="submit" className={styles.btn}>Sign In</button>
        </form>

        {searchParams.error && <p className={styles.error}>{searchParams.error}</p>}

        <Link href="/admin/reset-password" className={styles.forgot}>Forgot password?</Link>
      </div>
    </div>
  );
}
