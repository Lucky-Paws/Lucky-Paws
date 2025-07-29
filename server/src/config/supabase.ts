import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ciqtorctsqwrxoswygud.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpcXRvcmN0c3F3cnhvc3d5Z3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MDA1NjQsImV4cCI6MjA2OTI3NjU2NH0.i1XZcnzPgCDHugyrnCyZcWBBnBewJCqH83LrFdG9k3c';
const supabaseServiceKey = 'sb_publishable_gzcAfbs01MGc-Beu1JMB0Q_76WStr2U';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서비스 키를 사용하는 관리자 클라이언트 (필요시)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// 데이터베이스 연결 테스트
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}; 