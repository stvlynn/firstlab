import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { SiteConfig } from '@/lib/types';

export async function GET() {
  try {
    const YAML_DIR = path.join(process.cwd(), 'src/content/yaml');
    const filePath = path.join(YAML_DIR, 'site.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as SiteConfig;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading site config:', error);
    return NextResponse.json(
      { error: 'Failed to load site configuration' },
      { status: 500 }
    );
  }
}