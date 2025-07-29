import { Response, NextFunction } from 'express';
import { reactionService } from '../services/reactionService';
import { AuthRequest } from '../types';

export const reactionController = {
  async addReaction(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const reaction = await reactionService.addReaction({
        postId: req.params.postId,
        userId: req.user.id,
        type: req.body.type,
      });

      res.status(201).json({
        success: true,
        data: reaction,
      });
    } catch (error) {
      next(error);
    }
  },

  async removeReaction(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      await reactionService.removeReaction(
        req.params.reactionId,
        req.user.id
      );

      res.json({
        success: true,
        message: 'Reaction removed successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};