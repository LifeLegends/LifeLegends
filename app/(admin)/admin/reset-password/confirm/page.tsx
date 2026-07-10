import { redirect } from 'next/navigation';
import { updatePasswordAction } from '@/lib/supabase/auth-actions';
import styles from '../../login/page.module.css';

/**
 * Landed on via the Supabase password-reset email link, which exchanges a
 * recovery token for a session automatically (handled by @supabase/ssr's
 * cookie-based flow) before this page renders.
 */
export default function ResetPasswordConfirmPage({ searchParams }: { searchParams: { error?: string } }) {
  async function handleSubmit(formData: FormData) {
    'use server';
    const result = await updatePasswordAction(formData);
    if (result?.error) redirect(`/admin/reset-password/confirm?error=${encodeURIComponent(result.error)}`);
  }

  return (
    <div className={styles.screen}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.card}>
        <div className={styles.logo}>LIFELEGENDS</div>
        <p className={styles.sub}>Set a new password</p>

        <form action={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="password">New Password</label>
            <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
          </div>
          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" />
          </div>
          <button type="submit" className={styles.btn}>Update Password</button>
        </form>

        {searchParams.error && <p className={styles.error}>{searchParams.error}</p>}
      </div>
    </div>
  );
}
