import { Schema, model } from 'mongoose';
import { IComment } from '../types';

const commentSchema = new Schema<IComment>(
  {
    post_id: {
      type: String,
      ref: 'Post',
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 2000,
    },
    author_id: {
      type: String,
      ref: 'User',
      required: true,
    },
    like_count: {
      type: Number,
      default: 0,
    },
    parent_id: {
      type: String,
      ref: 'Comment',
      default: null,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

commentSchema.index({ post_id: 1, created_at: -1 });
commentSchema.index({ author_id: 1, created_at: -1 });
commentSchema.index({ parent_id: 1 });

export const Comment = model<IComment>('Comment', commentSchema);