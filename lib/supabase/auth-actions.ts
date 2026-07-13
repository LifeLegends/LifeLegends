'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Server Actions for authentication. These run on the server, so the
 * Supabase service call and cookie-setting happen in one trusted place —
 * no admin credential logic ever ships to the client bundle.
 */

export interface AuthActionResult {
  error?: string;
}

export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/admin/dashboard');

  if (!email || !password) return { error: 'Email and password are required.' };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect(next || '/admin/dashboard');
}

export async function signOutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}

export async function requestPasswordResetAction(formData: FormData): Promise<AuthActionResult> {
  const email = String(formData.get('email') ?? '');
  if (!email) return { error: 'Email is required.' };

  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/admin/reset-password/confirm`,
  });

  if (error) return { error: error.message };
  return {};
}

export async function updatePasswordAction(formData: FormData): Promise<AuthActionResult> {
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };
  if (password !== confirmPassword) return { error: 'Passwords do not match.' };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };

  redirect('/admin/dashboard');
}
