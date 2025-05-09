import { McpClientWrapper } from './McpClientWrapper';
import { createServerSupabase } from '@/utils/supabase/server-simple-new';
import { McpCategory } from './McpClientWrapper';

// 强制动态渲染，确保每次访问都从数据库获取最新数据
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function McpPage() {
  try {
    // 获取数据
    const supabase = await createServerSupabase();
    
    const { data: mcpItems, error } = await supabase
      .from('mcp')
      .select('*')
      .order('updated_at', { ascending: false });
    
    // 处理查询错误
    if (error) {
      throw new Error(`Supabase 查询错误: ${error.message}`);
    }
    
    // 验证数据格式
    const validCategories: McpCategory[] = ['writing', 'filesystem', 'device'];
    const invalidItems = mcpItems?.filter(item => 
      !validCategories.includes(item.category as McpCategory)
    ) || [];
    
    // 如果没有数据，显示提示信息
    if (!mcpItems || mcpItems.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
          <p className="text-art-pencil font-bold">没有找到 MCP 数据</p>
          <p className="text-sm text-art-pencil/70">请确保数据库中已添加数据</p>
          <p className="text-xs text-art-pencil/50 mt-4">
            Supabase 连接成功，但 MCP 表中没有记录
          </p>
        </div>
      );
    }
    
    // 渲染客户端组件，传入数据
    return <McpClientWrapper mcpItems={mcpItems} />;
  } catch (err) {
    // 捕获并显示错误信息
    const error = err as Error;
    
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <p className="text-art-pencil font-bold">加载 MCP 数据时发生错误</p>
        <p className="text-art-pencil">{error.message}</p>
        <p className="text-sm text-art-pencil/70">请检查环境变量和数据库连接</p>
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md max-w-xl text-sm">
          <p className="font-medium">可能的问题：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Supabase URL 或 API 密钥配置错误</li>
            <li>MCP 表不存在或结构不正确</li>
            <li>网络连接问题</li>
          </ul>
        </div>
      </div>
    );
  }
} 