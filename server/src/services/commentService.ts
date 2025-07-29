import { Comment } from '../models/Comment';
import { Post } from '../models/Post';
import { Like } from '../models/Like';
import { AppError } from '../middleware/errorHandler';
import { IComment } from '../types';

export const commentService = {
  async getComments(postId: string): Promise<IComment[]> {
    const comments = await Comment.find({ postId, parentId: null })
      .populate('author', 'name avatar type')
      .sort({ createdAt: -1 });

    // Load replies for each comment
    for (const comment of comments) {
      const replies = await Comment.find({ parentId: comment._id })
        .populate('author', 'name avatar type')
        .sort({ createdAt: 1 });
      (comment as any).replies = replies;
    }

    return comments;
  },

  async createComment(data: {
    postId: string;
    content: string;
    parentId?: string;
    authorId: string;
  }): Promise<IComment> {
    const post = await Post.findById(data.postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (data.parentId) {
      const parentComment = await Comment.findById(data.parentId);
      if (!parentComment) {
        throw new AppError('Parent comment not found', 404);
      }
    }

    const comment = await Comment.create({
      postId: data.postId,
      content: data.content,
      parentId: data.parentId,
      author: data.authorId,
    });

    await Post.findByIdAndUpdate(data.postId, { $inc: { commentCount: 1 } });

    // Check if this comment makes the post "answered" (for mentee posts)
    const postAuthor = await Post.findById(data.postId).populate('author');
    if (postAuthor && postAuthor.author.type === 'mentee' && !data.parentId) {
      const commenter = await Comment.findById(comment._id).populate('author');
      if (commenter && commenter.author.type === 'mentor') {
        await Post.findByIdAndUpdate(data.postId, { isAnswered: true });
      }
    }

    await comment.populate('author', 'name avatar type');
    return comment;
  },

  async updateComment(
    commentId: string,
    userId: string,
    content: string
  ): Promise<IComment> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.author.toString() !== userId) {
      throw new AppError('You can only edit your own comments', 403);
    }

    comment.content = content;
    await comment.save();
    await comment.populate('author', 'name avatar type');

    return comment;
  },

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.author.toString() !== userId) {
      throw new AppError('You can only delete your own comments', 403);
    }

    // Soft delete to preserve thread structure
    comment.isDeleted = true;
    comment.content = '삭제된 댓글입니다.';
    await comment.save();

    await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });
  },

  async likeComment(commentId: string, userId: string): Promise<void> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    const existingLike = await Like.findOne({
      targetId: commentId,
      targetType: 'comment',
      userId,
    });

    if (existingLike) {
      throw new AppError('You have already liked this comment', 400);
    }

    await Like.create({
      targetId: commentId,
      targetType: 'comment',
      userId,
    });

    await Comment.findByIdAndUpdate(commentId, { $inc: { likeCount: 1 } });
  },
};