"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event } from '@/lib/types';
import { getLocaleText } from '@/lib/yaml';
import { motion } from 'framer-motion';
import { DEFAULT_LOCALE } from './LanguageSwitcher';

type EventCardProps = {
  event: Event;
  index: number;
};

export function EventCard({ event, index }: EventCardProps) {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  
  // 从localStorage获取语言设置
  useEffect(() => {
    const savedLocale = localStorage.getItem('preferredLanguage');
    if (savedLocale) {
      setCurrentLocale(savedLocale);
    }
    
    // 添加语言更改事件监听器
    const handleLocaleChange = (event: CustomEvent) => {
      setCurrentLocale(event.detail.locale);
    };
    
    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
    };
  }, []);
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString(
      currentLocale === 'zh' ? 'zh-CN' : 
      currentLocale === 'ja' ? 'ja-JP' : 'en-US',
      options
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1
      }}
      className="group"
    >
      <div className="art-card art-frame overflow-hidden group-hover:shadow-lg">
        <div className="relative">
          {event.image && (
            <div className="h-48 overflow-hidden mb-4">
              <img 
                src={event.image} 
                alt={getLocaleText(event.title, currentLocale)} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          
          <div className="p-2">
            <div className="text-sm text-art-pencil mb-2">
              {formatDate(event.date)}
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-art-ink">
              {getLocaleText(event.title, currentLocale)}
            </h3>
            
            <p className="text-art-charcoal mb-4">
              {getLocaleText(event.description, currentLocale)}
            </p>
            
            <Link
              href={event.link}
              className="ink-link text-art-watercolor-blue font-medium"
            >
              {currentLocale === 'zh' ? '了解更多' : 
               currentLocale === 'ja' ? '詳細を見る' : 'Learn More'}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 