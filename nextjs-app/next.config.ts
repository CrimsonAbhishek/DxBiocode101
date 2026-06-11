import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
