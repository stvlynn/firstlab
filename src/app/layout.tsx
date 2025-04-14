import React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavigationSidebar } from './components/NavigationSidebar';
import { LanguageSwitcher } from './components/LanguageSwitcher';
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
        <div className="flex">
          {/* 左侧导航 */}
          <NavigationSidebar />
          
          {/* 主内容区 */}
          <main className="flex-1 min-h-screen">
            <div className="flex justify-end p-4">
              <LanguageSwitcher />
            </div>
            
            <div className="px-8 py-4">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
