export interface User {
  id: string;
  name: string;
  avatar?: string;
  type: 'mentor' | 'mentee';
  teacherType?: '초등학교' | '중학교' | '고등학교';
  yearsOfExperience?: number;
}

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
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: User;
  createdAt: Date;
  likeCount: number;
  parentId?: string;
  replies?: Comment[];
}

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: 'cheer' | 'empathy' | 'helpful' | 'funny';
}

export interface Like {
  id: string;
  targetId: string;
  targetType: 'post' | 'comment';
  userId: string;
}

export type PostCategory = '학생지도' | '수업운영' | '평가/과제' | '학부모상담' | '학부모';
export type TeacherLevel = '초등학교' | '중학교' | '고등학교';
export type ExperienceYears = '1년차' | '2년차' | '3년차' | '4년차' | '5년차' | '6-10년차' | '11-20년차' | '20년차 이상';
export type SortOption = '최신순' | '인기순';
export type TabOption = '미답변' | '답변 완료';