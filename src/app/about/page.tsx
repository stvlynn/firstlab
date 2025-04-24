"use client";

import React, { useState, useEffect } from 'react';
import { DEFAULT_LOCALE } from '../components/LanguageSwitcher';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { NavIcon } from '@/lib/icons';
import { AboutConfig, AboutSection } from '@/lib/about';
import { getLocaleText } from '@/lib/yaml';

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function AboutPage() {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [aboutData, setAboutData] = useState<AboutConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // 获取About页面数据
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/config/about');
        
        if (!response.ok) {
          throw new Error(`服务器返回错误: ${response.status}`);
        }
        
        const data = await response.json();
        setAboutData(data);
      } catch (err) {
        console.error('获取About页面数据失败:', err);
        setError('无法加载页面内容，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // 渲染单个部分的内容
  const renderSection = (section: AboutSection, index: number) => {
    const sectionContent = section.content?.[currentLocale] || section.content?.['en'] || '';
    
    return (
      <motion.section 
        key={section.id}
        variants={sectionVariants}
        className="mb-12"
      >
        <div className="flex items-center mb-4">
          {section.icon && (
            <div className="mr-3">
              <NavIcon id={section.icon} size="24px" className="text-primary" />
            </div>
          )}
          <h2 className="text-2xl font-bold text-art-ink">
            {getLocaleText(section.title, currentLocale)}
          </h2>
        </div>
        
        {section.metadata?.image && (
          <div className="w-full h-64 relative mb-6 overflow-hidden rounded-lg">
            <Image
              src={section.metadata.image}
              alt={getLocaleText(section.title, currentLocale)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <ReactMarkdown>{sectionContent}</ReactMarkdown>
        </div>
      </motion.section>
    );
  };
  
  // 渲染UI文本或使用默认值
  const getUiText = (key: 'title' | 'subtitle' | 'loading') => {
    if (!aboutData?.ui) {
      // 默认文本
      const defaultTexts: Record<string, Record<string, string>> = {
        title: {
          zh: "关于我们",
          ja: "私たちについて",
          en: "About Us"
        },
        subtitle: {
          zh: "了解First Lab的使命、价值观和团队",
          ja: "First Labのミッション、価値観、チームについて",
          en: "Learn about First Lab's mission, values, and team"
        },
        loading: {
          zh: "正在加载内容...",
          ja: "コンテンツを読み込んでいます...",
          en: "Loading content..."
        }
      };
      return defaultTexts[key]?.[currentLocale] || defaultTexts[key]?.en || key;
    }
    return getLocaleText(aboutData.ui[key], currentLocale);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-art-ink relative inline-block">
          {getUiText('title')}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-art-watercolor-blue opacity-70"></span>
        </h1>
        <p className="text-art-charcoal">{getUiText('subtitle')}</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-art-pencil/10 rounded w-1/3 mx-auto"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-art-pencil/10 rounded"></div>
                <div className="h-4 bg-art-pencil/10 rounded w-5/6"></div>
                <div className="h-4 bg-art-pencil/10 rounded w-4/6"></div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-art-pencil">{getUiText('loading')}</p>
        </div>
      ) : error ? (
        <div className="art-paper p-6 text-center rounded-lg">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            onClick={() => window.location.reload()}
          >
            重新加载
          </button>
        </div>
      ) : aboutData?.sections ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {aboutData.sections.map(renderSection)}
        </motion.div>
      ) : (
        <div className="art-paper p-6 text-center">
          <p className="text-art-pencil">内容不可用</p>
        </div>
      )}
    </div>
  );
}