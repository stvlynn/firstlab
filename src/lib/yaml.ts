import { SiteConfig, Events, Categories } from './types';

// 使用fetch API代替fs读取
const fetchConfigData = async (configName: string) => {
  try {
    // 有三种数据需要获取: site, dify, mcp
    // 在浏览器环境中使用绝对URL
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/config/${configName}`, { 
      next: { revalidate: 3600 } // 每小时重新验证一次
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ${configName} config`);
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${configName}:`, error);
    return null;
  }
};

// 缓存配置，避免重复请求
let siteConfigCache: SiteConfig | null = null;
let difyConfigCache: Categories | null = null;
let mcpConfigCache: Categories | null = null;

/**
 * 加载站点配置
 */
export async function loadSiteConfig(): Promise<SiteConfig> {
  if (siteConfigCache) return siteConfigCache;
  
  const data = await fetchConfigData('site');
  siteConfigCache = data;
  return data;
}

/**
 * 加载活动数据
 */
export async function loadEvents(): Promise<Events> {
  return fetchConfigData('events');
}

/**
 * 加载Dify分类数据
 */
export async function loadDifyCategories(): Promise<Categories> {
  if (difyConfigCache) return difyConfigCache;
  
  const data = await fetchConfigData('dify');
  difyConfigCache = data;
  return data;
}

/**
 * 加载MCP分类数据
 */
export async function loadMcpCategories(): Promise<Categories> {
  if (mcpConfigCache) return mcpConfigCache;
  
  const data = await fetchConfigData('mcp');
  mcpConfigCache = data;
  return data;
}

/**
 * 根据语言获取本地化文本
 */
export function getLocaleText(text: { [key: string]: string } | undefined, locale: string): string {
  if (!text) return '';
  return text[locale] || text.en || ''; // 如果没有找到对应语言版本，返回英文版本，若都没有则返回空字符串
} 