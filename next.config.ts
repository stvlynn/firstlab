import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 禁用Turbopack
  experimental: {
    turbo: {
      rules: {
        "enabled": false,
      }
    }
  },
  
  // 配置图片域名
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      }
    ]
  },
  
  // 在生产构建时忽略ESLint错误
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
