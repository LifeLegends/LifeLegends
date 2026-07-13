import { requestPasswordResetAction } from '@/lib/supabase/auth-actions';
import styles from '../login/page.module.css';

export default async function ResetPasswordRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  async function handleSubmit(formData: FormData) {
    'use server';
    const { redirect } = await import('next/navigation');
    const result = await requestPasswordResetAction(formData);
    if (result?.error) redirect(`/admin/reset-password?error=${encodeURIComponent(result.error)}`);
    redirect('/admin/reset-password?sent=1');
  }

  return (
    <div className={styles.screen}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.card}>
        <div className={styles.logo}>LIFELEGENDS</div>
        <p className={styles.sub}>Reset your password</p>

        {sent ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem', textAlign: 'center' }}>
            If an account exists for that email, a reset link has been sent.
          </p>
        ) : (
          <form action={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <button type="submit" className={styles.btn}>Send Reset Link</button>
          </form>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
