import { CategoryEditorForm } from '@/components/admin/CategoryEditorForm';

export default function NewCategoryPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)' }}>New Category</h1>
      </div>
      <CategoryEditorForm />
    </div>
  );
}
