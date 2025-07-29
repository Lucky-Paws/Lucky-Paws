# Lucky Paws

교사 커뮤니티 및 멘토링 플랫폼

## 프로젝트 구조

```
lucky-paws/
├── client/          # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/     # 페이지 및 라우팅
│   │   ├── components/  # 재사용 가능한 컴포넌트
│   │   ├── services/    # API 서비스
│   │   ├── hooks/       # 커스텀 훅
│   │   ├── lib/         # 유틸리티 및 설정
│   │   └── types/       # TypeScript 타입 정의
│   └── package.json
│
└── server/          # Node.js 백엔드
    ├── src/
    │   ├── controllers/ # 컨트롤러
    │   ├── models/      # MongoDB 모델
    │   ├── routes/      # API 라우트
    │   ├── services/    # 비즈니스 로직
    │   ├── middleware/  # 미들웨어
    │   ├── config/      # 설정 파일
    │   └── types/       # TypeScript 타입
    └── package.json
```

## 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- MongoDB 6.x 이상
- npm 또는 yarn

### 설치 및 실행

1. **프로젝트 클론**
```bash
git clone [repository-url]
cd lucky-paws
```

2. **백엔드 설정**
```bash
cd server
npm install
cp .env.example .env
# .env 파일을 열어 필요한 환경 변수 설정
npm run dev
```

3. **프론트엔드 설정** (새 터미널)
```bash
cd client
npm install
# .env.local 파일이 자동 생성됨 (API URL 포함)
npm run dev
```

4. **접속**
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8080

## 주요 기능

### 사용자 기능
- 회원가입/로그인 (멘토/멘티 구분)
- 프로필 관리
- 교사 인증

### 커뮤니티 기능
- 게시글 작성/수정/삭제
- 댓글 및 대댓글
- 좋아요 및 반응
- 카테고리별 필터링
- 검색 기능

### 채팅 기능
- 1:1 실시간 채팅
- 메시지 읽음 표시
- 채팅방 목록 관리

### 기술 스택

**프론트엔드**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

**백엔드**
- Express.js
- MongoDB + Mongoose
- TypeScript
- JWT 인증
- Socket.IO (실시간 통신)

## API 문서

백엔드 서버의 README.md 파일을 참조하세요.

## 개발 팀

- 프론트엔드 개발
- 백엔드 개발
- UI/UX 디자인