import { Schema, model } from 'mongoose';
import { IPost } from '../types';

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 10000,
    },
    author_id: {
      type: String,
      ref: 'User',
      required: true,
    },
    view_count: {
      type: Number,
      default: 0,
    },
    like_count: {
      type: Number,
      default: 0,
    },
    comment_count: {
      type: Number,
      default: 0,
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: 30,
    }],
    category: {
      type: String,
      enum: ['학생지도', '수업운영', '평가/과제', '학부모상담', '학부모', '동료관계', '기타'],
      required: true,
    },
    teacher_level: {
      type: String,
      enum: ['초등학교', '중학교', '고등학교'],
      default: '초등학교',
    },
    is_answered: {
      type: Boolean,
      default: false,
    },
    is_hot: {
      type: Boolean,
      default: false,
    },
    is_pinned: {
      type: Boolean,
      default: false,
    },
    images: [{
      type: String,
    }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ author_id: 1, created_at: -1 });
postSchema.index({ category: 1, created_at: -1 });
postSchema.index({ is_answered: 1, created_at: -1 });

export const Post = model<IPost>('Post', postSchema);