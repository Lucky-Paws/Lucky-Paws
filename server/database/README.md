# Lucky Paws Database Setup

이 문서는 Lucky Paws 프로젝트의 Supabase 데이터베이스 설정 방법을 설명합니다.

## 🚀 빠른 설정

### 1. Supabase SQL Editor 사용 (권장)

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택: `ciqtorctsqwrxoswygud`
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. **New Query** 버튼 클릭
5. `setup.sql` 파일의 내용을 복사하여 붙여넣기
6. **Run** 버튼 클릭

### 2. 터미널에서 실행

```bash
cd server
npm run setup-db
```

## 📊 생성되는 테이블

- **users** - 사용자 정보
- **posts** - 게시글
- **comments** - 댓글
- **reactions** - 반응 (cheer, empathy, helpful, funny)
- **likes** - 좋아요
- **chat_rooms** - 채팅방
- **chat_room_participants** - 채팅방 참여자
- **chat_messages** - 채팅 메시지
- **message_read_status** - 메시지 읽음 상태

## 🔧 스키마 특징

- **UUID 기반 ID**: 모든 테이블이 UUID를 기본 키로 사용
- **자동 타임스탬프**: `created_at`, `updated_at` 자동 관리
- **외래 키 제약**: 데이터 무결성 보장
- **인덱스**: 성능 최적화를 위한 인덱스 설정
- **체크 제약**: 데이터 유효성 검증

## 🛡️ 보안 설정

- **Row Level Security (RLS)** 활성화
- 사용자별 접근 권한 제어
- 본인 데이터만 수정/삭제 가능

## 🔄 데이터베이스 재설정

기존 데이터를 모두 삭제하고 새로 시작하려면:

```sql
-- 모든 테이블 삭제 (주의: 모든 데이터가 삭제됩니다!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

그 후 `setup.sql`을 다시 실행하세요.

## 📝 주의사항

1. **데이터 백업**: 중요한 데이터가 있다면 반드시 백업 후 진행
2. **환경 변수**: 서버의 Supabase 설정이 올바른지 확인
3. **권한**: Supabase 프로젝트에 대한 적절한 권한 필요

## 🆘 문제 해결

### 테이블이 존재하지 않는다는 오류
```bash
relation "public.users" does not exist
```

**해결 방법**: `setup.sql` 스크립트를 실행하여 테이블을 생성하세요.

### 권한 오류
```bash
permission denied for table
```

**해결 방법**: Supabase Dashboard에서 RLS 정책을 확인하고 필요시 수정하세요.

### 연결 오류
```bash
connection failed
```

**해결 방법**: 
1. Supabase 프로젝트 URL과 API 키 확인
2. 네트워크 연결 상태 확인
3. Supabase 프로젝트 상태 확인 