import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { McpCategory } from '@/app/mcp/McpClientWrapper'

// 创建服务器组件使用的 Supabase 客户端
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name, value, options) {
          // 这里我们不能直接在服务器端设置 cookie
          // 但可以在需要的组件中手动处理 cookies.set()
        },
        remove(name, options) {
          // 同上，我们不能直接在服务器端移除 cookie
        }
      }
    }
  )
}

// 获取 MCP 数据函数（服务器端版本）
export const getMcpItemsServer = async () => {
  try {
    console.log('Fetching MCP items from server...')
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('mcp')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Server: Error fetching MCP items:', error)
      return []
    }
    
    console.log(`Server: Successfully fetched ${data.length} MCP items`)
    return data
  } catch (error) {
    console.error('Server: Failed to fetch MCP items:', error)
    return []
  }
}

// 根据分类获取 MCP 数据（服务器端版本）
export const getMcpItemsByCategoryServer = async (category: McpCategory) => {
  try {
    console.log(`Server: Fetching MCP items by category: ${category}`)
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('mcp')
      .select('*')
      .eq('category', category)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Server: Error fetching MCP items by category:', error)
      return []
    }
    
    console.log(`Server: Successfully fetched ${data.length} MCP items for category ${category}`)
    return data
  } catch (error) {
    console.error(`Server: Failed to fetch MCP items for category ${category}:`, error)
    return []
  }
} 