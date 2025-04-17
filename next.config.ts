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
  
  // 配置图片域名 - 设置为不优化以允许所有域名
  images: {
    unoptimized: true,
    // 如果仍需要特定域名的优化，可以保留这些域名
    domains: [
      'images.unsplash.com',
      'images-ext-1.discordapp.net',
      'opengraph.githubassets.com',
      'raw.githubusercontent.com',
      'github.com'
    ]
  },
  
  // 在生产构建时忽略ESLint错误
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
