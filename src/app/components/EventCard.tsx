"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Event } from '@/lib/types';
import { getLocaleText } from '@/lib/yaml';
import { motion } from 'framer-motion';
import MarkdownDialog from '@/components/ui/markdown-dialog';
import { DEFAULT_LOCALE } from './LanguageSwitcher';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardHeader
} from '@/components/ui/card';

type EventCardProps = {
  event: Event;
  index: number;
};

export function EventCard({ event, index }: EventCardProps) {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [dialogKeyIndex, setDialogKeyIndex] = useState(0);
  
  // 从localStorage获取语言设置
  useEffect(() => {
    const savedLocale = localStorage.getItem('preferredLanguage');
    if (savedLocale) {
      setCurrentLocale(savedLocale);
    }
    
    // 添加语言更改事件监听器
    const handleLocaleChange = (event: CustomEvent) => {
      setCurrentLocale(event.detail.locale);
      // 增加key索引，强制重新渲染对话框
      setDialogKeyIndex(prevIndex => prevIndex + 1);
    };
    
    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
    };
  }, []);
  
  // 格式化日期
  const formatDate = useCallback((dateString: string) => {
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
  }, [currentLocale]);
  
  // 获取Markdown路径
  const getMarkdownPath = useCallback(() => {
    // 从event.link中提取路径部分，移除语言前缀
    const path = event.link.replace(/^\/[a-z]{2}\//, '/');
    // 使用新的 API 路由获取 markdown 文件
    const markdownPath = `/api/markdown?path=content/markdown${path}.md`;
    console.log(`Generated markdown API path: ${markdownPath} from link: ${event.link}`);
    return markdownPath;
  }, [event.link]);
  
  // 获取当前语言的"主办方"文本
  const getOrganizerLabel = useCallback(() => {
    return currentLocale === 'zh' ? '主办方: ' : 
           currentLocale === 'ja' ? '主催者: ' : 'Organizer: ';
  }, [currentLocale]);
  
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
      <MarkdownDialog 
        key={`dialog-${event.link}-${dialogKeyIndex}`}
        title={getLocaleText(event.title, currentLocale)}
        markdownPath={getMarkdownPath()}
      >
        <Card 
          className="cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          {event.image && (
            <div className="h-48 overflow-hidden relative">
              <Image 
                src={event.image} 
                alt={getLocaleText(event.title, currentLocale)} 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index < 3}
              />
            </div>
          )}
          
          <CardHeader className="pb-0">
            <div className="flex flex-wrap justify-between items-center text-sm text-muted-foreground">
              <span>{formatDate(event.date)}</span>
              {event.organizer && (
                <span className="text-primary">
                  {getOrganizerLabel()}{event.organizer}
                </span>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">
              {getLocaleText(event.title, currentLocale)}
            </h3>
            
            <p className="text-muted-foreground">
              {getLocaleText(event.description, currentLocale)}
            </p>
          </CardContent>
        </Card>
      </MarkdownDialog>
    </motion.div>
  );
} 