"use client";

import React, { useState, useEffect } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { NavIcon } from '@/lib/icons';

// 创建一个上下文来管理全局语言状态
export const DEFAULT_LOCALE = 'zh';

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [locales, setLocales] = useState([
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: 'JP' }
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
    
    // 监听语言变化
    const handleLocaleChange = (event: CustomEvent) => {
      setCurrentLocale(event.detail.locale);
    };
    
    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
    };
  }, []);
  
  // 获取语言名称
  const languageName = locales.find(locale => locale.code === currentLocale)?.name || '中文';
  
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
  };
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-art-ink bg-white/80 rounded-md transition-all duration-300 hover:bg-white hover:shadow-sm">
          <NavIcon id="language" styleType="language" className="text-primary" />
          <span>{languageName}</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-48 art-paper p-2 shadow-lg" align="end">
        <div className="flex flex-col space-y-1">
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => changeLanguage(locale.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm transition-all duration-200 ${
                locale.code === currentLocale
                  ? 'bg-art-highlight text-art-ink font-medium'
                  : 'hover:bg-white/80 text-art-pencil hover:text-art-ink'
              }`}
            >
              <span className="w-6 text-center">{locale.flag}</span>
              <span>{locale.name}</span>
            </button>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
} 