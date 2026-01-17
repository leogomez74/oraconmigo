import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Proxy API calls and Sanctum routes to Laravel backend
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/sanctum/:path*',
        destination: `${backendUrl}/sanctum/:path*`,
      },
    ];
  },
};

export default nextConfig;
