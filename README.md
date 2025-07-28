# Lucky Paws Frontend

교사 멘토링 플랫폼 Lucky Paws의 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 15.4.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: React Hooks
- **API Client**: Custom fetch wrapper

## 프로젝트 구조

```
client/
├── src/
│   ├── app/                    # Next.js 앱 라우터 페이지
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── common/            # 공통 UI 컴포넌트
│   │   └── post/              # 게시글 관련 컴포넌트
│   ├── constants/             # 상수 정의
│   ├── hooks/                 # 커스텀 React 훅
│   ├── lib/                   # 라이브러리 설정
│   │   └── api/              # API 클라이언트 설정
│   ├── services/              # API 서비스 레이어
│   ├── types/                 # TypeScript 타입 정의
│   └── utils/                 # 유틸리티 함수
├── public/                    # 정적 파일
└── package.json
```

## 주요 기능

### 1. 인증 시스템
- NextAuth를 이용한 소셜 로그인 (Google)
- 멘토/멘티 구분 회원가입
- 세션 관리

### 2. 커뮤니티 기능
- 게시글 작성/수정/삭제
- 카테고리별 필터링
- 댓글 시스템
- 좋아요 및 리액션

### 3. 채팅 시스템
- 1:1 채팅
- 실시간 메시지 전송
- 읽음 표시

### 4. UI/UX
- 반응형 디자인
- 통일된 헤더 컴포넌트
- 하단 네비게이션
- 로딩 및 에러 처리

## 환경 설정

1. 환경 변수 설정
```bash
cp .env.example .env.local
```

2. `.env.local` 파일 수정
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## API 연동

백엔드 API와의 연동은 `/src/services` 디렉토리의 서비스 파일들을 통해 이루어집니다.

### 주요 서비스
- `authService`: 인증 관련 API
- `postService`: 게시글 관련 API
- `commentService`: 댓글 관련 API
- `chatService`: 채팅 관련 API
- `reactionService`: 리액션 관련 API

### API 클라이언트 사용 예시
```typescript
import { postService } from '@/services/postService';

// 게시글 목록 조회
const posts = await postService.getPosts({ 
  category: '학생지도',
  sortBy: 'latest' 
});

// 게시글 작성
const newPost = await postService.createPost({
  title: '제목',
  content: '내용',
  category: '학생지도',
  tags: ['초등학교', '상담']
});
```

## 개발 가이드

### 컴포넌트 작성
- 공통 컴포넌트는 `/src/components/common`에 작성
- 기능별 컴포넌트는 해당 기능 폴더에 작성
- Props 타입은 반드시 정의

### 타입 정의
- 모든 타입은 `/src/types/index.ts`에 정의
- API 응답 타입은 백엔드와 동기화 필요

### 상수 관리
- 모든 상수는 `/src/constants/index.ts`에서 관리
- 하드코딩된 문자열 사용 금지

### 에러 처리
- API 에러는 `ApiError` 클래스 사용
- 사용자 친화적인 에러 메시지 표시

## 배포

프로덕션 배포 시 다음 사항을 확인하세요:
- 환경 변수가 올바르게 설정되었는지 확인
- API URL이 프로덕션 서버를 가리키는지 확인
- NextAuth secret이 안전한 값으로 설정되었는지 확인