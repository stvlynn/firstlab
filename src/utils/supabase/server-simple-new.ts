import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { McpCategory } from '@/app/mcp/McpClientWrapper'

// 创建服务器组件使用的简单 Supabase 客户端
export const createServerSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient<Database>(supabaseUrl, supabaseKey)
}

// 获取 MCP 数据函数（服务器端版本）
export const getMcpItemsServer = async () => {
  try {
    console.log('Fetching MCP items from server...')
    const supabase = createServerSupabase()
    
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Using ANON KEY length:', (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').substring(0, 10) + '...')
    
    const { data, error } = await supabase
      .from('mcp')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Server: Error fetching MCP items:', error)
      return []
    }
    
    if (!data || data.length === 0) {
      console.log('Server: No MCP items found in the database')
    } else {
      console.log(`Server: Successfully fetched ${data.length} MCP items`)
      // 打印第一条数据的结构，不打印敏感内容
      if (data.length > 0) {
        const sampleData = { ...data[0] }
        console.log('Sample MCP item structure:', JSON.stringify(sampleData, null, 2))
      }
    }
    
    return data || []
  } catch (error) {
    console.error('Server: Failed to fetch MCP items:', error)
    // 更详细的错误信息
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
    return []
  }
}

// 根据分类获取 MCP 数据（服务器端版本）
export const getMcpItemsByCategoryServer = async (category: McpCategory) => {
  try {
    console.log(`Server: Fetching MCP items by category: ${category}`)
    const supabase = createServerSupabase()
    
    const { data, error } = await supabase
      .from('mcp')
      .select('*')
      .eq('category', category)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Server: Error fetching MCP items by category:', error)
      return []
    }
    
    console.log(`Server: Successfully fetched ${data?.length || 0} MCP items for category ${category}`)
    return data || []
  } catch (error) {
    console.error(`Server: Failed to fetch MCP items for category ${category}:`, error)
    return []
  }
}

// 根据分类获取 MCP 数据（简化版服务器端）
export const getMcpItemsByCategoryServerSimple = async (category: McpCategory) => {
  try {
    console.log(`ServerSimple: Fetching MCP items by category: ${category}`)
    const supabase = createServerSupabase()
    
    const { data, error } = await supabase
      .from('mcp')
      .select('*')
      .eq('category', category)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('ServerSimple: Error fetching MCP items by category:', error)
      return []
    }
    
    console.log(`ServerSimple: Successfully fetched ${data?.length || 0} MCP items for category ${category}`)
    return data || []
  } catch (error) {
    console.error(`ServerSimple: Failed to fetch MCP items for category ${category}:`, error)
    return []
  }
} 