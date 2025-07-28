import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import { Reaction } from '@/types';

export interface AddReactionDto {
  type: 'cheer' | 'empathy' | 'helpful' | 'funny';
}

export const reactionService = {
  // 리액션 추가
  async addReaction(postId: string, data: AddReactionDto): Promise<Reaction> {
    return apiClient.post<Reaction>(API_ENDPOINTS.REACTIONS.ADD(postId), data);
  },

  // 리액션 제거
  async removeReaction(postId: string, reactionId: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.REACTIONS.REMOVE(postId, reactionId));
  },
};