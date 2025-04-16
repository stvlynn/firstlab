export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          category: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          content?: string | null
          repo_id?: string | null
          updated_at?: string
          category: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          content?: string | null
          repo_id?: string | null
          updated_at?: string
          category?: string
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