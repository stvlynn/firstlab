"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_LOCALE } from '@/app/components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MarkdownDialog } from '@/components/ui/markdown-dialog';
import Link from 'next/link';
import { NavIcon } from '@/lib/icons';
import Image from 'next/image';
import matter from 'gray-matter';

// 定义教程类型
interface Tutorial {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  markdownPath: string;
  icon?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  coverImage?: string;
  tag?: Record<string, string>;
  tagColor?: string;
  author?: string;
}

// 定义元数据类型
interface TutorialMetadata {
  coverImage?: string;
  tagZh?: string;
  tagEn?: string;
  tagJa?: string;
  tagColor?: string;
  author?: string;
}

// 定义图片生成教程数据
const IMAGE_GENERATION_TUTORIALS: Tutorial[] = [
  {
    id: 'comfyui-getting-started',
    title: {
      zh: "ComfyUI入门指南",
      ja: "ComfyUI入門ガイド",
      en: "ComfyUI Getting Started"
    },
    description: {
      zh: "ComfyUI基础操作和工作流创建教程",
      ja: "ComfyUIの基本操作とワークフロー作成チュートリアル",
      en: "Basic operations and workflow creation tutorial for ComfyUI"
    },
    markdownPath: "content/markdown/image-generation/comfyui/getting-started.md",
    icon: "image",
    level: 'beginner'
  },
  {
    id: 'comfyui-deployment',
    title: {
      zh: "ComfyUI部署指南",
      ja: "ComfyUIデプロイメントガイド",
      en: "ComfyUI Deployment Guide"
    },
    description: {
      zh: "如何部署和配置ComfyUI进行AI图像生成",
      ja: "AIイメージ生成のためのComfyUIの導入と設定方法",
      en: "How to deploy and configure ComfyUI for AI image generation"
    },
    markdownPath: "content/markdown/image-generation/comfyui/deployment.md",
    icon: "settings",
    level: 'intermediate'
  },
  {
    id: 'comfyui-advanced',
    title: {
      zh: "ComfyUI高级技术指南",
      ja: "ComfyUI高度な技術ガイド",
      en: "ComfyUI Advanced Techniques"
    },
    description: {
      zh: "掌握ComfyUI的高级功能和工作流优化方法",
      ja: "ComfyUIの高度な機能とワークフロー最適化の方法",
      en: "Master advanced features and workflow optimization methods in ComfyUI"
    },
    markdownPath: "content/markdown/image-generation/comfyui/advanced-techniques.md",
    icon: "curveArray",
    level: 'advanced'
  }
];

// 在已有的IMAGE_GENERATION_TUTORIALS数组后添加最佳实践数据
const BEST_PRACTICES: Tutorial[] = [
  {
    id: 'sd-prompt-optimization',
    title: {
      zh: "Stable Diffusion提示词优化指南",
      ja: "Stable Diffusionプロンプト最適化ガイド",
      en: "Stable Diffusion Prompt Optimization Guide"
    },
    description: {
      zh: "如何编写高质量的提示词以获得更好的AI图像生成结果",
      ja: "より良いAI画像生成結果を得るための高品質なプロンプトの書き方",
      en: "How to write high-quality prompts for better AI image generation results"
    },
    markdownPath: "content/markdown/image-generation/best-practices/stable-diffusion-prompt.md",
    icon: "edit",
    level: 'intermediate'
  }
];

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
  visible: { opacity: 1, y: 0 }
};

// UI文本
const UI_TEXTS = {
  title: {
    zh: "图像生成教程",
    ja: "画像生成チュートリアル",
    en: "Image Generation Tutorials"
  },
  subtitle: {
    zh: "探索AI图像生成的技术和工具",
    ja: "AI画像生成の技術とツールを探索する",
    en: "Explore techniques and tools for AI image generation"
  },
  level: {
    beginner: {
      zh: "初学者",
      ja: "初心者",
      en: "Beginner"
    },
    intermediate: {
      zh: "中级",
      ja: "中級",
      en: "Intermediate"
    },
    advanced: {
      zh: "高级",
      ja: "上級",
      en: "Advanced"
    }
  },
  view: {
    zh: "查看教程",
    ja: "チュートリアルを見る",
    en: "View Tutorial"
  },
  close: {
    zh: "关闭",
    ja: "閉じる",
    en: "Close"
  },
  bestPracticesTitle: {
    zh: "最佳实践",
    ja: "ベストプラクティス",
    en: "Best Practices"
  },
  bestPracticesSubtitle: {
    zh: "专家撰写的AI图像生成技巧和经验",
    ja: "専門家によるAI画像生成のヒントとテクニック",
    en: "Expert tips and techniques for AI image generation"
  }
};

