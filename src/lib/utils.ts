import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * HTTP客户端类，用于简化API调用和错误处理
 */
export class HttpClient {
  /**
   * 发送HTTP请求并处理常见问题（超时、重试等）
   * @param url - API地址
   * @param options - 请求选项
   * @param retries - 最大重试次数
   * @param timeout - 超时时间（毫秒）
   * @returns 响应数据
   */
  static async fetch<T>(
    url: string, 
    options?: RequestInit, 
    retries = 1, 
    timeout = 10000
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // 将中止信号添加到选项中
      const fetchOptions: RequestInit = {
        ...options,
        signal: controller.signal,
      };

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      // 根据Content-Type解析响应
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        return await response.json() as T;
      } else if (contentType.includes('text')) {
        return await response.text() as unknown as T;
      } else {
        throw new Error(`Unsupported content type: ${contentType}`);
      }
    } catch (error) {
      clearTimeout(timeoutId);

      // 处理超时
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeout}ms`);
      }

      // 处理重试
      if (retries > 0) {
        console.log(`重试请求: ${url}, 剩余重试次数: ${retries - 1}`);
        return HttpClient.fetch<T>(url, options, retries - 1, timeout);
      }

      // 转发错误
      throw error;
    }
  }

  /**
   * 获取Markdown内容
   * @param path - Markdown文件路径或完整URL
   * @returns Markdown文本内容
   */
  static async getMarkdown(path: string): Promise<string> {
    try {
      // 判断是否为完整URL（GitHub raw路径）
      if (path.startsWith('http')) {
        console.log(`从外部URL获取Markdown: ${path}`);
        return await HttpClient.fetch<string>(path, {
          headers: {
            'Accept': 'text/plain, application/octet-stream'
          }
        }, 2);
      }
      
      // 使用内部API路径
      const apiUrl = `/api/markdown?path=${encodeURIComponent(path)}`;
      return await HttpClient.fetch<string>(apiUrl, undefined, 2);
    } catch (error) {
      console.error(`加载Markdown失败: ${path}`, error);
      throw new Error(`无法加载Markdown内容: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
