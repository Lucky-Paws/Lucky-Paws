import { Schema, model } from 'mongoose';
import { IReaction } from '../types';

const reactionSchema = new Schema<IReaction>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
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
    timestamps: true,
  }
);

reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });
reactionSchema.index({ postId: 1, type: 1 });

export const Reaction = model<IReaction>('Reaction', reactionSchema);