// 获取本地化文本
const getLocaleText = (textObj: Record<string, string>, locale: string): string => {
  return textObj[locale] || textObj['en'] || '';
};

// 获取等级的颜色
const getLevelColor = (level: string): string => {
  switch(level) {
    case 'beginner':
      return 'bg-emerald-100 text-emerald-800';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800';
    case 'advanced':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ImageGenerationPage() {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [tutorials, setTutorials] = useState<Tutorial[]>(IMAGE_GENERATION_TUTORIALS);
  const [bestPractices, setBestPractices] = useState<Tutorial[]>(BEST_PRACTICES);
  
  // 获取markdown文件的元数据
  const fetchTutorialMetadata = async (tutorialList: Tutorial[]) => {
    const updatedTutorials = await Promise.all(
      tutorialList.map(async (tutorial) => {
        try {
          const response = await fetch(`/api/markdown?path=${encodeURIComponent(tutorial.markdownPath)}`);
          if (!response.ok) {
            console.error(`Failed to fetch ${tutorial.markdownPath}: ${response.status}`);
            return tutorial;
          }
          
          const markdown = await response.text();
          const { data } = matter(markdown);
          
          // 解析元数据
          const metadata: TutorialMetadata = {
            coverImage: data.cover_image as string,
            tagZh: data['tag-zh'] as string,
            tagEn: data['tag-en'] as string,
            tagJa: data['tag-ja'] as string,
            tagColor: data.tag_color as string,
            author: data.author as string
          };
          
          // 更新教程对象
          return {
            ...tutorial,
            coverImage: metadata.coverImage,
            tag: {
              zh: metadata.tagZh || getLocaleText(UI_TEXTS.level[tutorial.level], 'zh'),
              en: metadata.tagEn || getLocaleText(UI_TEXTS.level[tutorial.level], 'en'),
              ja: metadata.tagJa || getLocaleText(UI_TEXTS.level[tutorial.level], 'ja')
            },
            tagColor: metadata.tagColor || getLevelColorClass(tutorial.level),
            author: metadata.author
          };
        } catch (error) {
          console.error(`Error fetching metadata for ${tutorial.markdownPath}:`, error);
          return tutorial;
        }
      })
    );
    
    return updatedTutorials;
  };
  
  // 从本地存储获取语言设置
  useEffect(() => {
    const fetchData = async () => {
      setIsMounted(true);
      // 获取教程元数据
      const updatedTutorials = await fetchTutorialMetadata(IMAGE_GENERATION_TUTORIALS);
      setTutorials(updatedTutorials);
      
      // 获取最佳实践元数据
      const updatedBestPractices = await fetchTutorialMetadata(BEST_PRACTICES);
      setBestPractices(updatedBestPractices);
    };
    
    fetchData();
    
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
  
  // 打开教程对话框
  const openTutorialDialog = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setDialogOpen(true);
  };
  
  // 渲染图标的辅助函数，只在客户端渲染时显示图标
  const renderIcon = (iconId: string | undefined, className: string) => {
    if (!isMounted) return null;
    return iconId ? <NavIcon id={iconId} className={className} /> : null;
  };
  
  // 根据标签级别获取颜色类名
  const getLevelColorClass = (level: string): string => {
    switch(level) {
      case 'beginner':
        return 'emerald';
      case 'intermediate':
        return 'blue';
      case 'advanced':
        return 'purple';
      default:
        return 'gray';
    }
  };
  
  // 获取标签的颜色类
  const getTagColorClass = (tutorial: Tutorial): string => {
    const color = tutorial.tagColor || getLevelColorClass(tutorial.level);
    return `bg-${color}-100 text-${color}-800`;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-art-ink relative inline-block">
        {getLocaleText(UI_TEXTS.title, currentLocale)}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-art-watercolor-blue opacity-70"></span>
      </h1>
      
      <p className="mb-8 text-art-charcoal">
        {getLocaleText(UI_TEXTS.subtitle, currentLocale)}
      </p>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {tutorials.map((tutorial) => (
          <motion.div key={tutorial.id} variants={itemVariants}>
            <Card 
              className="h-full flex flex-col transition-all hover:shadow-md cursor-pointer"
              onClick={() => openTutorialDialog(tutorial)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {isMounted && tutorial.icon && (
                      <NavIcon id={tutorial.icon} className="text-primary h-5 w-5" />
                    )}
                    <CardTitle>{getLocaleText(tutorial.title, currentLocale)}</CardTitle>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${tutorial.tag ? getTagColorClass(tutorial) : getLevelColor(tutorial.level)}`}>
                    {tutorial.tag ? getLocaleText(tutorial.tag, currentLocale) : getLocaleText(UI_TEXTS.level[tutorial.level], currentLocale)}
                  </div>
                </div>
                <CardDescription>
                  {getLocaleText(tutorial.description, currentLocale)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  {tutorial.coverImage ? (
                    <Image 
                      src={tutorial.coverImage} 
                      alt={getLocaleText(tutorial.title, currentLocale)}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : isMounted && (
                    <NavIcon id={tutorial.icon || "image"} className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div className="text-sm text-primary hover:underline flex items-center">
                  {getLocaleText(UI_TEXTS.view, currentLocale)}
                  {isMounted && <NavIcon id="nav-arrow-right" className="ml-1 h-4 w-4" />}
                </div>
                {tutorial.author && (
                  <div className="flex items-center gap-1.5">
                    <NavIcon id="user" className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">
                      {tutorial.author}
                    </span>
                  </div>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* 添加最佳实践区块 */}
      <div className="mt-16 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-art-ink relative inline-block">
          {getLocaleText(UI_TEXTS.bestPracticesTitle, currentLocale)}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-art-watercolor-green opacity-70"></span>
        </h2>
        
        <p className="mb-8 text-art-charcoal">
          {getLocaleText(UI_TEXTS.bestPracticesSubtitle, currentLocale)}
        </p>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {bestPractices.map((practice) => (
            <motion.div key={practice.id} variants={itemVariants}>
              <Card 
                className="h-full flex flex-col transition-all hover:shadow-md cursor-pointer border-art-watercolor-green/30"
                onClick={() => openTutorialDialog(practice)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {isMounted && practice.icon && (
                        <NavIcon id={practice.icon} className="text-green-600 h-5 w-5" />
                      )}
                      <CardTitle>{getLocaleText(practice.title, currentLocale)}</CardTitle>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${practice.tag ? getTagColorClass(practice) : getLevelColor(practice.level)}`}>
                      {practice.tag ? getLocaleText(practice.tag, currentLocale) : getLocaleText(UI_TEXTS.level[practice.level], currentLocale)}
                    </div>
                  </div>
                  <CardDescription>
                    {getLocaleText(practice.description, currentLocale)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="h-32 bg-green-50 rounded flex items-center justify-center overflow-hidden">
                    {practice.coverImage ? (
                      <Image 
                        src={practice.coverImage} 
                        alt={getLocaleText(practice.title, currentLocale)}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : isMounted && (
                      <NavIcon id={practice.icon || "edit"} className="h-16 w-16 text-green-200" />
                    )}
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <div className="text-sm text-primary hover:underline flex items-center">
                    {getLocaleText(UI_TEXTS.view, currentLocale)}
                    {isMounted && <NavIcon id="nav-arrow-right" className="ml-1 h-4 w-4" />}
                  </div>
                  {practice.author && (
                    <div className="flex items-center gap-1.5">
                      <NavIcon id="user" className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium">
                        {practice.author}
                      </span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {selectedTutorial && (
        <MarkdownDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={getLocaleText(selectedTutorial.title, currentLocale)}
          markdownPath={selectedTutorial.markdownPath}
        >
          <span></span>
        </MarkdownDialog>
      )}
    </div>
  );
}