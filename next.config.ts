import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // 禁用 Turbopack
    turbo: {
      enabled: false
    }
  }
};

export default nextConfig;
