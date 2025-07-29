import { Schema, model } from 'mongoose';
import { IReaction } from '../types';

const reactionSchema = new Schema<IReaction>(
  {
    post_id: {
      type: String,
      ref: 'Post',
      required: true,
    },
    user_id: {
      type: String,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['cheer', 'empathy', 'helpful', 'funny'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

reactionSchema.index({ post_id: 1, user_id: 1 }, { unique: true });
reactionSchema.index({ post_id: 1, type: 1 });

export const Reaction = model<IReaction>('Reaction', reactionSchema);