"use client";

import { useState, useEffect } from 'react';
import { DEFAULT_LOCALE } from '@/app/components/LanguageSwitcher';

/**
 * 使用本地化钩子，提供当前语言设置和相关功能
 * 
 * @returns 包含当前语言和更新方法的对象
 */
export function useLocale() {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  
  useEffect(() => {
    // 从本地存储获取语言设置
    const savedLocale = localStorage.getItem('preferredLanguage');
    if (savedLocale) {
      setCurrentLocale(savedLocale);
    }
    
    // 监听语言变化事件
    const handleLocaleChange = (event: CustomEvent) => {
      setCurrentLocale(event.detail.locale);
    };
    
    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
    };
  }, []);

  // 更新语言并发送事件通知
  const setLocale = (locale: string) => {
    localStorage.setItem('preferredLanguage', locale);
    setCurrentLocale(locale);
    window.dispatchEvent(new CustomEvent('localeChanged', { 
      detail: { locale } 
    }));
  };
  
  // 格式化日期
  const formatDate = (dateString?: string, options?: Intl.DateTimeFormatOptions) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString(
      currentLocale === 'zh' ? 'zh-CN' : 
      currentLocale === 'ja' ? 'ja-JP' : 'en-US',
      options || defaultOptions
    );
  };
  
  return {
    currentLocale,
    setLocale,
    formatDate
  };
} 