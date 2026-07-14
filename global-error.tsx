'use client';

import { useEffect } from 'react';

/**
 * Root error boundary (Next.js App Router convention). Catches any
 * unhandled error thrown by a Server or Client Component in the tree and
 * renders an on-brand fallback instead of Next's default error overlay.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: '#05050A', color: '#F5F3EE', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 420, padding: '0 24px' }}>
          <p style={{ fontSize: '.75rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#D4AF6A', marginBottom: 16 }}>
            Something went wrong
          </p>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 16 }}>This page hit an unexpected error.</h1>
          <p style={{ color: '#A6A4B5', marginBottom: 32, fontSize: '.9rem' }}>
            Our team preserves every legend carefully — this was just a technical hiccup, not lost content.
          </p>
          <button
            onClick={reset}
            style={{ padding: '14px 32px', borderRadius: 999, border: '1px solid #D4AF6A', color: '#F5F3EE', background: 'none', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
