import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Lets a check build use its own folder (NEXT_DIST_DIR=.next-check) without touching the
  // .next folder a running dev server uses.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    remotePatterns: [
      // GoodWe product photos and banners
      { protocol: 'https', hostname: 'en.goodwe.com', pathname: '/Public/Uploads/**' },
      // GoodWe solar panel range (PVBM site)
      { protocol: 'https', hostname: 'en.pvbm.com', pathname: '/Public/Uploads/**' },
      // Installation and lifestyle photos
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
