import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import { NavigationSidebar } from './components/NavigationSidebar';
import { CollapseSidebarButton } from './components/CollapseSidebarButton';
import dynamic from 'next/dynamic';
import { metadata } from './metadata'; // 直接导入元数据
import "./globals.css";

// 动态导入客户端组件
const ClientMainContent = dynamic(() => import('./components/ClientMainContent').then(mod => mod.ClientMainContent), {
  ssr: true,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 重新导出元数据
export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-watercolor-paper`}>
        <div className="flex flex-col min-h-screen">
          {/* 左侧导航 - 在移动设备上隐藏 */}
          <div className="hidden md:block">
            <NavigationSidebar />
          </div>
          
          {/* 折叠按钮 - 独立于导航栏 */}
          <CollapseSidebarButton />
          
          {/* 主内容区 */}
          <ClientMainContent>
            {children}
          </ClientMainContent>
        </div>
      </body>
    </html>
  );
}
