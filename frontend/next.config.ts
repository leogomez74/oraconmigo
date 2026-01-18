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
      // Admin panel (Laravel + Inertia)
      {
        source: '/login',
        destination: `${backendUrl}/login`,
      },
      {
        source: '/admin/:path*',
        destination: `${backendUrl}/admin/:path*`,
      },
      // Vite-built assets served by Laravel (required for /login and /admin)
      {
        source: '/build/:path*',
        destination: `${backendUrl}/build/:path*`,
      },
    ];
  },
};

export default nextConfig;
