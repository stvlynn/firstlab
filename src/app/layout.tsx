import React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavigationSidebar } from './components/NavigationSidebar';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { MobileNav } from './components/MobileNav';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "First Lab",
  description: "First Lab - 学习资源和工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-watercolor-paper`}>
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* 左侧导航 - 在移动设备上隐藏 */}
          <div className="hidden md:block">
            <NavigationSidebar />
          </div>
          
          {/* 主内容区 */}
          <main className="flex-1">
            <div className="sticky top-0 z-10 bg-watercolor-paper/80 backdrop-blur-sm flex justify-between items-center p-4 border-b border-art-pencil/5 shadow-sm">
              <div className="md:hidden text-2xl font-bold">First Lab</div>
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
