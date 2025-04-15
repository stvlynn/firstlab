import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 将turbo选项移除，正确配置Next.js
  experimental: {
    // 确保正确配置
  },
  
  // 配置图片域名
  images: {
    domains: ['images.unsplash.com']
  }
};

export default nextConfig;
