/**
 * 测试脚本 - 向 Supabase 的 MCP 表插入测试数据
 * 
 * 使用方法:
 * 1. 确保 .env.local 文件中包含正确的 Supabase 连接信息
 * 2. 运行: npx ts-node -r dotenv/config src/scripts/insert-test-mcp.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// 测试数据
const TEST_MCP_DATA = [
  {
    title: 'Notion MCP 工具',
    description: '使用 MCP 与 Notion 集成的工具和示例',
    image_url: 'https://notion.so/images/meta/default.png',
    content: '# Notion MCP 工具\n\n这是一个示例 Markdown 内容，用于测试 MCP 功能。',
    repo_id: 'makenotion/notion-mcp-server',
    category: 'writing',
  },
  {
    title: '文件系统管理器',
    description: '基于 MCP 的文件系统管理工具，支持多平台',
    image_url: 'https://placehold.co/600x400/orange/white?text=Filesystem',
    content: '# MCP 文件系统管理器\n\n这是一个示例内容，用于测试 MCP 文件系统分类。',
    repo_id: null,
    category: 'filesystem',
  },
  {
    title: '设备控制中心',
    description: 'MCP 设备控制中心，支持多种智能设备管理',
    image_url: 'https://placehold.co/600x400/blue/white?text=Device',
    content: '# MCP 设备控制中心\n\n这是一个示例内容，用于测试 MCP 设备分类。',
    repo_id: null,
    category: 'device',
  },
];

async function main() {
  // 创建 Supabase 客户端
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('错误: 缺少 Supabase 连接信息。请检查 .env.local 文件。');
    process.exit(1);
  }
  
  console.log('连接到 Supabase:', supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 插入测试数据
    for (const item of TEST_MCP_DATA) {
      console.log(`插入数据: ${item.title}`);
      
      const { data, error } = await supabase
        .from('mcp')
        .upsert({
          ...item,
          updated_at: new Date().toISOString(),
        })
        .select();
        
      if (error) {
        console.error(`插入数据失败: ${item.title}`, error);
      } else {
        console.log(`成功插入数据: ${item.title}`, data);
      }
    }
    
    console.log('所有测试数据插入完成！');
  } catch (err) {
    console.error('插入数据时发生错误:', err);
  }
}

// 执行主函数
main().catch(console.error); 