import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Categories } from '@/lib/types';

export async function GET() {
  try {
    const YAML_DIR = path.join(process.cwd(), 'src/content/yaml');
    const filePath = path.join(YAML_DIR, 'dify/categories.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as Categories;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading Dify categories:', error);
    return NextResponse.json(
      { error: 'Failed to load Dify categories' },
      { status: 500 }
    );
  }
}