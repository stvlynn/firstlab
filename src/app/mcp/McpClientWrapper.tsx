"use client";

import React, { useState, useEffect } from 'react';
import { McpCard } from './McpCard';
import { DEFAULT_LOCALE } from '@/app/components/LanguageSwitcher';

// MCP分类类型
export type McpCategory = 'writing' | 'filesystem' | 'device';

// MCP数据接口
export interface McpItem {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  content?: string | null;
  repo_id?: string | null;
  updated_at: string;
  category: McpCategory;
}

interface McpClientWrapperProps {
  mcpItems: McpItem[];
}

export function McpClientWrapper({ mcpItems }: McpClientWrapperProps) {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [selectedCategory, setSelectedCategory] = useState<McpCategory | 'all'>('all');
  
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

  // 添加组件初始化日志
  useEffect(() => {
    console.log('McpClientWrapper 初始化', {
      接收的数据条数: mcpItems.length,
      当前语言: currentLocale,
      初始分类: selectedCategory
    });
    
    // 检查接收到的数据格式是否正确
    if (mcpItems.length > 0) {
      const hasValidCategories = mcpItems.every(item => 
        typeof item.category === 'string' && 
        ['writing', 'filesystem', 'device'].includes(item.category)
      );
      
      console.log('数据格式检查:', {
        有效的category字段: hasValidCategories,
        样例数据: mcpItems.slice(0, 2)
      });
    }
  }, [mcpItems]);

  // 获取分类名称
  const getCategoryName = (category: McpCategory | 'all') => {
    if (category === 'all') {
      return currentLocale === 'zh' ? '全部' : 
             currentLocale === 'ja' ? '全て' : 'All';
    }
    
    const categoryNames: Record<McpCategory, Record<string, string>> = {
      writing: {
        zh: '写作',
        ja: '作文',
        en: 'Writing'
      },
      filesystem: {
        zh: '文件系统',
        ja: 'ファイルシステム',
        en: 'File System'
      },
      device: {
        zh: '设备使用',
        ja: 'デバイス使用',
        en: 'Device Usage'
      }
    };
    
    return categoryNames[category][currentLocale] || categoryNames[category].en;
  };

  // 过滤当前分类的项目
  const filteredItems = selectedCategory === 'all' 
    ? mcpItems 
    : mcpItems.filter(item => item.category === selectedCategory);
  
  // 添加过滤结果日志
  useEffect(() => {
    console.log('分类过滤结果:', {
      分类: selectedCategory,
      总数据条数: mcpItems.length,
      过滤后条数: filteredItems.length
    });
  }, [selectedCategory, mcpItems, filteredItems]);
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-art-ink">
        {currentLocale === 'zh' ? 'MCP 资源' : 
         currentLocale === 'ja' ? 'MCP リソース' : 'MCP Resources'}
      </h1>
      
      {/* 分类选择器 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'writing', 'filesystem', 'device'] as const).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-art-paper text-art-charcoal hover:bg-art-pencil/10'
            }`}
          >
            {getCategoryName(category)}
          </button>
        ))}
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="art-paper p-6 text-center">
          <p className="text-art-charcoal">
            {currentLocale === 'zh' ? '暂无MCP资源' : 
             currentLocale === 'ja' ? 'MCPリソースがありません' : 'No MCP resources available'}
          </p>
          
          {/* 添加调试信息 */}
          <div className="mt-4 text-xs text-gray-500">
            <p>接收的数据条数: {mcpItems.length}</p>
            <p>当前分类: {selectedCategory}</p>
            {process.env.NODE_ENV === 'development' && mcpItems.length > 0 && (
              <details className="mt-2">
                <summary>调试信息</summary>
                <pre className="text-left bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
                  {JSON.stringify(mcpItems[0], null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <McpCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
} 