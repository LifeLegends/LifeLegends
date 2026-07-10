'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  checkCategoryDeletable,
  deleteCategoryAction,
  reassignAndDeleteCategoryAction,
  setCategoryStatusAction,
} from '@/lib/supabase/category-actions';
import styles from './CategoryRowActions.module.css';

export interface CategoryRowActionsProps {
  categoryId: string;
  categoryName: string;
  status: 'active' | 'disabled';
  allCategories: { id: string; name: string }[];
}

/**
 * CategoryRowActions — implements the exact delete flow requested:
 * checks for dependent biographies first; if any exist, shows
 * "This category contains biographies" and requires picking a
 * replacement category before deleting, rather than blocking outright.
 */
export function CategoryRowActions({ categoryId, categoryName, status, allCategories }: CategoryRowActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [biographyCount, setBiographyCount] = useState<number | null>(null);
  const [targetCategory, setTargetCategory] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleDeleteClick() {
    setBusy(true);
    const result = await checkCategoryDeletable(categoryId);
    setBusy(false);
    setBiographyCount(result.biographyCount ?? 0);
    setDialogOpen(true);
  }

  async function confirmDelete() {
    setBusy(true);
    setError('');
    const result =
      biographyCount && biographyCount > 0
        ? await reassignAndDeleteCategoryAction(categoryId, targetCategory)
        : await deleteCategoryAction(categoryId);
    setBusy(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setDialogOpen(false);
  }

  async function toggleStatus() {
    await setCategoryStatusAction(categoryId, status === 'active' ? 'disabled' : 'active');
  }

  return (
    <>
      <div className={styles.actions}>
        <Link href={`/admin/categories/${categoryId}/edit`} className={styles.actionBtn}>Edit</Link>
        <button type="button" className={styles.actionBtn} onClick={toggleStatus}>
          {status === 'active' ? 'Disable' : 'Enable'}
        </button>
        <button type="button" className={styles.actionBtnDanger} onClick={handleDeleteClick} disabled={busy}>Delete</button>
      </div>

      {dialogOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.dialog}>
            {biographyCount && biographyCount > 0 ? (
              <>
                <h3>This category contains biographies</h3>
                <p>{biographyCount} {biographyCount === 1 ? 'biography uses' : 'biographies use'} &ldquo;{categoryName}&rdquo;. Choose where to move {biographyCount === 1 ? 'it' : 'them'} before deleting this category.</p>
                <select value={targetCategory} onChange={(e) => setTargetCategory(e.target.value)} className={styles.select}>
                  <option value="">Select a category…</option>
                  {allCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </>
            ) : (
              <>
                <h3>Delete &ldquo;{categoryName}&rdquo;?</h3>
                <p>This category has no biographies and can be safely deleted.</p>
              </>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.dialogActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setDialogOpen(false)}>Cancel</button>
              <button
                type="button"
                className={styles.confirmBtn}
                onClick={confirmDelete}
                disabled={busy || (!!biographyCount && biographyCount > 0 && !targetCategory)}
              >
                {busy ? 'Deleting…' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CategoryRowActions;
