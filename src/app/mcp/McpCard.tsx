"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MarkdownDialog from '@/components/ui/markdown-dialog';
import { McpItem, McpCategory } from './McpClientWrapper';
import { DEFAULT_LOCALE } from '@/app/components/LanguageSwitcher';

interface McpCardProps {
  item: McpItem;
}

export function McpCard({ item }: McpCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
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
  
  const handleCardClick = () => {
    setDialogOpen(true);
  };
  
  // 生成GitHub仓库的README.md URL
  const getReadmeUrl = () => {
    if (!item.repo_id) return '';
    return `https://raw.githubusercontent.com/${item.repo_id}/refs/heads/main/README.md`;
  };

  // 获取分类标签颜色
  const getCategoryColor = (category: McpCategory): string => {
    const colors: Record<McpCategory, string> = {
      writing: 'bg-purple-100 text-purple-800',
      filesystem: 'bg-pink-100 text-pink-800',
      device: 'bg-orange-100 text-orange-800'
    };
    return colors[category];
  };

  // 获取分类名称
  const getCategoryName = (category: McpCategory): string => {
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
    
    // 安全检查：确保category是有效值
    if (!categoryNames[category]) {
      console.warn(`无效的分类: ${category}，使用默认值`);
      return currentLocale === 'zh' ? '未分类' : 
             currentLocale === 'ja' ? '未分類' : 'Uncategorized';
    }
    
    // 安全检查：确保locale是有效值
    if (!categoryNames[category][currentLocale]) {
      return categoryNames[category].en || 'Uncategorized';
    }
    
    return categoryNames[category][currentLocale] || categoryNames[category].en;
  };

  // 检查是否有内容可以显示
  const hasContent = () => {
    return Boolean(item.repo_id) || Boolean(item.content);
  };

  // 获取对话框的内容源
  const getContentSource = () => {
    if (item.repo_id) {
      return getReadmeUrl();
    } else if (item.content) {
      return item.content;
    }
    return '';
  };

  return (
    <>
      <Card 
        className="cursor-pointer h-full flex flex-col hover:shadow-md transition-shadow duration-300"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-art-paper flex items-center justify-center text-art-charcoal/50">
                MCP
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(item.category)}`}>
              {getCategoryName(item.category)}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-art-ink">{item.title}</h3>
          
          {/* 内容预览 */}
          {item.content && (
            <div className="mb-2 text-sm text-gray-600 line-clamp-2">
              {item.content.replace(/^---[\s\S]*?---/, '').trim().slice(0, 150)}
              {item.content.length > 150 && '...'}
            </div>
          )}
          
          <p className="text-art-charcoal line-clamp-3">{item.description}</p>
        </CardContent>
        
        <CardFooter className="pt-2 pb-4">
          <p className="text-sm text-art-charcoal/70">
            {new Date(item.updated_at).toLocaleDateString(
              currentLocale === 'zh' ? 'zh-CN' : 
              currentLocale === 'ja' ? 'ja-JP' : 'en-US'
            )}
          </p>
        </CardFooter>
      </Card>

      {hasContent() && (
        <MarkdownDialog
          key={`dialog-${item.id}-${dialogKeyIndex}`}
          title={item.title}
          markdownPath={getContentSource()}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          repo_id={item.repo_id}
        >
          <div className="hidden">触发器内容（已隐藏）</div>
        </MarkdownDialog>
      )}
    </>
  );
} 