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
import { loadImageGenUITexts, getLocaleText } from '@/lib/yaml';

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

// 动态获取教程数据
const fetchTutorials = async (): Promise<Tutorial[]> => {
  try {
    // 发起API请求，获取comfyui目录下的所有文件
    const response = await fetch('/api/markdown/list?path=content/markdown/image-generation/comfyui');
    if (!response.ok) {
      console.error('Failed to fetch tutorials list');
      return [];
    }
    
    const fileList = await response.json();
    
    // 从文件列表构建教程数组
    const tutorialsList: Tutorial[] = await Promise.all(
      fileList.map(async (filename: string) => {
        // 排除index.md和workflows文件夹
        if (filename === 'index.md' || !filename.endsWith('.md')) {
          return null;
        }
        
        const filePath = `content/markdown/image-generation/comfyui/${filename}`;
        
        // 获取文件内容
        const fileResponse = await fetch(`/api/markdown?path=${encodeURIComponent(filePath)}`);
        if (!fileResponse.ok) {
          console.error(`Failed to fetch file: ${filePath}`);
          return null;
        }
        
        const content = await fileResponse.text();
        const { data } = matter(content);
        
        // 从文件名生成ID
        const id = filename.replace('.md', '');
        
        return {
          id,
          title: {
            zh: data['title-zh'] || data.title || id,
            en: data['title-en'] || data.title || id,
            ja: data['title-ja'] || data.title || id
          },
          description: {
            zh: data['description-zh'] || data.description || '',
            en: data['description-en'] || data.description || '',
            ja: data['description-ja'] || data.description || ''
          },
          markdownPath: filePath,
          icon: data.icon || "image",
          level: data.level || 'beginner',
          coverImage: data.cover_image,
          tag: {
            zh: data['tag-zh'] || '',
            en: data['tag-en'] || '',
            ja: data['tag-ja'] || ''
          },
          tagColor: data.tag_color,
          author: data.author
        };
      })
    );
    
    // 过滤掉null值并返回
    return tutorialsList.filter(Boolean) as Tutorial[];
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return [];
  }
};

// 动态获取最佳实践教程数据
const fetchBestPractices = async (): Promise<Tutorial[]> => {
  try {
    // 发起API请求，获取best-practices目录下的所有文件
    const response = await fetch('/api/markdown/list?path=content/markdown/image-generation/best-practices');
    if (!response.ok) {
      console.error('Failed to fetch best practices list');
      return [];
    }
    
    const fileList = await response.json();
    
    // 从文件列表构建教程数组
    const bestPracticesList: Tutorial[] = await Promise.all(
      fileList.map(async (filename: string) => {
        const filePath = `content/markdown/image-generation/best-practices/${filename}`;
        
        // 获取文件内容
        const fileResponse = await fetch(`/api/markdown?path=${encodeURIComponent(filePath)}`);
        if (!fileResponse.ok) {
          console.error(`Failed to fetch file: ${filePath}`);
          return null;
        }
        
        const content = await fileResponse.text();
        const { data } = matter(content);
        
        // 从文件名生成ID
        const id = filename.replace('.md', '');
        
        return {
          id,
          title: {
            zh: data['title-zh'] || data.title || id,
            en: data['title-en'] || data.title || id,
            ja: data['title-ja'] || data.title || id
          },
          description: {
            zh: data['description-zh'] || data.description || '',
            en: data['description-en'] || data.description || '',
            ja: data['description-ja'] || data.description || ''
          },
          markdownPath: filePath,
          icon: data.icon || "edit",
          level: data.level || 'intermediate',
          coverImage: data.cover_image,
          tag: {
            zh: data['tag-zh'] || '',
            en: data['tag-en'] || '',
            ja: data['tag-ja'] || ''
          },
          tagColor: data.tag_color,
          author: data.author
        };
      })
    );
    
    // 过滤掉null值并返回
    return bestPracticesList.filter(Boolean) as Tutorial[];
  } catch (error) {
    console.error('Error fetching best practices:', error);
    return [];
  }
};

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
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [bestPractices, setBestPractices] = useState<Tutorial[]>([]);
  const [uiTexts, setUiTexts] = useState<any>({
    title: { zh: "图像生成教程", ja: "画像生成チュートリアル", en: "Image Generation Tutorials" },
    subtitle: { zh: "探索AI图像生成的技术和工具", ja: "AI画像生成の技術とツールを探索する", en: "Explore techniques and tools for AI image generation" },
    level: {
      beginner: { zh: "初学者", ja: "初心者", en: "Beginner" },
      intermediate: { zh: "中级", ja: "中級", en: "Intermediate" },
      advanced: { zh: "高级", ja: "上級", en: "Advanced" }
    },
    view: { zh: "查看教程", ja: "チュートリアルを見る", en: "View Tutorial" },
    close: { zh: "关闭", ja: "閉じる", en: "Close" },
    bestPracticesTitle: { zh: "最佳实践", ja: "ベストプラクティス", en: "Best Practices" },
    bestPracticesSubtitle: { zh: "专家撰写的AI图像生成技巧和经验", ja: "専門家によるAI画像生成のヒントとテクニック", en: "Expert tips and techniques for AI image generation" }
  });
  
  // 从本地存储获取语言设置
  useEffect(() => {
    const fetchData = async () => {
      setIsMounted(true);
      
      // 获取UI文本
      try {
        const texts = await loadImageGenUITexts();
        if (texts) {
          setUiTexts(texts);
        }
      } catch (error) {
        console.error('Error loading UI texts:', error);
      }
      
      // 获取教程数据
      try {
        const tutorialsData = await fetchTutorials();
        setTutorials(tutorialsData);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
      }
      
      // 获取最佳实践数据
      try {
        const bestPracticesData = await fetchBestPractices();
        setBestPractices(bestPracticesData);
      } catch (error) {
        console.error('Error fetching best practices:', error);
      }
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
  
  // 获取标签的颜色类
  const getTagColorClass = (tutorial: Tutorial): string => {
    const color = tutorial.tagColor || getLevelColor(tutorial.level);
    return `bg-${color}-100 text-${color}-800`;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-art-ink relative inline-block">
        {getLocaleText(uiTexts.title, currentLocale)}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-art-watercolor-blue opacity-70"></span>
      </h1>
      
      <p className="mb-8 text-art-charcoal">
        {getLocaleText(uiTexts.subtitle, currentLocale)}
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
                    {tutorial.tag ? getLocaleText(tutorial.tag, currentLocale) : getLocaleText(uiTexts.level[tutorial.level], currentLocale)}
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
                  {getLocaleText(uiTexts.view, currentLocale)}
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
          {getLocaleText(uiTexts.bestPracticesTitle, currentLocale)}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-art-watercolor-green opacity-70"></span>
        </h2>
        
        <p className="mb-8 text-art-charcoal">
          {getLocaleText(uiTexts.bestPracticesSubtitle, currentLocale)}
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
                      {practice.tag ? getLocaleText(practice.tag, currentLocale) : getLocaleText(uiTexts.level[practice.level], currentLocale)}
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
                    {getLocaleText(uiTexts.view, currentLocale)}
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