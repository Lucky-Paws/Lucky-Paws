import { supabase } from '../config/supabase';
import { IReaction } from '../types';
import { AppError } from '../middleware/errorHandler';

export const reactionService = {
  async addReaction(data: {
    postId: string;
    userId: string;
    type: 'cheer' | 'empathy' | 'helpful' | 'funny';
  }): Promise<IReaction> {
    // 게시글 존재 확인
    const { data: post } = await supabase
      .from('posts')
      .select('id')
      .eq('id', data.postId)
      .single();

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // 기존 리액션 확인
    const { data: existingReaction } = await supabase
      .from('reactions')
      .select('*')
      .eq('post_id', data.postId)
      .eq('user_id', data.userId)
      .single();

    if (existingReaction) {
      // 리액션 타입이 다르면 업데이트
      if (existingReaction.type !== data.type) {
        const { data: updatedReaction, error } = await supabase
          .from('reactions')
          .update({ type: data.type })
          .eq('id', existingReaction.id)
          .select()
          .single();

        if (error) {
          throw new AppError('Failed to update reaction', 500);
        }

        return updatedReaction as IReaction;
      }
      throw new AppError('You have already reacted to this post', 400);
    }

    // 새 리액션 생성
    const { data: reaction, error } = await supabase
      .from('reactions')
      .insert([{
        post_id: data.postId,
        user_id: data.userId,
        type: data.type,
      }])
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to create reaction', 500);
    }

    return reaction as IReaction;
  },

  async removeReaction(reactionId: string, userId: string): Promise<void> {
    // 리액션 존재 및 권한 확인
    const { data: reaction } = await supabase
      .from('reactions')
      .select('*')
      .eq('id', reactionId)
      .single();

    if (!reaction) {
      throw new AppError('Reaction not found', 404);
    }

    if (reaction.user_id !== userId) {
      throw new AppError('You can only remove your own reactions', 403);
    }

    // 리액션 삭제
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('id', reactionId);

    if (error) {
      throw new AppError('Failed to remove reaction', 500);
    }
  },
};