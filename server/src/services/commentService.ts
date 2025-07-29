import { supabase } from '../config/supabase';
import { IComment } from '../types';
import { AppError } from '../middleware/errorHandler';

export const commentService = {
  async getComments(postId: string): Promise<IComment[]> {
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw new AppError('Failed to fetch comments', 500);
    }

    // 작성자 정보 가져오기
    const commentsWithAuthors = await Promise.all(
      (comments || []).map(async (comment) => {
        const { data: author } = await supabase
          .from('users')
          .select('name, avatar, type')
          .eq('id', comment.author_id)
          .single();
        
        return {
          ...comment,
          author: author || null,
        };
      })
    );

    return commentsWithAuthors as IComment[];
  },

  async createComment(data: {
    postId: string;
    content: string;
    parentId?: string;
    authorId: string;
  }): Promise<IComment> {
    // 게시글 존재 확인
    const { data: post } = await supabase
      .from('posts')
      .select('id')
      .eq('id', data.postId)
      .single();

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // 부모 댓글 확인
    if (data.parentId) {
      const { data: parentComment } = await supabase
        .from('comments')
        .select('id')
        .eq('id', data.parentId)
        .single();

      if (!parentComment) {
        throw new AppError('Parent comment not found', 404);
      }
    }

    // 댓글 생성
    const { data: comment, error } = await supabase
      .from('comments')
      .insert([{
        post_id: data.postId,
        content: data.content,
        parent_id: data.parentId,
        author_id: data.authorId,
        like_count: 0,
        is_deleted: false,
      }])
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to create comment', 500);
    }

    // 게시글 댓글 수 증가
    await supabase
      .from('posts')
      .update({ comment_count: supabase.rpc('increment') })
      .eq('id', data.postId);

    // 게시글 작성자가 멘티이고 댓글 작성자가 멘토인 경우 게시글을 답변 완료로 표시
    const { data: postAuthor } = await supabase
      .from('users')
      .select('type')
      .eq('id', (post as any).author_id)
      .single();

    if (postAuthor?.type === 'mentee' && !data.parentId) {
      const { data: commenter } = await supabase
        .from('users')
        .select('type')
        .eq('id', data.authorId)
        .single();

      if (commenter?.type === 'mentor') {
        await supabase
          .from('posts')
          .update({ is_answered: true })
          .eq('id', data.postId);
      }
    }

    // 작성자 정보 가져오기
    const { data: author } = await supabase
      .from('users')
      .select('name, avatar, type')
      .eq('id', comment.author_id)
      .single();

    return {
      ...comment,
      author: author || null,
    } as IComment;
  },

  async updateComment(
    commentId: string,
    userId: string,
    content: string
  ): Promise<IComment> {
    // 권한 확인
    const { data: existingComment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (!existingComment) {
      throw new AppError('Comment not found', 404);
    }

    if (existingComment.author_id !== userId) {
      throw new AppError('You can only edit your own comments', 403);
    }

    // 댓글 업데이트
    const { data: comment, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to update comment', 500);
    }

    // 작성자 정보 가져오기
    const { data: author } = await supabase
      .from('users')
      .select('name, avatar, type')
      .eq('id', comment.author_id)
      .single();

    return {
      ...comment,
      author: author || null,
    } as IComment;
  },

  async deleteComment(commentId: string, userId: string): Promise<void> {
    // 권한 확인
    const { data: existingComment } = await supabase
      .from('comments')
      .select('author_id, post_id')
      .eq('id', commentId)
      .single();

    if (!existingComment) {
      throw new AppError('Comment not found', 404);
    }

    if (existingComment.author_id !== userId) {
      throw new AppError('You can only delete your own comments', 403);
    }

    // 소프트 삭제
    const { error } = await supabase
      .from('comments')
      .update({ 
        is_deleted: true,
        content: '삭제된 댓글입니다.'
      })
      .eq('id', commentId);

    if (error) {
      throw new AppError('Failed to delete comment', 500);
    }

    // 게시글 댓글 수 감소
    await supabase
      .from('posts')
      .update({ comment_count: supabase.rpc('decrement') })
      .eq('id', existingComment.post_id);
  },

  async likeComment(commentId: string, userId: string): Promise<void> {
    // 댓글 존재 확인
    const { data: comment } = await supabase
      .from('comments')
      .select('id')
      .eq('id', commentId)
      .single();

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // 이미 좋아요 했는지 확인
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('target_id', commentId)
      .eq('target_type', 'comment')
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      throw new AppError('You have already liked this comment', 400);
    }

    // 좋아요 생성
    const { error: likeError } = await supabase
      .from('likes')
      .insert([{
        target_id: commentId,
        target_type: 'comment',
        user_id: userId,
      }]);

    if (likeError) {
      throw new AppError('Failed to like comment', 500);
    }

    // 댓글 좋아요 수 증가
    await supabase
      .from('comments')
      .update({ like_count: supabase.rpc('increment') })
      .eq('id', commentId);
  },
};