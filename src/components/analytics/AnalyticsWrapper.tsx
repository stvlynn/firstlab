'use client';

import dynamic from 'next/dynamic';

// 在客户端组件中动态导入Google Analytics组件
const GoogleAnalytics = dynamic(() => import('@/lib/analytics'), {
  ssr: false,
});

// 在客户端组件中动态导入路由变化监听器
const RouteChangeTracker = dynamic(() => import('@/lib/routeChanges'), {
  ssr: false,
});

export function AnalyticsWrapper() {
  return (
    <>
      <GoogleAnalytics />
      <RouteChangeTracker />
    </>
  );
} 