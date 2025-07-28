import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import { Comment } from '@/types';

export interface CreateCommentDto {
  content: string;
  parentId?: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
}

export const commentService = {
  // 댓글 목록 조회
  async getComments(postId: string): Promise<CommentListResponse> {
    return apiClient.get<CommentListResponse>(API_ENDPOINTS.COMMENTS.LIST(postId));
  },

  // 댓글 작성
  async createComment(postId: string, data: CreateCommentDto): Promise<Comment> {
    return apiClient.post<Comment>(API_ENDPOINTS.COMMENTS.CREATE(postId), data);
  },

  // 댓글 수정
  async updateComment(postId: string, commentId: string, data: UpdateCommentDto): Promise<Comment> {
    return apiClient.patch<Comment>(API_ENDPOINTS.COMMENTS.UPDATE(postId, commentId), data);
  },

  // 댓글 삭제
  async deleteComment(postId: string, commentId: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.COMMENTS.DELETE(postId, commentId));
  },

  // 댓글 좋아요
  async likeComment(postId: string, commentId: string): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.COMMENTS.LIKE(postId, commentId));
  },
};