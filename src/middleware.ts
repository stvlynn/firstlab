import { NextResponse } from 'next/server';

// 定义中间件处理函数
export function middleware() {
  // 默认不修改请求
  return NextResponse.next();
}

// 定义匹配规则（哪些路径会触发中间件）
export const config = {
  // 匹配所有路径，除了以下内容:
  // - API 路由 (/api/*)
  // - 静态文件 (_next/*, *.jpg, *.png, 等)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 