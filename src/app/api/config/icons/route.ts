import { NextResponse } from 'next/server';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/content/yaml/icons.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading icons config:', error);
    return NextResponse.json(
      { error: 'Failed to load icons configuration' },
      { status: 500 }
    );
  }
} 