"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { NavIcon } from '@/lib/icons';
import { motion } from 'framer-motion';
import { getLocaleText } from '@/lib/yaml';
import { DEFAULT_LOCALE } from './LanguageSwitcher';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [siteConfig, setSiteConfig] = useState<any>(null);

  // 加载配置和语言
  useEffect(() => {
    // 从localStorage获取语言设置
    const savedLocale = localStorage.getItem('preferredLanguage');
    if (savedLocale) {
      setCurrentLocale(savedLocale);
    }
    
    // 添加语言更改事件监听器
    const handleLocaleChange = (event: CustomEvent) => {
      setCurrentLocale(event.detail.locale);
    };
    
    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    
    // 加载站点配置
    async function fetchSiteConfig() {
      try {
        const response = await fetch('/api/config/site');
        const data = await response.json();
        setSiteConfig(data);
      } catch (error) {
        console.error('Failed to load site config:', error);
      }
    }
    
    fetchSiteConfig();
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
    };
  }, []);

  // 未加载完成时不显示内容
  if (!siteConfig) {
    return (
      <button 
        className="md:hidden flex items-center justify-center h-10 w-10 rounded-md border border-art-pencil/10 bg-white/80"
        aria-label="加载中"
        disabled
      >
        <span className="animate-pulse">...</span>
      </button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button 
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-md border border-art-pencil/10 bg-white/80"
          aria-label="打开导航菜单"
        >
          <NavIcon id="menu" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="art-paper">
        <div className="flex flex-col h-full">
          <div className="mb-8 pt-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-art-ink transition-transform hover:scale-105"
              onClick={() => setOpen(false)}
            >
              <div className="relative flex-shrink-0 w-8 h-8">
                <Image 
                  src="/firstlab.png" 
                  alt="First Lab Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold">First Lab</span>
            </Link>
          </div>
          
          <nav className="space-y-6 flex-1">
            <ul className="space-y-2">
              {siteConfig?.navigation?.main?.map((item: any, i: number) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 py-3 px-2 rounded-md transition-all ${
                      pathname === item.path
                        ? 'bg-art-highlight/20 text-primary font-medium'
                        : 'text-art-ink hover:bg-white/80'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <NavIcon id={item.id} className={pathname === item.path ? 'text-primary' : ''} />
                    <span>{getLocaleText(item.name, currentLocale)}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          
          <div className="py-6 mt-auto border-t border-art-pencil/10">
            {siteConfig?.site?.discord && (
              <a
                href={siteConfig.site.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2 px-4 bg-[#5865F2] text-white rounded-md transition-all hover:bg-[#4a56e3]"
              >
                <NavIcon id="discord" className="text-white" />
                <span>
                  {currentLocale === 'zh' ? '加入 Discord' : 
                  currentLocale === 'ja' ? 'Discord に参加' : 'Join Discord'}
                </span>
              </a>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 