const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 설정
const supabaseUrl = 'https://ciqtorctsqwrxoswygud.supabase.co';
const supabaseServiceKey = 'sb_publishable_gzcAfbs01MGc-Beu1JMB0Q_76WStr2U';

// 서비스 키를 사용하는 관리자 클라이언트
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 데이터베이스 스키마 설정을 시작합니다...');
    
    // SQL 스키마 파일 읽기
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 SQL 스키마 파일을 읽었습니다.');
    
    // SQL 스크립트를 여러 문장으로 분할
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 ${statements.length}개의 SQL 문장을 실행합니다...`);
    
    // 각 SQL 문장 실행
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`실행 중... (${i + 1}/${statements.length})`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            // 일부 오류는 무시 (이미 존재하는 테이블 등)
            if (error.message.includes('already exists') || 
                error.message.includes('duplicate key') ||
                error.message.includes('already enabled')) {
              console.log(`⚠️  경고: ${error.message}`);
            } else {
              console.error(`❌ 오류: ${error.message}`);
            }
          } else {
            console.log(`✅ 성공: ${statement.substring(0, 50)}...`);
          }
        } catch (err) {
          console.error(`❌ 실행 오류: ${err.message}`);
        }
      }
    }
    
    console.log('🎉 데이터베이스 스키마 설정이 완료되었습니다!');
    
    // 테이블 확인
    console.log('\n📊 생성된 테이블 확인:');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (!tablesError && tables) {
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('💥 데이터베이스 설정 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 