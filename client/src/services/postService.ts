import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import { Post, PostCategory, TeacherLevel } from '@/types';

export interface CreatePostDto {
  title: string;
  content: string;
  category: PostCategory;
  tags: string[];
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  category?: PostCategory;
  tags?: string[];
}

export interface PostQueryParams {
  teacherLevel?: TeacherLevel;
  category?: PostCategory;
  isAnswered?: boolean;
  sortBy?: 'latest' | 'popular';
  page?: number;
  limit?: number;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export const postService = {
  // 게시글 목록 조회
  async getPosts(params?: PostQueryParams): Promise<PostListResponse> {
    return apiClient.get<PostListResponse>(API_ENDPOINTS.POSTS.LIST, { params });
  },

  // 게시글 상세 조회
  async getPost(id: string): Promise<Post> {
    return apiClient.get<Post>(API_ENDPOINTS.POSTS.BY_ID(id));
  },

  // 게시글 작성
  async createPost(data: CreatePostDto): Promise<Post> {
    return apiClient.post<Post>(API_ENDPOINTS.POSTS.CREATE, data);
  },

  // 게시글 수정
  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    return apiClient.patch<Post>(API_ENDPOINTS.POSTS.UPDATE(id), data);
  },

  // 게시글 삭제
  async deletePost(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.POSTS.DELETE(id));
  },

  // 게시글 좋아요
  async likePost(id: string): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.POSTS.LIKE(id));
  },

  // 게시글 좋아요 취소
  async unlikePost(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.POSTS.UNLIKE(id));
  },

  // 게시글 검색
  async searchPosts(query: string, params?: PostQueryParams): Promise<PostListResponse> {
    return apiClient.get<PostListResponse>(API_ENDPOINTS.SEARCH.POSTS, { 
      params: { q: query, ...params } 
    });
  },
};