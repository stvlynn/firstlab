import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MarkdownEvent, LocaleText, EventMetadata } from './types';

// Events markdown base directory path
let EVENTS_DIRECTORY: string;

// Set the events directory path with proper error handling
try {
  EVENTS_DIRECTORY = path.join(process.cwd(), 'src/content/markdown/events');
} catch (error) {
  console.error('Error setting EVENTS_DIRECTORY:', error);
  EVENTS_DIRECTORY = ''; // Fallback empty path
}

/**
 * Extract the first heading from markdown content
 * @param content Markdown content
 * @returns Extracted heading or empty string if not found
 */
function extractFirstHeading(content: string): string {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  return headingMatch ? headingMatch[1].trim() : '';
}

/**
 * Extract the first paragraph from markdown content
 * @param content Markdown content
 * @returns Extracted paragraph or empty string if not found
 */
function extractFirstParagraph(content: string): string {
  // Skip titles and find the first non-empty paragraph
  const paragraphMatch = content.split(/\n#+\s+[^\n]+\n/)[1]?.match(/^\s*([^#\s][^\n]+)/m);
  return paragraphMatch ? paragraphMatch[1].trim() : '';
}

/**
 * Extract language-specific content from markdown text
 * @param markdown Full markdown text
 * @param lang Language code
 * @returns Extracted language content or null if not found
 */
function extractLanguageContent(markdown: string, lang: string): string | null {
  const langStart = `<lang-${lang}>`;
  const langEnd = `</lang-${lang}>`;
  
  const startIdx = markdown.indexOf(langStart);
  const endIdx = markdown.indexOf(langEnd);
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return markdown.substring(startIdx + langStart.length, endIdx).trim();
  }
  return null;
}

/**
 * Parse a single event markdown file
 * @param filePath File path
 * @returns Parsed event object or null if parsing fails
 */
export function parseEventMarkdown(filePath: string): MarkdownEvent | null {
  try {
    // Ensure we're on the server side before using fs
    if (typeof window !== 'undefined') {
      console.warn('parseEventMarkdown cannot run on the client side');
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Extract slug from filename
    const filename = path.basename(filePath);
    const slug = filename.replace(/\.md$/, '');
    
    // Validate metadata
    const metadata = data.metadata as EventMetadata;
    if (!metadata || !metadata.date) {
      console.error(`Missing required metadata in ${filePath}`);
      return null;
    }
    
    // Extract content for each language
    const languageCodes = ['zh', 'ja', 'en'];
    const languageContents: Record<string, string> = {};
    const titles: Record<string, string> = {};
    const descriptions: Record<string, string> = {};
    
    languageCodes.forEach(lang => {
      const langContent = extractLanguageContent(content, lang);
      if (langContent) {
        languageContents[lang] = langContent;
        titles[lang] = extractFirstHeading(langContent);
        
        // 使用metadata中的summary字段，如果存在
        const summaryKey = `summary-${lang}` as keyof EventMetadata;
        descriptions[lang] = metadata[summaryKey] as string || extractFirstParagraph(langContent);
      }
    });
    
    // Ensure at least one language has content
    if (Object.keys(languageContents).length === 0) {
      console.error(`No language content found in ${filePath}`);
      return null;
    }
    
    // Build localized text objects
    const title: LocaleText = {
      zh: titles.zh || titles.en || '',
      ja: titles.ja || titles.en || '',
      en: titles.en || titles.zh || ''
    };
    
    const description: LocaleText = {
      zh: descriptions.zh || descriptions.en || '',
      ja: descriptions.ja || descriptions.en || '',
      en: descriptions.en || descriptions.zh || ''
    };
    
    return {
      slug,
      metadata,
      content: languageContents,
      title,
      description
    };
  } catch (error) {
    console.error(`Error parsing event markdown ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all event markdown data
 * @returns Array of all events
 */
export function getAllEventMarkdowns(): MarkdownEvent[] {
  try {
    // Ensure we're on the server side before using fs
    if (typeof window !== 'undefined') {
      console.warn('getAllEventMarkdowns cannot run on the client side');
      return [];
    }
    
    if (!EVENTS_DIRECTORY) {
      console.error('EVENTS_DIRECTORY is not set');
      return [];
    }
    
    const fileNames = fs.readdirSync(EVENTS_DIRECTORY);
    
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const filePath = path.join(EVENTS_DIRECTORY, fileName);
        return parseEventMarkdown(filePath);
      })
      .filter((event): event is MarkdownEvent => event !== null)
      .sort((a, b) => {
        // Sort by date in descending order
        return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
      });
  } catch (error) {
    console.error('Error reading event markdowns:', error);
    return [];
  }
}

/**
 * Get a specific event by slug
 * @param slug Event slug
 * @returns Matching event or null if not found
 */
export function getEventMarkdownBySlug(slug: string): MarkdownEvent | null {
  try {
    // Ensure we're on the server side before using fs
    if (typeof window !== 'undefined') {
      console.warn('getEventMarkdownBySlug cannot run on the client side');
      return null;
    }
    
    if (!EVENTS_DIRECTORY) {
      console.error('EVENTS_DIRECTORY is not set');
      return null;
    }
    
    const filePath = path.join(EVENTS_DIRECTORY, `${slug}.md`);
    
    if (fs.existsSync(filePath)) {
      return parseEventMarkdown(filePath);
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting event by slug ${slug}:`, error);
    return null;
  }
} 