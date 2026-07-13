/**
 * Typed Result wrapper (SDD §7.5). Supabase calls should be wrapped with
 * `toResult` so components render explicit empty/error states instead of
 * relying on thrown exceptions or silent nulls.
 */

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export async function toResult<T>(
  promise: PromiseLike<{ data: T | null; error: { message: string } | null }>,
): Promise<Result<T>> {
  const { data, error } = await promise;
  if (error) return { ok: false, error: error.message };
  if (data === null) return { ok: false, error: 'No data returned.' };
  return { ok: true, data };
}
