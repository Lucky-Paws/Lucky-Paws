import { supabase } from '@/lib/supabase/client';
import { Comment } from '@/types';

export interface CreateCommentDto {
  content: string;
}

export const supabaseCommentService = {
  async getComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*, author:users!author_id(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Comment[];
  },

  async createComment(postId: string, data: CreateCommentDto): Promise<Comment> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Unauthorized');

    const { data: comment, error } = await supabase
      .from('comments')
      .insert([{
        post_id: postId,
        author_id: user.data.user.id,
        content: data.content,
        like_count: 0,
      }])
      .select('*, author:users!author_id(*)')
      .single();

    if (error) throw error;

    // Update comment count
    await supabase.rpc('increment_comment_count', { post_id: postId });

    return comment as Comment;
  },

  async updateComment(postId: string, commentId: string, content: string): Promise<Comment> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Unauthorized');

    // Check ownership
    const { data: existingComment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (!existingComment || existingComment.author_id !== user.data.user.id) {
      throw new Error('Unauthorized');
    }

    const { data: comment, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', commentId)
      .select('*, author:users!author_id(*)')
      .single();

    if (error) throw error;
    return comment as Comment;
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Unauthorized');

    // Check ownership
    const { data: existingComment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (!existingComment || existingComment.author_id !== user.data.user.id) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;

    // Update comment count
    await supabase.rpc('decrement_comment_count', { post_id: postId });
  },

  async likeComment(postId: string, commentId: string): Promise<void> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Unauthorized');

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('target_id', commentId)
      .eq('target_type', 'comment')
      .eq('user_id', user.data.user.id)
      .single();

    if (existingLike) throw new Error('Already liked');

    // Create like
    const { error: likeError } = await supabase.from('likes').insert([{
      target_id: commentId,
      target_type: 'comment',
      user_id: user.data.user.id,
    }]);

    if (likeError) throw likeError;

    // Update like count
    await supabase.rpc('increment_comment_like_count', { comment_id: commentId });
  },
};