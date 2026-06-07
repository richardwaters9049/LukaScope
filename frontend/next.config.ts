import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

    return [
      {
        source: '/backend-api/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        source: '/backend-assets/:path*',
        destination: `${backendUrl}/assets/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3001', pathname: '/assets/**' },
      { protocol: 'http', hostname: 'python-backend', port: '3001', pathname: '/assets/**' },
    ],
  },
};

export default nextConfig;
