'use client';

import { useEffect } from 'react';

/**
 * Registers public/sw.js on mount. Client Component mounted once in the
 * root layout. Silently no-ops if service workers aren't supported
 * (older browsers) or registration fails (e.g. in a sandboxed preview
 * environment) — a broken/absent service worker should never block the
 * app from working.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Service worker registration failed:', err);
    });
  }, []);

  return null;
}

export default RegisterServiceWorker;
