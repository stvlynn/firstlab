import { createClient } from '@supabase/supabase-js';
import { McpClientWrapper } from './McpClientWrapper';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // 禁用缓存，确保每次访问都从数据库获取最新数据

export default async function McpPage() {
  console.log('开始初始化 Supabase 客户端');
  
  try {
    // 直接使用环境变量创建 Supabase 客户端
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('缺少 Supabase 环境变量');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('成功初始化 Supabase 客户端，正在获取 MCP 数据');
    
    // 从 Supabase 获取 MCP 数据
    const { data: mcpItems, error } = await supabase
      .from('mcp')
      .select('*')
      .order('updated_at', { ascending: false });
    
    // 处理查询错误
    if (error) {
      console.error('获取 MCP 数据时出错:', error);
      return (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-art-pencil">加载数据时出错: {error.message}</p>
        </div>
      );
    }
    
    // 记录成功获取的数据条目数
    console.log(`成功获取 ${mcpItems?.length || 0} 条 MCP 数据`);
    
    // 渲染客户端组件，传入数据
    return <McpClientWrapper mcpItems={mcpItems || []} />;
  } catch (err) {
    // 捕获并显示更详细的错误信息
    const error = err as Error;
    console.error('MCP 页面发生错误:', error);
    
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <p className="text-art-pencil font-bold">加载 MCP 数据时发生错误</p>
        <p className="text-art-pencil">{error.message}</p>
        <p className="text-sm text-art-pencil/70">请检查环境变量和数据库连接</p>
      </div>
    );
  }
}