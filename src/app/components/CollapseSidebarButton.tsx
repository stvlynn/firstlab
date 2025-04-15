"use client";

import React, { useState, useEffect } from 'react';
import { NavIcon } from '@/lib/icons';
import { getNavCollapsedState, setNavCollapsedState } from '@/lib/navigation-state';

export function CollapseSidebarButton() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // 监听导航栏状态变化
  useEffect(() => {
    // 初始化状态
    setIsCollapsed(getNavCollapsedState());
    
    // 监听状态变化
    const handleStateChange = (event: CustomEvent) => {
      setIsCollapsed(event.detail.isCollapsed);
    };
    
    window.addEventListener('navStateChanged', handleStateChange as EventListener);
    
    return () => {
      window.removeEventListener('navStateChanged', handleStateChange as EventListener);
    };
  }, []);
  
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    setNavCollapsedState(newState);
  };
  
  return (
    <button
      onClick={toggleCollapse}
      className={`fixed z-50 top-1/2 transform -translate-y-1/2 hidden md:flex items-center justify-center w-6 h-6 p-1 rounded-full bg-white hover:bg-gray-100 transition-all duration-300 shadow-md border border-art-pencil/20 ${
        isCollapsed ? 'left-[60px]' : 'left-[256px]'
      }`}
      aria-label={isCollapsed ? "展开导航栏" : "折叠导航栏"}
    >
      <NavIcon 
        id={isCollapsed ? "nav-arrow-right" : "nav-arrow-left"} 
        size="1em"
        className="text-art-ink"
      />
    </button>
  );
} 