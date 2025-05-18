import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/lumx/:path*',
        destination: `${process.env.NEXT_PUBLIC_LUMX_API_URL}/:path*`,
        ignoreDuringBuilds: true,
      },
    ];
  },
};

export default nextConfig;
