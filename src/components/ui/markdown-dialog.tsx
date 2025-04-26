"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { DEFAULT_LOCALE } from '@/app/components/LanguageSwitcher';
import * as yaml from 'js-yaml';
import { HttpClient } from '@/lib/utils';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { NavIcon } from '@/lib/icons';

// Debug mode toggle - default to false in production
const DEBUG_MODE_ENABLED = false;

interface MarkdownDialogProps {
  title?: string;
  markdownPath: string;
  children?: React.ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  repo_id?: string | null;
}

interface MarkdownMetadata {
  metadata?: {
    date: string;
    organizer: string;
    image: string;
  };
}

// Add GitHub author information
interface GitHubInfo {
  author: string;
  repoName: string;
  avatarUrl: string | null;
}

// Create a standalone content component to ensure the latest language is used each time the dialog opens
const MarkdownContent = ({ markdownPath, locale, title, repo_id }: { markdownPath: string; locale: string; title?: string; repo_id?: string | null }) => {
  const [content, setContent] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MarkdownMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rawContent, setRawContent] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key
  const [githubInfo, setGithubInfo] = useState<GitHubInfo | null>(null);
  
  // Cache request results to avoid repeated loading
  const cacheKey = `${markdownPath}-${locale}-${refreshKey}`;
  const cachedContentRef = useRef<Record<string, {
    content: string;
    rawContent: string;
    metadata: MarkdownMetadata | null;
    timestamp: number;
  }>>({});

  // Function to force refresh content
  const refreshContent = useCallback(() => {
    // Clear cache for specific content
    delete cachedContentRef.current[cacheKey];
    // Increase refresh key to trigger reload
    setRefreshKey(prev => prev + 1);
    setIsLoading(true);
  }, [cacheKey]);

  // Load and process Markdown content
  useEffect(() => {
    let isMounted = true;
    console.log(`Starting to load markdown content, path: ${markdownPath}, language: ${locale}, refresh key: ${refreshKey}`);
    setIsLoading(true);
    setError(null);
    
    const now = Date.now();
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache expiry
    
    // Check if cache is valid
    const cached = cachedContentRef.current[cacheKey];
    if (cached && (now - cached.timestamp) < cacheExpiry) {
      setContent(cached.content);
      setRawContent(cached.rawContent);
      setMetadata(cached.metadata);
      setIsLoading(false);
      console.log(`Using cached content: ${cacheKey}`);
      return;
    }
    
    async function loadContent() {
      const loadStartTime = performance.now(); // Record load start time
      
      try {
        // 判断是否为GitHub URL
        const isGitHubUrl = markdownPath.startsWith('https://raw.githubusercontent.com/');
        
        // Use HttpClient to get content
        const text = isGitHubUrl 
          ? await HttpClient.getMarkdown(markdownPath)
          : await HttpClient.getMarkdown(markdownPath.replace('/api/markdown?path=', ''));
        
        if (!isMounted) return;
        
        const fetchEndTime = performance.now(); // Record fetch end time
        const fetchDuration = fetchEndTime - loadStartTime;
        
        console.log(`Retrieved content length: ${text.length} bytes, time: ${fetchDuration.toFixed(2)}ms`);
        setRawContent(text);
        
        // Process content
        const parseStartTime = performance.now(); // Record parsing start time
        const { extractedContent, parsedMetadata } = processMarkdownContent(text, locale);
        const parseEndTime = performance.now(); // Record parsing end time
        const parseDuration = parseEndTime - parseStartTime;
        
        // Update state
        setContent(extractedContent);
        setMetadata(parsedMetadata);
        
        // Update performance data
        perfData.current = {
          loadTime: fetchDuration,
          parseTime: parseDuration,
          renderTime: 0 // Render time will be updated in next frame
        };
        
        // Measure render time in next frame
        requestAnimationFrame(() => {
          const renderStartTime = performance.now();
          requestAnimationFrame(() => {
            const renderEndTime = performance.now();
            perfData.current.renderTime = renderEndTime - renderStartTime;
          });
        });
        
        // Cache results
        cachedContentRef.current[cacheKey] = {
          content: extractedContent,
          rawContent: text,
          metadata: parsedMetadata,
          timestamp: Date.now()
        };
        
        console.log(`Successfully processed markdown content, language: ${locale}, content length: ${extractedContent.length} bytes`);
      } catch (error) {
        if (!isMounted) return;
        console.error('Error loading Markdown content:', error);
        setError(`Failed to load content: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadContent();
    
    return () => {
      isMounted = false;
    };
  }, [markdownPath, locale, cacheKey, refreshKey]);

  // Process Markdown content, extract metadata and content for current language
  const processMarkdownContent = (text: string, locale: string): {
    extractedContent: string;
    parsedMetadata: MarkdownMetadata | null;
  } => {
    const startTime = performance.now();
    let parsedMetadata: MarkdownMetadata | null = null;
    let mdContent = text;
    
    // Extract metadata
    if (text.startsWith('---')) {
      const endIndex = text.indexOf('---', 3);
      if (endIndex !== -1) {
        const metaText = text.substring(3, endIndex).trim();
        try {
          parsedMetadata = yaml.load(metaText) as MarkdownMetadata;
          // Remove metadata section
          mdContent = text.substring(endIndex + 3).trim();
        } catch (e) {
          console.error('Error parsing metadata:', e);
        }
      }
    }
    
    // Function to extract language content
    const extractLanguageContent = (content: string, lang: string): string | null => {
      const langStart = `<lang-${lang}>`;
      const langEnd = `</lang-${lang}>`;
      const startIdx = content.indexOf(langStart);
      const endIdx = content.indexOf(langEnd);
      
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        return content.substring(startIdx + langStart.length, endIdx).trim();
      }
      return null;
    };
    
    // Try to extract current language content
    let extractedContent = extractLanguageContent(mdContent, locale);
    
    // If current language content not found, try English
    if (!extractedContent && locale !== 'en') {
      extractedContent = extractLanguageContent(mdContent, 'en');
      if (extractedContent) {
        console.log(`Content for ${locale} not found, using English content as fallback`);
      }
    }
    
    // If no tagged content found, use the entire document
    if (!extractedContent) {
      console.log('No language-tagged content found, using the entire document (excluding metadata)');
      extractedContent = mdContent;
    }
    
    const endTime = performance.now();
    console.log(`Markdown processing time: ${(endTime - startTime).toFixed(2)}ms`);
    
    return { extractedContent, parsedMetadata };
  };

  // Debug controls - only show when DEBUG_MODE_ENABLED is true
  const [showDebug, setShowDebug] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  
  // Collect performance data
  const perfData = useRef({
    loadTime: 0,
    renderTime: 0,
    parseTime: 0
  });

  // Get GitHub information
  useEffect(() => {
    if (repo_id) {
      // Extract author and repository name from repo_id (format: author/repo)
      const parts = repo_id.split('/');
      if (parts.length === 2) {
        const author = parts[0];
        const repoName = parts[1];
        
        // Build GitHub avatar URL
        const avatarUrl = `https://github.com/${author}.png`;
        
        setGithubInfo({
          author,
          repoName,
          avatarUrl
        });
      }
    }
  }, [repo_id]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-4">
        <p className="text-sm text-gray-500">Loading content, please wait...</p>
        <div className="h-4 bg-art-pencil/10 rounded w-3/4"></div>
        <div className="h-4 bg-art-pencil/10 rounded"></div>
        <div className="h-4 bg-art-pencil/10 rounded w-5/6"></div>
        <div className="h-32 bg-art-pencil/10 rounded"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <p className="font-semibold">Error loading content</p>
        <p>{error}</p>
        <div className="mt-4 space-x-3">
          <button 
            className="px-3 py-1 text-sm bg-white border border-red-300 text-red-600 rounded hover:bg-red-50"
            onClick={refreshContent}
          >
            Reload
          </button>
          {DEBUG_MODE_ENABLED && (
            <button 
              className="px-3 py-1 text-sm bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? 'Hide debug info' : 'Show debug info'}
            </button>
          )}
        </div>
        {DEBUG_MODE_ENABLED && showDebug && (
          <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60 border border-gray-300">
            {rawContent || 'No content'}
          </pre>
        )}
      </div>
    );
  }

  // Render empty content state
  if (!content) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-600 rounded-md">
        <p>Unable to load content for the selected language.</p>
        <div className="mt-4 space-x-3">
          <button 
            className="px-3 py-1 text-sm bg-white border border-yellow-300 text-yellow-600 rounded hover:bg-yellow-50"
            onClick={refreshContent}
          >
            Reload
          </button>
          {DEBUG_MODE_ENABLED && (
            <button 
              className="px-3 py-1 text-sm bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? 'Hide debug info' : 'Show debug info'}
            </button>
          )}
        </div>
        {DEBUG_MODE_ENABLED && showDebug && (
          <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60 border border-gray-300">
            {rawContent || 'No content'}
          </pre>
        )}
      </div>
    );
  }

  // Render normal content
  return (
    <>
      {/* GitHub author information */}
      {githubInfo && (
        <div className="flex items-center gap-3 mb-6 border-b pb-3">
          <div className="flex items-center gap-3">
            {githubInfo.avatarUrl && (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={githubInfo.avatarUrl} 
                  alt={`${githubInfo.author}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-semibold text-art-charcoal">{githubInfo.author}</div>
              <div className="text-sm text-art-charcoal/70">Created By</div>
            </div>
          </div>
          
          <div className="flex-grow"></div>
          
          <a 
            href={`https://github.com/${githubInfo.author}/${githubInfo.repoName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-art-charcoal/70 hover:text-art-charcoal"
          >
            <FaGithub className="w-5 h-5" />
            <span>{githubInfo.author}/{githubInfo.repoName}</span>
          </a>
        </div>
      )}

      {/* Metadata and image */}
      {metadata?.metadata && (
        <div className="flex flex-wrap text-sm text-art-pencil mt-2 gap-2 mb-4">
          <span>
            {locale === 'zh' ? 'Date: ' : 
             locale === 'ja' ? 'Date: ' : 'Date: '}
            {metadata.metadata.date}
          </span>
          <span>•</span>
          <span>
            {locale === 'zh' ? 'Organizer: ' : 
             locale === 'ja' ? 'Organizer: ' : 'Organizer: '}
            {metadata.metadata.organizer}
          </span>
        </div>
      )}
      
      {metadata?.metadata?.image && (
        <div className="w-full h-52 relative mb-6 overflow-hidden rounded-lg">
          <Image
            src={metadata.metadata.image}
            alt={title || "Content image"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="relative w-full overflow-hidden mb-6">
        {/* Render Markdown */}
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <ReactMarkdown
            skipHtml={false}
            components={{
              h1: ({...props}) => <h1 className="text-3xl font-bold mb-6 mt-2 border-b pb-2" {...props} />,
              h2: ({...props}) => <h2 className="text-2xl font-bold mb-4 mt-6" {...props} />,
              h3: ({...props}) => <h3 className="text-xl font-semibold mb-3 mt-5" {...props} />,
              p: ({...props}) => <p className="mb-4" {...props} />,
              ul: ({...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
              li: ({...props}) => <li className="mb-1" {...props} />,
              img: ({node, ...props}) => {
                // 处理图片URL
                let src = props.src || '';
                
                // 如果是相对路径且存在repo_id，则转换为GitHub raw URL
                if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/') && githubInfo) {
                  // 构建GitHub raw URL
                  src = `https://raw.githubusercontent.com/${githubInfo.author}/${githubInfo.repoName}/main/${src}`;
                }
                
                return (
                  <div className="my-6">
                    <img 
                      src={src} 
                      alt={props.alt || ""} 
                      className="rounded-md max-w-full mx-auto"
                      style={{ maxHeight: '500px' }}
                    />
                    {props.alt && <div className="text-center text-sm text-gray-500 mt-2">{props.alt}</div>}
                  </div>
                );
              },
              code: ({node, inline, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const [isCopied, setIsCopied] = useState(false);
                
                const handleCopy = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const code = String(children).replace(/\n$/, '');
                  navigator.clipboard.writeText(code)
                    .then(() => {
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    })
                    .catch(err => {
                      console.error('复制失败:', err);
                    });
                };
                
                if (inline) {
                  return (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                }
                
                if (match) {
                  return (
                    <div className="mb-4 mt-3 rounded-md overflow-hidden border border-gray-200">
                      <div className="bg-gray-100 px-3 py-1 text-xs text-gray-600 border-b border-gray-200 flex justify-between items-center">
                        <span>{match[1]}</span>
                        <button 
                          className="p-1 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                          onClick={handleCopy}
                          title={isCopied ? "已复制!" : "复制代码"}
                        >
                          {isCopied && <span className="text-green-600 text-xs">已复制!</span>}
                          <NavIcon id="copy" size="16px" className={isCopied ? "text-green-600" : "text-gray-500 hover:text-gray-700"} />
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={oneLight}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-b-md"
                        showLineNumbers
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  );
                }
                
                return (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        
        {/* Debug toolbar */}
        {DEBUG_MODE_ENABLED && (
          <div className="mt-6 pt-3 border-t border-art-pencil/10">
            <div className="flex flex-wrap gap-3 text-xs text-art-charcoal">
              <button 
                className="underline text-blue-600 hover:text-blue-800"
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? 'Hide debug info' : 'Show debug info'}
              </button>
              
              <button 
                className="underline text-green-600 hover:text-green-800"
                onClick={refreshContent}
              >
                Refresh content
              </button>
              
              <button 
                className="underline text-purple-600 hover:text-purple-800"
                onClick={() => setShowPerformance(!showPerformance)}
              >
                {showPerformance ? 'Hide performance data' : 'Show performance data'}
              </button>
            </div>
            
            {/* Performance data display */}
            {showPerformance && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md text-xs border border-gray-200">
                <h4 className="font-semibold mb-2">Performance data:</h4>
                <ul className="space-y-1">
                  <li>Load time: {perfData.current.loadTime.toFixed(2)}ms</li>
                  <li>Parse time: {perfData.current.parseTime.toFixed(2)}ms</li>
                  <li>Render time: {perfData.current.renderTime.toFixed(2)}ms</li>
                </ul>
              </div>
            )}
            
            {/* Debug information display */}
            {showDebug && (
              <div className="mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-semibold mb-2">Parsed content:</h4>
                    <pre className="p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40 border border-gray-300 whitespace-pre-wrap">
                      {content ? (content.length > 500 ? content.substring(0, 500) + '...' : content) : 'No content'}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Raw response content:</h4>
                    <pre className="p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40 border border-gray-300 whitespace-pre-wrap">
                      {rawContent ? (rawContent.length > 500 ? rawContent.substring(0, 500) + '...' : rawContent) : 'No content'}
                    </pre>
                  </div>
                </div>
                
                <div className="mt-3">
                  <h4 className="font-semibold mb-2">Metadata:</h4>
                  <pre className="p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40 border border-gray-300">
                    {metadata ? JSON.stringify(metadata, null, 2) : 'No metadata'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const MarkdownDialog: React.FC<MarkdownDialogProps> = ({
  title,
  markdownPath,
  children,
  className,
  open,
  onOpenChange,
  repo_id,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LOCALE);
  const [mountKey, setMountKey] = useState<number>(Date.now());
  
  // 使用受控模式或内部状态
  const isOpen = open !== undefined ? open : internalIsOpen;
  
  // Listen for language changes
  useEffect(() => {
    const savedLocale = localStorage.getItem('preferredLanguage');
    if (savedLocale) {
      setCurrentLocale(savedLocale);
    }
    
    const handleLocaleChange = (event: CustomEvent) => {
      console.log(`Language changed to: ${event.detail.locale} (current: ${currentLocale})`);
      setCurrentLocale(event.detail.locale);
      // Force remount of content component
      setMountKey(Date.now());
    };
    
    window.addEventListener('localeChanged', handleLocaleChange as EventListener);
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
    };
  }, [currentLocale]);

  // Force update content when opening dialog
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Force update when opening dialog
      console.log(`Dialog opening with locale: ${currentLocale}, path: ${markdownPath}`);
      setMountKey(Date.now());
    }
    
    // 使用传入的状态更新方法或内部状态
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalIsOpen(newOpen);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className={className}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto art-paper rounded-xl shadow-xl">
        <DialogHeader>
          {title && <DialogTitle className="text-3xl font-bold text-art-ink pb-2 border-b mb-6">{title}</DialogTitle>}
        </DialogHeader>
        
        {/* Force component remount when language changes using key prop */}
        <MarkdownContent 
          key={`${mountKey}-${currentLocale}`} 
          markdownPath={markdownPath} 
          locale={currentLocale}
          title={title}
          repo_id={repo_id}
        />
      </DialogContent>
    </Dialog>
  );
};

export { MarkdownDialog }; 