import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/rei-lp.html',
      },
    ];
  },
};

export default nextConfig;
