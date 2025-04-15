import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export async function GET() {
  try {
    const YAML_DIR = path.join(process.cwd(), 'src/content/yaml');
    const filePath = path.join(YAML_DIR, 'events/ui.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading events UI translations:', error);
    return NextResponse.json(
      { error: 'Failed to load events UI translations' },
      { status: 500 }
    );
  }
} 