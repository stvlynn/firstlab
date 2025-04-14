import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Events } from '@/lib/types';

export async function GET() {
  try {
    const YAML_DIR = path.join(process.cwd(), 'src/content/yaml');
    const filePath = path.join(YAML_DIR, 'events/latest.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as Events;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading events:', error);
    return NextResponse.json(
      { error: 'Failed to load events data' },
      { status: 500 }
    );
  }
}