"use client"

import React, { useState, useEffect } from 'react';
import { listenToNavStateChanges } from '@/lib/navigation-state';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import Image from 'next/image';

export function ClientMainContent({ children }: { children: React.ReactNode }) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  
  // 监听导航栏状态变化
  useEffect(() => {
    return listenToNavStateChanges((collapsed) => {
      setIsNavCollapsed(collapsed);
    });
  }, []);

  return (
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
        <div className="flex items-center z-20">
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
  );
} 