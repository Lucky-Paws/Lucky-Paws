import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ciqtorctsqwrxoswygud.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpcXRvcmN0c3F3cnhvc3d5Z3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MDA1NjQsImV4cCI6MjA2OTI3NjU2NH0.i1XZcnzPgCDHugyrnCyZcWBBnBewJCqH83LrFdG9k3c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          password: string;
          type: 'mentor' | 'mentee';
          teacher_type?: string;
          bio?: string;
          avatar?: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          teacher_level: string;
          author_id: string;
          tags: string[];
          view_count: number;
          like_count: number;
          comment_count: number;
          is_answered: boolean;
          is_hot: boolean;
          is_pinned: boolean;
          images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          content: string;
          like_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          target_id: string;
          target_type: 'post' | 'comment';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['likes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['likes']['Insert']>;
      };
      reactions: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          type: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reactions']['Insert']>;
      };
    };
  };
};