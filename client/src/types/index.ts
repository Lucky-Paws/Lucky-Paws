// User 관련 타입
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  type: UserType;
  teacherType?: TeacherLevel;
  yearsOfExperience?: number;
  bio?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserType = 'mentor' | 'mentee';

// Post 관련 타입
export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  category?: PostCategory;
  isAnswered?: boolean;
  isHot?: boolean;
  isPinned?: boolean;
  images?: string[];
}

export interface CreatePostInput {
  title: string;
  content: string;
  category: PostCategory;
  tags?: string[];
  images?: File[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  category?: PostCategory;
  tags?: string[];
}

// Comment 관련 타입
export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  likeCount: number;
  parentId?: string;
  replies?: Comment[];
  isDeleted?: boolean;
}

export interface CreateCommentInput {
  content: string;
  parentId?: string;
}

// Reaction & Like 관련 타입
export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  user?: User;
  type: ReactionType;
  createdAt: Date;
}

export type ReactionType = 'cheer' | 'empathy' | 'helpful' | 'funny';

export interface Like {
  id: string;
  targetId: string;
  targetType: LikeTargetType;
  userId: string;
  user?: User;
  createdAt: Date;
}

export type LikeTargetType = 'post' | 'comment';

// Chat 관련 타입
export interface ChatRoom {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  sender?: User;
  content: string;
  sentAt: Date;
  readAt?: Date;
  isDeleted?: boolean;
}

// 열거형 타입
export type PostCategory = '학생지도' | '수업운영' | '평가/과제' | '학부모상담' | '학부모' | '동료관계' | '기타';
export type TeacherLevel = '초등학교' | '중학교' | '고등학교';
export type ExperienceYears = '1년차' | '2년차' | '3년차' | '4년차' | '5년차' | '6-10년차' | '11-20년차' | '20년차 이상';
export type SortOption = '최신순' | '인기순';
export type TabOption = '미답변' | '답변 완료';

// API Response 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}