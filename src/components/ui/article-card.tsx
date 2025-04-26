/**
 * Article Card Component
 * 
 * A reusable card component for displaying article information with:
 * - Title and description with multilingual support
 * - Optional cover image
 * - Tags with localization support
 * - Author and date information
 * - Click functionality to open article content in a markdown dialog
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavIcon } from '@/lib/icons';
import { MarkdownDialog } from './markdown-dialog';
import { useLocale } from '@/lib/locale';

export interface ArticleCardProps {
  title?: string;
  'title-zh'?: string;
  'title-en'?: string;
  'title-ja'?: string;
  description?: string;
  'description-zh'?: string;
  'description-en'?: string;
  'description-ja'?: string;
  imageSrc?: string;
  markdownPath: string;
  tags?: {
    [key: string]: string;
  };
  tagColor?: string;
  iconId?: string;
  iconColor?: string;
  author?: string;
  createdAt?: string;
}

export function ArticleCard({
  title,
  'title-zh': titleZh,
  'title-en': titleEn,
  'title-ja': titleJa,
  description,
  'description-zh': descriptionZh,
  'description-en': descriptionEn,
  'description-ja': descriptionJa,
  imageSrc,
  markdownPath,
  tags,
  tagColor = 'blue',
  iconId,
  iconColor,
  author,
  createdAt,
}: ArticleCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { currentLocale } = useLocale();
  
  // 根据当前语言获取本地化的标题和描述
  const getLocalizedTitle = () => {
    if (currentLocale === 'zh' && titleZh) return titleZh;
    if (currentLocale === 'en' && titleEn) return titleEn;
    if (currentLocale === 'ja' && titleJa) return titleJa;
    
    // 回退逻辑
    return titleZh || titleEn || titleJa || title || '';
  };
  
  const getLocalizedDescription = () => {
    if (currentLocale === 'zh' && descriptionZh) return descriptionZh;
    if (currentLocale === 'en' && descriptionEn) return descriptionEn;
    if (currentLocale === 'ja' && descriptionJa) return descriptionJa;
    
    // 回退逻辑
    return descriptionZh || descriptionEn || descriptionJa || description || '';
  };
  
  const localizedTag = tags?.[`tag-${currentLocale}`] || tags?.['tag-en'] || '';
  
  const handleCardClick = () => {
    setDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLocale === 'zh' ? 'zh-CN' : currentLocale);
  };

  const localizedTitle = getLocalizedTitle();
  const localizedDescription = getLocalizedDescription();

  return (
    <>
      <Card 
        className="w-full overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
        onClick={handleCardClick}
      >
        <CardHeader className="p-0">
          {imageSrc && (
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={imageSrc} 
                alt={localizedTitle} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {iconId && (
              <NavIcon 
                id={iconId} 
                className={`w-5 h-5 text-${iconColor || 'blue-500'}`} 
              />
            )}
            {localizedTag && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${tagColor}-100 text-${tagColor}-800`}>
                {localizedTag}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">{localizedTitle}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{localizedDescription}</p>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
          {author && (
            <div className="flex items-center gap-1.5">
              <NavIcon id="user" className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">
                {author}
              </span>
            </div>
          )}
          {createdAt && (
            <div className="flex items-center gap-1.5">
              <NavIcon id="calendar" className="w-3.5 h-3.5 text-gray-400" />
              <time className="text-xs text-gray-500">
                {formatDate(createdAt)}
              </time>
            </div>
          )}
        </CardFooter>
      </Card>

      <MarkdownDialog
        title={localizedTitle}
        markdownPath={markdownPath}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
} 