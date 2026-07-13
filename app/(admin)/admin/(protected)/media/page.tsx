import { MediaLibrary } from '@/components/admin/MediaLibrary';

export default function AdminMediaPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)' }}>Media Library</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginTop: 4 }}>
          Every image ever uploaded across every biography, in one place.
        </p>
      </div>
      <MediaLibrary />
    </div>
  );
}
