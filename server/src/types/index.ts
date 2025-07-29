import { Request } from 'express';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  type: 'mentor' | 'mentee';
  teacher_type?: '초등학교' | '중학교' | '고등학교';
  years_of_experience?: number;
  bio?: string;
  is_verified: boolean;
  refresh_token?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  tags: string[];
  category: '학생지도' | '수업운영' | '평가/과제' | '학부모상담' | '학부모' | '동료관계' | '기타';
  teacher_level: '초등학교' | '중학교' | '고등학교';
  is_answered: boolean;
  is_hot: boolean;
  is_pinned: boolean;
  images: string[];
  created_at: Date;
  updated_at: Date;
}

export interface IComment {
  id: string;
  post_id: string;
  content: string;
  author_id: string;
  like_count: number;
  parent_id?: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IReaction {
  id: string;
  post_id: string;
  user_id: string;
  type: 'cheer' | 'empathy' | 'helpful' | 'funny';
  created_at: Date;
}

export interface ILike {
  id: string;
  target_id: string;
  target_type: 'post' | 'comment';
  user_id: string;
  created_at: Date;
}

export interface IChatRoom {
  id: string;
  participants: string[];
  last_message_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  is_deleted: boolean;
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    type: 'mentor' | 'mentee';
  };
}