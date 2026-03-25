import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/rei-lp.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
