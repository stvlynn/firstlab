"use client";

import React, { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import { NavigationSidebar } from './components/NavigationSidebar';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { MobileNav } from './components/MobileNav';
import { CollapseSidebarButton } from './components/CollapseSidebarButton';
import { listenToNavStateChanges } from '@/lib/navigation-state';
import { metadata } from './metadata';
import "./globals.css";
import Image from 'next/image';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  
  // 监听导航栏状态变化
  useEffect(() => {
    return listenToNavStateChanges((collapsed) => {
      setIsNavCollapsed(collapsed);
    });
  }, []);
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/firstlab.png" />
        <meta property="og:image" content="/firstlab.png" />
        <meta name="twitter:image" content="/firstlab.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-watercolor-paper`}>
        <div className="flex flex-col min-h-screen">
          {/* 左侧导航 - 在移动设备上隐藏 */}
          <div className="hidden md:block">
            <NavigationSidebar />
          </div>
          
          {/* 折叠按钮 - 独立于导航栏 */}
          <CollapseSidebarButton />
          
          {/* 主内容区 */}
          <main 
            className={`transition-all duration-300 flex-1 ${
              isNavCollapsed ? 'md:ml-16' : 'md:ml-64'
            }`}
          >
            <div className="sticky top-0 z-10 bg-watercolor-paper/80 backdrop-blur-sm flex justify-between items-center p-4 border-b border-art-pencil/5 shadow-sm">
              <div className="flex items-center gap-3">
                <MobileNav />
                <div className="md:hidden flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image 
                      src="/firstlab.png" 
                      alt="First Lab Logo" 
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-xl font-bold">First Lab</span>
                </div>
              </div>
              <div className="flex items-center">
                <LanguageSwitcher />
              </div>
            </div>
            
            <div className="px-4 md:px-8 py-6">
              {children}
            </div>
            
            <footer className="mt-12 py-6 border-t border-art-pencil/10 px-4 md:px-8">
              <div className="text-sm text-art-pencil text-center">
                &copy; {new Date().getFullYear()} First Lab. All rights reserved.
              </div>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
