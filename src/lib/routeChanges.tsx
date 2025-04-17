'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageView } from '@/lib/analytics';

export default function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 监听路由变化来记录页面浏览
    if (pathname) {
      // 构建完整URL包括查询参数
      let url = pathname;
      if (searchParams?.toString()) {
        url += `?${searchParams.toString()}`;
      }

      // 发送页面浏览事件到Google Analytics
      pageView(url);
    }
  }, [pathname, searchParams]);

  return null; // 不渲染任何内容
} 