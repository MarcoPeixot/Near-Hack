import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {
    // ATENÇÃO: Isso permite que builds de produção sejam concluídos
    // mesmo que seu projeto tenha erros de ESLint.
    ignoreDuringBuilds: true,
  },
  
  async rewrites() {
    return [
      {
        source: '/api/lumx/:path*',
        destination: `${process.env.NEXT_PUBLIC_LUMX_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
