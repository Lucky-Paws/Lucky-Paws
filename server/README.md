# Lucky Paws Backend Server

Node.js 기반의 Lucky Paws 백엔드 서버입니다.

## 기술 스택

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (Access + Refresh Token)
- **Real-time**: Socket.IO
- **Language**: TypeScript
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 설치 및 실행

### 사전 요구사항

- Node.js 18.x 이상
- MongoDB 6.x 이상
- npm 또는 yarn

### 설치

```bash
cd server
npm install
```

### 환경 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다:

```bash
cp .env.example .env
```

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
npm start
```

## API 엔드포인트

### 인증 (Auth)
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/profile` - 프로필 조회

### 게시글 (Posts)
- `GET /api/posts` - 게시글 목록 조회
- `GET /api/posts/:id` - 게시글 상세 조회
- `POST /api/posts` - 게시글 작성
- `PATCH /api/posts/:id` - 게시글 수정
- `DELETE /api/posts/:id` - 게시글 삭제
- `POST /api/posts/:id/like` - 게시글 좋아요
- `DELETE /api/posts/:id/unlike` - 게시글 좋아요 취소
- `GET /api/search/posts` - 게시글 검색

### 댓글 (Comments)
- `GET /api/posts/:postId/comments` - 댓글 목록 조회
- `POST /api/posts/:postId/comments` - 댓글 작성
- `PATCH /api/posts/:postId/comments/:commentId` - 댓글 수정
- `DELETE /api/posts/:postId/comments/:commentId` - 댓글 삭제
- `POST /api/posts/:postId/comments/:commentId/like` - 댓글 좋아요

### 반응 (Reactions)
- `POST /api/posts/:postId/reactions` - 반응 추가
- `DELETE /api/posts/:postId/reactions/:reactionId` - 반응 삭제

### 채팅 (Chat)
- `GET /api/chat/rooms` - 채팅방 목록 조회
- `POST /api/chat/rooms` - 채팅방 생성
- `GET /api/chat/rooms/:roomId/messages` - 메시지 조회
- `POST /api/chat/rooms/:roomId/messages` - 메시지 전송

## 프로젝트 구조

```
server/
├── src/
│   ├── config/         # 설정 파일
│   ├── controllers/    # 컨트롤러
│   ├── models/         # Mongoose 모델
│   ├── routes/         # 라우트 정의
│   ├── services/       # 비즈니스 로직
│   ├── middleware/     # 미들웨어
│   ├── utils/          # 유틸리티 함수
│   ├── types/          # TypeScript 타입 정의
│   └── index.ts        # 앱 진입점
├── .env.example        # 환경 변수 예제
├── package.json        # 프로젝트 메타데이터
└── tsconfig.json       # TypeScript 설정
```