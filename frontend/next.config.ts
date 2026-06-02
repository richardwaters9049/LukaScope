import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3001', pathname: '/assets/**' },
      { protocol: 'http', hostname: 'python-backend', port: '3001', pathname: '/assets/**' },
    ],
  },
};

export default nextConfig;
