import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import * as yaml from 'js-yaml';

// 定义YAML配置文件路径
const CONFIG_PATH = path.join(process.cwd(), 'src/content/yaml/image-generation/ui-texts.yaml');

export async function GET() {
  try {
    // 读取YAML文件
    const fileContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    
    // 解析YAML内容
    const data = yaml.load(fileContent);
    
    // 返回解析后的数据
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading image generation UI texts:', error);
    return NextResponse.json(
      { error: 'Failed to load image generation UI texts' },
      { status: 500 }
    );
  }
} 