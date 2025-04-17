export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// MCP分类类型
export type McpCategory = 'writing' | 'filesystem' | 'device';

export interface Database {
  public: {
    Tables: {
      mcp: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          content: string | null
          repo_id: string | null
          updated_at: string
          category: McpCategory
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          content?: string | null
          repo_id?: string | null
          updated_at?: string
          category: McpCategory
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          content?: string | null
          repo_id?: string | null
          updated_at?: string
          category?: McpCategory
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 