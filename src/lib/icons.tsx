"use client";

import React from 'react';
import * as IconoirIcons from 'iconoir-react';
import { loadIconsConfig } from '@/lib/yaml';

// 图标配置类型
interface IconsConfig {
  navigation_icons: {
    [key: string]: string;
  };
  icon_styles: {
    [key: string]: {
      color: string;
      width: string;
      height: string;
      strokeWidth: number;
    };
  };
}

// 图标属性类型
interface IconProps {
  name: string;
  styleType?: 'default' | 'navbar' | 'footer' | 'social' | 'button' | 'language';
  className?: string;
  color?: string;
  size?: string | number;
  strokeWidth?: number;
}

// 配置缓存
let iconsConfigCache: IconsConfig | null = null;

// 默认图标配置
const defaultIconsConfig: IconsConfig = {
  navigation_icons: {
    home: 'Home',
    dify: 'CurveArray',
    mcp: 'Hammer',
    events: 'BellNotification',
    about: 'InfoCircle',
    discord: 'Discord',
    language: 'Globe'
  },
  icon_styles: {
    default: {
      color: 'currentColor',
      width: '1.25em',
      height: '1.25em',
      strokeWidth: 1.5
    },
    navbar: {
      color: 'currentColor',
      width: '1.25em',
      height: '1.25em',
      strokeWidth: 1.5
    },
    footer: {
      color: '#666',
      width: '1.25em',
      height: '1.25em',
      strokeWidth: 1.5
    },
    social: {
      color: '#333',
      width: '1.5em',
      height: '1.5em',
      strokeWidth: 1.5
    },
    button: {
      color: 'currentColor',
      width: '1.25em',
      height: '1.25em',
      strokeWidth: 1.5
    },
    language: {
      color: 'currentColor',
      width: '1.5em',
      height: '1.5em',
      strokeWidth: 1.5
    }
  }
};

// 获取图标配置
export const getIconsConfig = (): IconsConfig => {
  // 如果已有缓存，直接返回
  if (iconsConfigCache) {
    return iconsConfigCache;
  }

  try {
    // 尝试从yaml加载
    const config = loadIconsConfig();
    
    // 如果是Promise，则返回默认配置，并在Promise解析后更新缓存
    if (config instanceof Promise) {
      // 异步更新缓存
      config.then((data) => {
        iconsConfigCache = data as IconsConfig;
      }).catch(error => {
        console.error('Failed to load icons config:', error);
      });
      
      // 先返回默认配置
      return defaultIconsConfig;
    }
    
    // 非Promise，直接缓存并返回
    iconsConfigCache = config as IconsConfig;
    return iconsConfigCache;
  } catch (error) {
    console.error('Failed to load icons config:', error);
    return defaultIconsConfig;
  }
};

// 根据ID获取导航图标
export const getNavIcon = (id: string): string => {
  const config = getIconsConfig();
  return config.navigation_icons[id] || 'QuestionMark';
};

// 获取图标样式
export const getIconStyle = (
  styleType: 'default' | 'navbar' | 'footer' | 'social' | 'button' | 'language' = 'default'
) => {
  const config = getIconsConfig();
  return config.icon_styles[styleType] || config.icon_styles.default;
};

// 图标组件
export const Icon: React.FC<{
  name: string;
  className?: string;
  size?: string | number;
  styleType?: 'default' | 'navbar' | 'footer' | 'social' | 'button' | 'language';
}> = ({ name, className = '', size, styleType = 'default' }) => {
  // 获取样式配置
  const styleConfig = getIconStyle(styleType);
  
  // 优先使用传入的props，否则使用配置
  const finalProps = {
    color: styleConfig.color,
    width: size || styleConfig.width,
    height: size || styleConfig.height,
    strokeWidth: styleConfig.strokeWidth,
    className,
  };
  
  // 从Iconoir获取图标组件
  // 使用断言而不是any
  const IconComponent = (IconoirIcons as Record<string, React.ElementType>)[name];
  
  if (!IconComponent) {
    console.warn(`Icon '${name}' not found`);
    return <IconoirIcons.QuestionMark {...finalProps} />;
  }
  
  return <IconComponent {...finalProps} />;
};

// 导航图标组件
export const NavIcon: React.FC<{
  id: string;
  className?: string;
  size?: string | number;
  styleType?: 'default' | 'navbar' | 'footer' | 'social' | 'button' | 'language';
}> = ({ id, className = '', size, styleType = 'navbar' }) => {
  const iconName = getNavIcon(id);
  return <Icon name={iconName} styleType={styleType} className={className} size={size} />;
}; 