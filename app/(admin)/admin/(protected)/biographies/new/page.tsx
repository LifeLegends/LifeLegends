import { BiographyEditorForm } from '@/components/admin/BiographyEditorForm';

export default function NewBiographyPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)' }}>New Biography</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginTop: 4 }}>Fill in content, upload media, then save as a draft or publish.</p>
      </div>
      <BiographyEditorForm />
    </div>
  );
}
