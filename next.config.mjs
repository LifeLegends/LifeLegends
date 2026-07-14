/**
 * PWA support is implemented manually (public/sw.js + lib/pwa/registerServiceWorker.ts)
 * instead of via the `next-pwa` package. `next-pwa` (last published years ago)
 * has known incompatibilities with Next.js 15's webpack/Turbopack pipeline
 * and is a common source of production build failures. A hand-rolled
 * service worker is a few lines of code and has zero build-time risk.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
        pathname: '/wiki/Special:FilePath/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['gsap', 'framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
