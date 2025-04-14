"use client";

import React, { useState, useEffect } from 'react';
import { DEFAULT_LOCALE } from '../components/LanguageSwitcher';

export default function AboutPage() {
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
        {currentLocale === 'zh' ? '关于我们' : 
         currentLocale === 'ja' ? '私たちについて' : 'About Us'}
      </h1>
      
      <div className="art-paper p-6">
        <p className="text-art-charcoal mb-4">
          {currentLocale === 'zh' ? '这是关于页面，您可以在这里了解更多关于我们的信息。' : 
           currentLocale === 'ja' ? 'これは「私たちについて」ページです。ここで私たちについての詳細を知ることができます。' : 
           'This is the about page where you can learn more about us.'}
        </p>
      </div>
    </div>
  );
}