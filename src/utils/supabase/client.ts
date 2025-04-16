'use client'

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// 客户端环境使用的 Supabase 客户端
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  return createClient<Database>(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    },
    auth: {
      persistSession: true
    },
    db: {
      schema: 'public'
    }
  })
}

// 获取 MCP 数据
export const getMcpItems = async () => {
  try {
    console.log('Fetching MCP items from Supabase...')
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('mcp')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching MCP items:', error)
      return []
    }
    
    console.log(`Successfully fetched ${data.length} MCP items`)
    return data
  } catch (error) {
    console.error('Failed to fetch MCP items:', error)
    return []
  }
}

// 根据分类获取 MCP 数据
export const getMcpItemsByCategory = async (category: string) => {
  try {
    console.log(`Fetching MCP items by category: ${category}`)
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('mcp')
      .select('*')
      .eq('category', category)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching MCP items by category:', error)
      return []
    }
    
    console.log(`Successfully fetched ${data.length} MCP items for category ${category}`)
    return data
  } catch (error) {
    console.error(`Failed to fetch MCP items for category ${category}:`, error)
    return []
  }
} 