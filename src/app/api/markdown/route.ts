import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // 从查询参数中获取文件路径
    const url = new URL(request.url);
    const filePath = url.searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'Missing file path' },
        { status: 400 }
      );
    }
    
    console.log(`API: Requested to read markdown file: ${filePath}`);
    
    // 构建完整的文件路径（基于项目根目录）
    const fullPath = path.join(process.cwd(), 'src', filePath);
    console.log(`API: Full path: ${fullPath}`);
    
    // 检查路径是否在内容目录下（安全检查）
    if (!fullPath.startsWith(path.join(process.cwd(), 'src', 'content'))) {
      console.error('Security error: Attempted to access file outside content directory');
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // 读取文件内容
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    console.log(`API: Successfully read file (${fileContent.length} bytes)`);
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/markdown',
      },
    });
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 