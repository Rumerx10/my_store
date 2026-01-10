import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        // hostname: '**', // Allows all HTTPS domains
        pathname: '/product-images/**',
      },
      // Add other domains if needed
    ],
  },
};

export default nextConfig;
