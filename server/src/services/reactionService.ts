import { Reaction } from '../models/Reaction';
import { Post } from '../models/Post';
import { AppError } from '../middleware/errorHandler';
import { IReaction } from '../types';

export const reactionService = {
  async addReaction(data: {
    postId: string;
    userId: string;
    type: 'cheer' | 'empathy' | 'helpful' | 'funny';
  }): Promise<IReaction> {
    const post = await Post.findById(data.postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const existingReaction = await Reaction.findOne({
      postId: data.postId,
      userId: data.userId,
    });

    if (existingReaction) {
      // Update reaction type if different
      if (existingReaction.type !== data.type) {
        existingReaction.type = data.type;
        await existingReaction.save();
        return existingReaction;
      }
      throw new AppError('You have already reacted to this post', 400);
    }

    const reaction = await Reaction.create({
      postId: data.postId,
      userId: data.userId,
      type: data.type,
    });

    return reaction;
  },

  async removeReaction(reactionId: string, userId: string): Promise<void> {
    const reaction = await Reaction.findById(reactionId);

    if (!reaction) {
      throw new AppError('Reaction not found', 404);
    }

    if (reaction.userId.toString() !== userId) {
      throw new AppError('You can only remove your own reactions', 403);
    }

    await reaction.deleteOne();
  },
};