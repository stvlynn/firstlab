"use client";

import React, { useState, useEffect } from 'react';
import { Event } from '@/lib/types';
import { EventCard } from '../components/EventCard';
import { DEFAULT_LOCALE } from '../components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { getLocaleText } from '@/lib/yaml';

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function EventsPage() {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [events, setEvents] = useState<Event[]>([]);
  const [uiTexts, setUiTexts] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // 获取所有事件数据和UI翻译
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // 获取事件数据
        const eventsResponse = await fetch('/api/config/events');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);
        
        // 获取UI翻译
        const uiResponse = await fetch('/api/config/events/ui');
        const uiData = await uiResponse.json();
        setUiTexts(uiData);
      } catch (error) {
        console.error('Failed to fetch events data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // 如果UI翻译未加载，使用默认文本
  const getUiText = (key: string) => {
    if (!uiTexts) {
      const defaultTexts: Record<string, Record<string, string>> = {
        title: {
          zh: "社区活动",
          ja: "コミュニティイベント",
          en: "Community Events"
        },
        loading: {
          zh: "正在加载活动信息...",
          ja: "イベント情報を読み込んでいます...",
          en: "Loading event information..."
        },
        no_events: {
          zh: "当前没有活动信息",
          ja: "現在イベント情報はありません",
          en: "No event information available"
        }
      };
      return defaultTexts[key]?.[currentLocale] || defaultTexts[key]?.en || key;
    }
    return getLocaleText(uiTexts[key], currentLocale);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-art-ink relative inline-block">
        {getUiText('title')}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-art-watercolor-blue opacity-70"></span>
      </h1>
      
      {uiTexts && (
        <p className="mb-8 text-art-charcoal">
          {getUiText('subtitle')}
        </p>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center col-span-full py-10">
            {getUiText('loading')}
          </div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="art-card art-frame h-80 animate-pulse">
              <div className="h-48 bg-art-pencil/10 mb-4"></div>
              <div className="p-2">
                <div className="h-4 bg-art-pencil/10 w-1/3 mb-2"></div>
                <div className="h-6 bg-art-pencil/10 w-2/3 mb-2"></div>
                <div className="h-4 bg-art-pencil/10 mb-4"></div>
                <div className="h-4 bg-art-pencil/10 w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {events.map((event, index) => (
            <EventCard key={`event-${index}`} event={event} index={index} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-art-pencil">
            {getUiText('no_events')}
          </p>
        </div>
      )}
      
      {events.length > 0 && (
        <div className="mt-12 text-center">
          <a href="/" className="inline-block py-2 px-4 border border-art-pencil text-art-ink rounded-md transition-colors hover:bg-white">
            {getUiText('back_to_home')}
          </a>
        </div>
      )}
    </div>
  );
}