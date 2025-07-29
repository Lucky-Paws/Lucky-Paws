import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ciqtorctsqwrxoswygud.supabase.co';
const supabaseServiceKey = 'sb_publishable_gzcAfbs01MGc-Beu1JMB0Q_76WStr2U';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 데이터베이스 연결 테스트
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
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