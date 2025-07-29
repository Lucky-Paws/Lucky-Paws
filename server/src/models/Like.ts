import { Schema, model } from 'mongoose';
import { ILike } from '../types';

const likeSchema = new Schema<ILike>(
  {
    target_id: {
      type: String,
      required: true,
    },
    target_type: {
      type: String,
      enum: ['post', 'comment'],
      required: true,
    },
    user_id: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

likeSchema.index({ target_id: 1, target_type: 1, user_id: 1 }, { unique: true });
likeSchema.index({ user_id: 1, created_at: -1 });

export const Like = model<ILike>('Like', likeSchema);