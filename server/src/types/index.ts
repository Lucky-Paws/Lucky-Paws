import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  type: 'mentor' | 'mentee';
  teacherType?: 'elementary' | 'middle' | 'high';
  yearsOfExperience?: number;
  bio?: string;
  isVerified: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPost extends Document {
  title: string;
  content: string;
  author: IUser['_id'];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  category: '학생지도' | '수업운영' | '평가/과제' | '학부모상담' | '학부모' | '동료관계' | '기타';
  teacherLevel: '초등학교' | '중학교' | '고등학교';
  isAnswered: boolean;
  isHot: boolean;
  isPinned: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  postId: IPost['_id'];
  content: string;
  author: IUser['_id'];
  likeCount: number;
  parentId?: IComment['_id'];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReaction extends Document {
  postId: IPost['_id'];
  userId: IUser['_id'];
  type: 'cheer' | 'empathy' | 'helpful' | 'funny';
  createdAt: Date;
}

export interface ILike extends Document {
  targetId: string;
  targetType: 'post' | 'comment';
  userId: IUser['_id'];
  createdAt: Date;
}

export interface IChatRoom extends Document {
  participants: IUser['_id'][];
  lastMessage?: IChatMessage['_id'];
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage extends Document {
  roomId: IChatRoom['_id'];
  senderId: IUser['_id'];
  content: string;
  readBy: Array<{
    userId: IUser['_id'];
    readAt: Date;
  }>;
  isDeleted: boolean;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    type: 'mentor' | 'mentee';
  };
}