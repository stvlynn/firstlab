import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

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
    
    const { data, error } = await supabase
      .from('mcp')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Server: Error fetching MCP items:', error)
      return []
    }
    
    console.log(`Server: Successfully fetched ${data?.length || 0} MCP items`)
    return data || []
  } catch (error) {
    console.error('Server: Failed to fetch MCP items:', error)
    return []
  }
}

// 根据分类获取 MCP 数据（服务器端版本）
export const getMcpItemsByCategoryServer = async (category: string) => {
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