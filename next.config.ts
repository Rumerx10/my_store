import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Lets a check build use its own folder (NEXT_DIST_DIR=.next-check) without touching the
  // .next folder a running dev server uses.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // The seller centre moved from /next-power/admin to /admin/<store>, shared by every store.
  // Old bookmarks and links still land on NextPower's pages there.
  async redirects() {
    return [
      { source: '/next-power/admin', destination: '/admin/next-power', permanent: false },
      {
        source: '/next-power/admin/:path*',
        destination: '/admin/next-power/:path*',
        permanent: false,
      },
      {
        source: '/next-power/print/:path*',
        destination: '/admin/next-power/print/:path*',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      // GoodWe product photos and banners
      { protocol: 'https', hostname: 'en.goodwe.com', pathname: '/Public/Uploads/**' },
      // GoodWe solar panel range (PVBM site)
      { protocol: 'https', hostname: 'en.pvbm.com', pathname: '/Public/Uploads/**' },
      // Installation and lifestyle photos
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // Images uploaded to the API (review photos, product images)
      ...(() => {
        const api = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1');
        return [
          {
            protocol: api.protocol.replace(':', '') as 'http' | 'https',
            hostname: api.hostname,
            port: api.port,
            pathname: '/api/v1/uploads/**',
          },
        ];
      })(),
    ],
  },
};

export default nextConfig;
