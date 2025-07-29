import { supabase, testSupabaseConnection } from './supabase';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    logger.info('Connecting to Supabase...');
    
    // Supabase 연결 테스트
    const isConnected = await testSupabaseConnection();
    
    if (isConnected) {
      logger.info('Supabase connected successfully');
      
      // 테이블 정보 확인
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (!tablesError && tables) {
        logger.info('Available tables:', tables.map(t => t.table_name));
      }
      
      // 각 테이블의 레코드 수 확인
      const tableNames = ['users', 'posts', 'comments', 'reactions', 'chat_rooms', 'chat_messages'];
      
      for (const tableName of tableNames) {
        try {
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (!error) {
            logger.info(`Table ${tableName}: ${count || 0} records`);
          }
        } catch (error) {
          logger.warn(`Could not check table ${tableName}:`, error);
        }
      }
    } else {
      throw new Error('Failed to connect to Supabase');
    }
    
  } catch (error) {
    logger.error('Supabase connection failed:', error);
    process.exit(1);
  }
};