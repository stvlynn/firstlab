import { NextResponse } from 'next/server';
import { getAboutPageData } from '@/lib/about';

export async function GET() {
  try {
    const aboutData = getAboutPageData();
    
    if (!aboutData) {
      return NextResponse.json(
        { error: '无法加载About页面数据' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('获取About页面数据时出错:', error);
    
    return NextResponse.json(
      { error: '获取About页面数据时发生错误' },
      { status: 500 }
    );
  }
} 