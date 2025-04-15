"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLocaleText } from '@/lib/yaml';
import { motion } from 'framer-motion';
import { DEFAULT_LOCALE } from './components/LanguageSwitcher';
import { EventCard } from './components/EventCard';

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

export default function HomePage() {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
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
  
  // 获取站点配置和事件数据
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // 获取站点配置
        const siteRes = await fetch('/api/config/site');
        const siteData = await siteRes.json();
        setSiteConfig(siteData);
        
        // 获取事件数据
        const eventsRes = await fetch('/api/config/events');
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events);
      } catch (error) {
        console.error('Failed to fetch home page data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // 加载中状态
  if (isLoading || !siteConfig) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* 顶部横幅 - Discord 加入链接 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="art-paper p-8 text-center relative overflow-hidden ink-splatter">
          <h1 className="text-4xl font-bold mb-4 text-art-ink">
            {getLocaleText(siteConfig.site.title, currentLocale)}
          </h1>
          <p className="text-xl text-art-charcoal mb-8 max-w-2xl mx-auto">
            {getLocaleText(siteConfig.site.description, currentLocale)}
          </p>
          
          <a
            href={siteConfig.site.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-3 px-8 bg-[#5865F2] text-white rounded-md transition-transform hover:scale-105 hover:-translate-y-1"
          >
            {currentLocale === 'zh' ? '加入 Discord 社区' : 
             currentLocale === 'ja' ? 'Discord コミュニティに参加' : 'Join Our Discord Community'}
          </a>
        </div>
      </motion.div>
      
      {/* 最新活动 */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-16"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-2xl font-semibold mb-8 text-art-ink relative inline-block"
        >
          {currentLocale === 'zh' ? '最新社区活动' : 
           currentLocale === 'ja' ? '最新コミュニティイベント' : 'Latest Community Events'}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-art-watercolor-blue opacity-70"></span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.slice(0, 3).map((event, index) => (
            <EventCard key={`event-${index}`} event={event} index={index} />
          ))}
        </div>
        
        <motion.div
          variants={itemVariants}
          className="text-center mt-8"
        >
          <Link
            href="/events"
            className="inline-block py-2 px-4 border border-art-pencil text-art-ink rounded-md transition-colors hover:bg-white"
          >
            {currentLocale === 'zh' ? '查看全部活动' : 
             currentLocale === 'ja' ? 'すべてのイベントを見る' : 'View All Events'}
          </Link>
        </motion.div>
      </motion.section>
      
      {/* 资源区块 */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12"
      >
        {/* Dify 资源 */}
        <motion.div
          variants={itemVariants}
          className="art-card p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-art-ink">
            Dify 
            <span className="ml-2 text-sm font-normal text-art-pencil">
              {currentLocale === 'zh' ? '学习资源' : 
               currentLocale === 'ja' ? '学習リソース' : 'Learning Resources'}
            </span>
          </h3>
          
          <p className="text-art-charcoal mb-4">
            {currentLocale === 'zh' ? '探索Dify工作流和插件，提升AI应用开发效率。' : 
             currentLocale === 'ja' ? 'Difyワークフローとプラグインを探索して、AIアプリケーション開発の効率を高めます。' : 
             'Explore Dify workflows and plugins to enhance AI application development efficiency.'}
          </p>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3B82F6' }}></div>
            <span className="font-medium">
              {currentLocale === 'zh' ? '工作流' : 
               currentLocale === 'ja' ? 'ワークフロー' : 'Workflow'}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10B981' }}></div>
            <span className="font-medium">
              {currentLocale === 'zh' ? '插件' : 
               currentLocale === 'ja' ? 'プラグイン' : 'Plugin'}
            </span>
          </div>
          
          <Link
            href="/dify"
            className="ink-link text-art-watercolor-blue font-medium"
          >
            {currentLocale === 'zh' ? '浏览Dify资源' : 
             currentLocale === 'ja' ? 'Difyリソースを閲覧' : 'Browse Dify Resources'}
          </Link>
        </motion.div>
        
        {/* MCP 资源 */}
        <motion.div
          variants={itemVariants}
          className="art-card p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-art-ink">
            MCP 
            <span className="ml-2 text-sm font-normal text-art-pencil">
              {currentLocale === 'zh' ? '学习资源' : 
               currentLocale === 'ja' ? '学習リソース' : 'Learning Resources'}
            </span>
          </h3>
          
          <p className="text-art-charcoal mb-4">
            {currentLocale === 'zh' ? '学习MCP的写作、文件系统和设备使用技巧，提高工作效率。' : 
             currentLocale === 'ja' ? 'MCPのライティング、ファイルシステム、およびデバイス使用のテクニックを学び、生産性を向上させます。' : 
             'Learn MCP writing, file system and device usage techniques to improve productivity.'}
          </p>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#8B5CF6' }}></div>
            <span className="font-medium">
              {currentLocale === 'zh' ? '写作' : 
               currentLocale === 'ja' ? 'ライティング' : 'Writing'}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#EC4899' }}></div>
            <span className="font-medium">
              {currentLocale === 'zh' ? '文件系统' : 
               currentLocale === 'ja' ? 'ファイルシステム' : 'File System'}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#F59E0B' }}></div>
            <span className="font-medium">
              {currentLocale === 'zh' ? '设备使用' : 
               currentLocale === 'ja' ? 'デバイス使用' : 'Device Using'}
            </span>
          </div>
          
          <Link
            href="/mcp"
            className="ink-link text-art-watercolor-blue font-medium"
          >
            {currentLocale === 'zh' ? '浏览MCP资源' : 
             currentLocale === 'ja' ? 'MCPリソースを閲覧' : 'Browse MCP Resources'}
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
