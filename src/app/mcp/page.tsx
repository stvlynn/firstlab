import { McpClientWrapper } from './McpClientWrapper';
import { getMcpItemsServer } from '@/utils/supabase/server-simple-new';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // 禁用缓存，确保每次访问都从数据库获取最新数据

export default async function McpPage() {
  console.log('开始加载 MCP 页面...');
  
  try {
    // 使用新的服务器端函数获取 MCP 数据
    const mcpItems = await getMcpItemsServer();
    
    console.log(`成功获取 ${mcpItems.length} 条 MCP 数据，渲染客户端组件`);
    console.log('MCP 数据内容:', JSON.stringify(mcpItems, null, 2));
    
    // 如果没有数据，显示提示信息
    if (!mcpItems || mcpItems.length === 0) {
      console.log('没有获取到任何 MCP 数据');
      return (
        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
          <p className="text-art-pencil font-bold">没有找到 MCP 数据</p>
          <p className="text-sm text-art-pencil/70">请确保数据库中已添加数据</p>
        </div>
      );
    }
    
    // 渲染客户端组件，传入数据
    return <McpClientWrapper mcpItems={mcpItems} />;
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