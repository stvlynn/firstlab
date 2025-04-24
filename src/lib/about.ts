import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { LocaleText } from './types';
import * as yaml from 'js-yaml';

// 定义About页面配置加载路径
const ABOUT_CONFIG_PATH = path.join(process.cwd(), 'src/content/yaml/about/sections.yaml');
const ABOUT_MARKDOWN_DIR = path.join(process.cwd(), 'src/content/markdown');

// 定义About部分接口
export interface AboutSection {
  id: string;
  title: LocaleText;
  markdown: string;
  icon?: string;
  priority: number;
  content?: Record<string, string>; // 每种语言的内容
  metadata?: Record<string, any>;
}

// 定义About页面UI接口
export interface AboutUI {
  title: LocaleText;
  subtitle: LocaleText;
  loading: LocaleText;
}

// 定义About页面配置接口
export interface AboutConfig {
  ui: AboutUI;
  sections: AboutSection[];
}

/**
 * 加载About页面配置文件
 */
export function loadAboutConfig(): AboutConfig | null {
  try {
    // 确保在服务器端执行
    if (typeof window !== 'undefined') {
      console.warn('loadAboutConfig不能在客户端执行');
      return null;
    }

    if (!fs.existsSync(ABOUT_CONFIG_PATH)) {
      console.error(`找不到配置文件: ${ABOUT_CONFIG_PATH}`);
      return null;
    }

    const fileContent = fs.readFileSync(ABOUT_CONFIG_PATH, 'utf8');
    const data = yaml.load(fileContent) as AboutConfig;
    
    if (!data.sections || !Array.isArray(data.sections)) {
      console.error('配置文件格式错误: sections必须是数组');
      return null;
    }

    return data;
  } catch (error) {
    console.error('加载About配置文件失败:', error);
    return null;
  }
}

/**
 * 从Markdown文件中提取特定语言的内容
 */
function extractLanguageContent(content: string, lang: string): string | null {
  const langStart = `<lang-${lang}>`;
  const langEnd = `</lang-${lang}>`;
  
  const startIdx = content.indexOf(langStart);
  const endIdx = content.indexOf(langEnd);
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return content.substring(startIdx + langStart.length, endIdx).trim();
  }
  return null;
}

/**
 * 加载指定部分的Markdown内容
 */
export function loadSectionMarkdown(markdownPath: string): {
  content: Record<string, string>;
  metadata: Record<string, any>;
} | null {
  try {
    // 确保在服务器端执行
    if (typeof window !== 'undefined') {
      console.warn('loadSectionMarkdown不能在客户端执行');
      return null;
    }

    const fullPath = path.join(ABOUT_MARKDOWN_DIR, markdownPath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`找不到Markdown文件: ${fullPath}`);
      return null;
    }

    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // 提取每种语言的内容
    const languageCodes = ['zh', 'ja', 'en'];
    const languageContents: Record<string, string> = {};
    
    languageCodes.forEach(lang => {
      const langContent = extractLanguageContent(content, lang);
      if (langContent) {
        languageContents[lang] = langContent;
      }
    });

    // 确保至少有一种语言的内容
    if (Object.keys(languageContents).length === 0) {
      console.error(`没有找到任何语言的内容: ${fullPath}`);
      return null;
    }

    return {
      content: languageContents,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error(`加载Markdown文件失败: ${markdownPath}`, error);
    return null;
  }
}

/**
 * 获取完整的About页面数据
 */
export function getAboutPageData(): AboutConfig | null {
  try {
    // 确保在服务器端执行
    if (typeof window !== 'undefined') {
      console.warn('getAboutPageData不能在客户端执行');
      return null;
    }

    const config = loadAboutConfig();
    if (!config) return null;

    // 加载每个部分的内容
    const sectionsWithContent = config.sections.map(section => {
      const markdownData = loadSectionMarkdown(section.markdown);
      
      if (markdownData) {
        return {
          ...section,
          content: markdownData.content,
          metadata: markdownData.metadata
        };
      }
      
      return section;
    });

    // 按优先级排序
    const sortedSections = sectionsWithContent.sort((a, b) => a.priority - b.priority);

    return {
      ui: config.ui,
      sections: sortedSections
    };
  } catch (error) {
    console.error('获取About页面数据失败:', error);
    return null;
  }
} 