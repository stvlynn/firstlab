import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // 从查询参数中获取目录路径
    const url = new URL(request.url);
    const dirPath = url.searchParams.get('path');
    
    if (!dirPath) {
      return NextResponse.json(
        { error: 'Missing directory path' },
        { status: 400 }
      );
    }
    
    console.log(`API: Requested to list markdown files in directory: ${dirPath}`);
    
    // 构建完整的目录路径（基于项目根目录）
    const fullPath = path.join(process.cwd(), 'src', dirPath);
    console.log(`API: Full path: ${fullPath}`);
    
    // 检查路径是否在内容目录下（安全检查）
    if (!fullPath.startsWith(path.join(process.cwd(), 'src', 'content'))) {
      console.error('Security error: Attempted to access directory outside content directory');
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // 确保目录存在
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      console.error(`Directory not found: ${fullPath}`);
      return NextResponse.json(
        { error: 'Directory not found' },
        { status: 404 }
      );
    }
    
    // 读取目录内容，过滤出Markdown文件
    const files = fs.readdirSync(fullPath)
      .filter(file => file.endsWith('.md'));
      
    console.log(`API: Found ${files.length} markdown files in ${dirPath}`);
    
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error listing markdown files:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 