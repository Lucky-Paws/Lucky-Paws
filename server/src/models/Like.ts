import { Schema, model } from 'mongoose';
import { ILike } from '../types';

const likeSchema = new Schema<ILike>(
  {
    targetId: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ['post', 'comment'],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.index({ targetId: 1, targetType: 1, userId: 1 }, { unique: true });
likeSchema.index({ userId: 1, createdAt: -1 });

export const Like = model<ILike>('Like', likeSchema);