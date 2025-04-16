"use client";

import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavIcon } from '@/lib/icons';

// 创建一个上下文来管理全局语言状态
import { DEFAULT_LOCALE } from './LanguageSwitcher';

// 支持的语言列表
const SUPPORTED_LOCALES = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
];

// 从浏览器获取首选语言
function getBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  
  // 获取浏览器语言
  const browserLang = navigator.language.split('-')[0];
  
  // 检查是否支持该语言
  const isSupported = SUPPORTED_LOCALES.some(locale => locale.code === browserLang);
  
  // 如果支持，返回浏览器语言，否则返回默认语言
  return isSupported ? browserLang : DEFAULT_LOCALE;
}

export function MobileLanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [locales, setLocales] = useState(SUPPORTED_LOCALES);
  const [open, setOpen] = useState(false);
  
  // 从本地存储加载语言设置或自动检测浏览器语言
  useEffect(() => {
    // 首先尝试从localStorage获取语言设置
    const savedLocale = localStorage.getItem('preferredLanguage');
    
    if (savedLocale) {
      // 使用保存的语言设置
      setCurrentLocale(savedLocale);
    } else {
      // 自动检测浏览器语言
      const browserLocale = getBrowserLanguage();
      setCurrentLocale(browserLocale);
      localStorage.setItem('preferredLanguage', browserLocale);
    }
    
    // 触发一个自定义事件，通知其他组件语言已更改
    window.dispatchEvent(new CustomEvent('localeChanged', { 
      detail: { locale: savedLocale || getBrowserLanguage() } 
    }));
    
    // 尝试从API获取可用语言
    async function fetchLocales() {
      try {
        const response = await fetch('/api/config/site');
        const data = await response.json();
        if (data && data.i18n && data.i18n.locales) {
          setLocales(data.i18n.locales);
        }
      } catch (error) {
        console.error('Failed to load locales:', error);
      }
    }
    
    fetchLocales();
    
    // 监听语言变化
    const handleLocaleChange = (event: CustomEvent) => {
      setCurrentLocale(event.detail.locale);
    };
    
    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
    };
  }, []);
  
  // 获取语言标志
  const languageFlag = locales.find(locale => locale.code === currentLocale)?.flag || '🇨🇳';
  
  const changeLanguage = (locale: string) => {
    // 更新保存的语言
    localStorage.setItem('preferredLanguage', locale);
    
    // 更新当前语言
    setCurrentLocale(locale);
    
    // 分发语言变化事件
    window.dispatchEvent(
      new CustomEvent('localeChanged', {
        detail: { locale }
      })
    );
    
    // 关闭下拉菜单
    setOpen(false);
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center justify-center h-8 w-8 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label="切换语言"
        >
          <span className="text-lg">{languageFlag}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-36 art-paper p-1 shadow-lg"
        align="end"
        forceMount
      >
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => changeLanguage(locale.code)}
            className={`flex items-center gap-2 px-3 py-2 rounded-sm transition-all duration-200 cursor-pointer ${
              locale.code === currentLocale
                ? 'bg-art-highlight text-art-ink font-medium'
                : 'hover:bg-white/80 text-art-pencil hover:text-art-ink'
            }`}
          >
            <span className="text-center">{locale.flag}</span>
            <span>{locale.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 