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
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
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
    teacherLevel: {
      type: String,
      enum: ['초등학교', '중학교', '고등학교'],
      default: '초등학교',
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    isHot: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    images: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ isAnswered: 1, createdAt: -1 });

export const Post = model<IPost>('Post', postSchema);