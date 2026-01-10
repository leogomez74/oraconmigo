import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Proxy API calls and Sanctum routes to Laravel backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/sanctum/:path*',
        destination: 'http://localhost:8000/sanctum/:path*',
      },
    ];
  },
};

export default nextConfig;
