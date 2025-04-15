"use client";

import React, { useState, useEffect } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// 创建一个上下文来管理全局语言状态
export const DEFAULT_LOCALE = 'zh';

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [locales, setLocales] = useState([
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ]);
  
  // 从本地存储加载语言设置
  useEffect(() => {
    // 从localStorage获取语言设置
    const savedLocale = localStorage.getItem('preferredLanguage');
    if (savedLocale) {
      setCurrentLocale(savedLocale);
      // 触发一个自定义事件，通知其他组件语言已更改
      window.dispatchEvent(new CustomEvent('localeChanged', { 
        detail: { locale: savedLocale } 
      }));
    }
    
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
  }, []);
  
  // 切换语言
  const changeLanguage = (locale: string) => {
    setCurrentLocale(locale);
    localStorage.setItem('preferredLanguage', locale);
    
    // 触发一个自定义事件，通知其他组件语言已更改
    window.dispatchEvent(new CustomEvent('localeChanged', { 
      detail: { locale } 
    }));
  };
  
  // 获取当前语言的名称和标志
  const currentLanguage = locales.find(locale => locale.code === currentLocale);
  const languageName = currentLanguage?.name || '中文';
  const languageFlag = currentLanguage?.flag || '🇨🇳';
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-art-ink bg-white/80 rounded-md transition-colors hover:bg-white">
          <span>{languageFlag}</span>
          <span>{languageName}</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-48 art-paper p-2" align="end">
        <div className="flex flex-col space-y-1">
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => changeLanguage(locale.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm transition-colors ${
                locale.code === currentLocale
                  ? 'bg-art-highlight text-art-ink'
                  : 'hover:bg-white/80 text-art-ink'
              }`}
            >
              <span>{locale.flag}</span>
              <span>{locale.name}</span>
            </button>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
} 