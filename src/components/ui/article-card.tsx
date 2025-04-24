/**
 * Article Card Component
 * 
 * A reusable card component for displaying article information with:
 * - Title and description
 * - Optional cover image
 * - Tags with localization support
 * - Author and date information
 * - Click functionality to open article content in a markdown dialog
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavIcon } from '@/components/NavIcon';
import { MarkdownDialog } from './markdown-dialog';
import { useLocale } from '@/lib/locale';

export interface ArticleCardProps {
  title: string;
  description: string;
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
  description,
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
  
  const localizedTag = tags?.[`tag-${currentLocale}`] || tags?.['tag-en'] || '';
  
  const handleCardClick = () => {
    setDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLocale === 'zh' ? 'zh-CN' : currentLocale);
  };

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
                alt={title} 
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
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
          {author && (
            <span className="text-xs text-gray-500">
              {author}
            </span>
          )}
          {createdAt && (
            <time className="text-xs text-gray-500">
              {formatDate(createdAt)}
            </time>
          )}
        </CardFooter>
      </Card>

      <MarkdownDialog
        title={title}
        markdownPath={markdownPath}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
} 