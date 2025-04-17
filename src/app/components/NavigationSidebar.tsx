"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getLocaleText } from '@/lib/yaml';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteConfig, Categories } from '@/lib/types';
import { DEFAULT_LOCALE } from './LanguageSwitcher';
import { NavIcon } from '@/lib/icons';
import { getNavCollapsedState } from '@/lib/navigation-state';

// 导航项的动画变体
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

// 子项的动画变体
const childVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
    },
  },
};

export function NavigationSidebar() {
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // 状态管理
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [difyCategories, setDifyCategories] = useState<Categories | null>(null);
  const [mcpCategories, setMcpCategories] = useState<Categories | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 从localStorage获取语言设置和导航栏状态
  useEffect(() => {
    const savedLocale = localStorage.getItem('preferredLanguage');
    if (savedLocale) {
      setCurrentLocale(savedLocale);
    }

    // 获取导航栏折叠状态并监听变化
    const updateCollapseState = () => {
      setIsCollapsed(getNavCollapsedState());
    };

    // 初始化状态
    updateCollapseState();
    
    // 监听折叠状态变化
    window.addEventListener('navStateChanged', updateCollapseState);
    
    // 添加语言更改事件监听器
    const handleLocaleChange = (event: CustomEvent) => {
      setCurrentLocale(event.detail.locale);
    };
    
    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
      window.removeEventListener('navStateChanged', updateCollapseState);
    };
  }, []);
  
  // 从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 获取站点配置
        const siteRes = await fetch('/api/config/site');
        const siteData = await siteRes.json();
        setSiteConfig(siteData);
        
        // 获取Dify分类
        const difyRes = await fetch('/api/config/dify');
        const difyData = await difyRes.json();
        setDifyCategories(difyData);
        
        // 获取MCP分类
        const mcpRes = await fetch('/api/config/mcp');
        const mcpData = await mcpRes.json();
        setMcpCategories(mcpData);
      } catch (error) {
        console.error('Failed to fetch navigation data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 判断当前路径
  const isDifyPath = pathname.includes('/dify');
  const isMcpPath = pathname.includes('/mcp');
  
  // 加载中状态
  if (isLoading || !siteConfig) {
    return (
      <div className="art-paper fixed top-0 left-0 h-screen w-16 p-6 border-r border-art-pencil/10 shadow-sm transition-all duration-300">
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-gray-200 rounded-full mb-8 mx-auto"></div>
          <div className="space-y-4">
            <div className="h-6 w-6 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`art-paper fixed top-0 left-0 h-screen ${
        isCollapsed ? 'w-16' : 'w-64'
      } p-4 border-r border-art-pencil/10 shadow-sm transition-all duration-300 z-20 overflow-y-auto`}
    >
      <div className="mb-8 flex justify-center md:justify-start">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-art-ink transition-transform hover:scale-105"
        >
          <div className="relative flex-shrink-0 w-8 h-8">
            <Image 
              src="/firstlab.png" 
              alt="First Lab Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {!isCollapsed && (
            <span className="text-2xl font-bold">First Lab</span>
          )}
        </Link>
      </div>
      
      <nav className="space-y-8">
        {/* 主导航 */}
        <ul className="space-y-4">
          {siteConfig.navigation.main.map((item, i) => (
            <motion.li 
              key={item.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              whileHover={{ x: isCollapsed ? 0 : 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative"
            >
              <Link
                href={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 p-2 rounded-md transition-all duration-200 ${
                  pathname === item.path 
                    ? 'bg-art-highlight/20 text-primary font-medium' 
                    : 'hover:bg-white/80 text-art-pencil hover:text-art-ink'
                }`}
                title={isCollapsed ? getLocaleText(item.name, currentLocale) : ""}
              >
                <NavIcon 
                  id={item.id} 
                  className={`flex-shrink-0 ${pathname === item.path ? 'text-primary' : ''}`} 
                />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {getLocaleText(item.name, currentLocale)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.li>
          ))}
        </ul>
        
        {/* Dify 分类 - 只在展开状态且在Dify页面显示 */}
        {!isCollapsed && isDifyPath && difyCategories && (
          <div className="py-4">
            <h3 className="mb-4 text-sm font-semibold text-art-charcoal">
              {currentLocale === 'zh' ? 'Dify 资源' : 
               currentLocale === 'ja' ? 'Dify リソース' : 'Dify Resources'}
            </h3>
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={childVariants}
              className="space-y-1 pl-2"
            >
              {difyCategories.categories.map((category) => (
                <li key={category.id} className="mb-3">
                  <div 
                    className="flex items-center gap-2 mb-2"
                    style={{ color: category.color }}
                  >
                    <div 
                      className="w-3 h-3 rounded-sm" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium">{getLocaleText(category.name, currentLocale)}</span>
                  </div>
                  <ul className="space-y-1 pl-5">
                    {category.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.link}
                          className={`text-sm py-1 block transition-colors hover:text-art-charcoal ${
                            pathname === item.link
                              ? 'text-art-ink font-medium'
                              : 'text-art-pencil'
                          }`}
                        >
                          {getLocaleText(item.title, currentLocale)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </motion.ul>
          </div>
        )}
        
        {/* MCP 分类 - 只在展开状态且在MCP页面显示 */}
        {!isCollapsed && isMcpPath && mcpCategories && (
          <div className="py-4">
            <h3 className="mb-4 text-sm font-semibold text-art-charcoal">
              {currentLocale === 'zh' ? 'MCP 商店' : 
               currentLocale === 'ja' ? 'MCP マーケット' : 'MCP Store'}
            </h3>
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={childVariants}
              className="space-y-1 pl-2"
            >
              {mcpCategories.categories.map((category) => (
                <li key={category.id} className="mb-3">
                  <div 
                    className="flex items-center gap-2 mb-2"
                    style={{ color: category.color }}
                  >
                    <div 
                      className="w-3 h-3 rounded-sm" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium">{getLocaleText(category.name, currentLocale)}</span>
                  </div>
                  <ul className="space-y-1 pl-5">
                    {category.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.link}
                          className={`text-sm py-1 block transition-colors hover:text-art-charcoal ${
                            pathname === item.link
                              ? 'text-art-ink font-medium'
                              : 'text-art-pencil'
                          }`}
                        >
                          {getLocaleText(item.title, currentLocale)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </motion.ul>
          </div>
        )}
      </nav>
      
      {/* Discord 链接 - 在折叠和展开状态下不同显示 */}
      <div className="mt-12 pt-6 border-t border-art-pencil/10 text-center">
        {isCollapsed ? (
          <a
            href={siteConfig.site.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center h-10 w-10 p-2 bg-[#5865F2] text-white rounded-full transition-all hover:scale-110 hover:shadow-md"
            title="加入 Discord"
          >
            <NavIcon id="discord" className="text-white" />
          </a>
        ) : (
          <a
            href={siteConfig.site.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2 px-4 bg-[#5865F2] text-white rounded-md transition-all hover:scale-105 hover:shadow-md"
          >
            <NavIcon id="discord" className="text-white" />
            <span>
              {currentLocale === 'zh' ? '加入 Discord' : 
               currentLocale === 'ja' ? 'Discord に参加' : 'Join Discord'}
            </span>
          </a>
        )}
      </div>
    </div>
  );
} 