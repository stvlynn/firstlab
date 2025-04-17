import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { McpCategory } from '@/app/mcp/McpClientWrapper'

// 创建服务器组件使用的 Supabase 客户端 - 按照官方文档方式
export const createServerSupabase = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  console.log('[Supabase] 创建客户端连接:', { 
    url: supabaseUrl,
    keyType: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE_KEY' : 'ANON_KEY',
    keyLength: supabaseKey?.length
  })
  
  return createClient<Database>(
    supabaseUrl, 
    supabaseKey,
    {
      auth: { persistSession: false },
      db: { 
        schema: 'public',
      },
    }
  )
}

// 获取 MCP 数据函数（服务器端版本）- 简化并按照官方文档方式
export const getMcpItemsServer = async () => {
  try {
    console.log('Fetching MCP items from server...')
    const supabase = await createServerSupabase()
    
    // 简单记录 Supabase 连接信息
    console.log('Connected to Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    console.log('Supabase request:', { table: 'mcp', action: 'select', order: 'updated_at desc' });
    const { data, error } = await supabase
      .from('mcp')
      .select('*')
      .order('updated_at', { ascending: false })
    console.log('Supabase response:', { data, error });
    
    if (error) {
      console.error('Error fetching MCP items:', error)
      return []
    }
    
    console.log(`Successfully fetched ${data?.length || 0} MCP items`)
    
    // 验证返回的数据结构与预期类型是否匹配
    if (data && data.length > 0) {
      // 验证 category 字段是否符合 McpCategory 类型要求
      const validCategories = ['writing', 'filesystem', 'device'] as const
      
      // 记录任何类型不匹配的数据
      const invalidItems = data.filter(item => 
        !validCategories.includes(item.category as any)
      )
      
      if (invalidItems.length > 0) {
        console.warn(`Found ${invalidItems.length} items with invalid category values:`, 
          invalidItems.map(item => ({id: item.id, category: item.category}))
        )
      }
    }
    
    return data || []
  } catch (error) {
    console.error('Failed to fetch MCP items:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    return []
  }
}

// 根据分类获取 MCP 数据
export const getMcpItemsByCategory = async (category: McpCategory) => {
  try {
    console.log(`Fetching MCP items by category: ${category}`)
    const supabase = await createServerSupabase()
    
    const { data, error } = await supabase
      .from('mcp')
      .select('*')
      .eq('category', category)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching MCP items by category:', error)
      return []
    }
    
    console.log(`Successfully fetched ${data?.length || 0} MCP items for category ${category}`)
    return data || []
  } catch (error) {
    console.error(`Failed to fetch MCP items for category ${category}:`, error)
    return []
  }
}

// 兼容性函数 - 保持向后兼容
export const getMcpItemsByCategoryServer = getMcpItemsByCategory
export const getMcpItemsByCategoryServerSimple = getMcpItemsByCategory 