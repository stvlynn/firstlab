"use client";

import React, { useState, useEffect } from 'react';
import { DEFAULT_LOCALE } from '../components/LanguageSwitcher';

export default function EventsPage() {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  
  // 从本地存储获取语言设置
  useEffect(() => {
    const savedLocale = localStorage.getItem('preferredLanguage');
    if (savedLocale) {
      setCurrentLocale(savedLocale);
    }
    
    const handleLocaleChange = (event: CustomEvent) => {
      setCurrentLocale(event.detail.locale);
    };
    
    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
    };
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-art-ink">
        {currentLocale === 'zh' ? '活动' : 
         currentLocale === 'ja' ? 'イベント' : 'Events'}
      </h1>
      
      <div className="art-paper p-6">
        <p className="text-art-charcoal mb-4">
          {currentLocale === 'zh' ? '这里是活动页面，您可以查看所有即将到来的活动。' : 
           currentLocale === 'ja' ? 'これはイベントページです。今後のイベントをすべて確認できます。' : 
           'This is the events page where you can see all upcoming events.'}
        </p>
      </div>
    </div>
  );
}