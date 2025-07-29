import { Response, NextFunction } from 'express';
import { commentService } from '../services/commentService';
import { AuthRequest } from '../types';

export const commentController = {
  async getComments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const comments = await commentService.getComments(req.params.postId);
      res.json({
        success: true,
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  },

  async createComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const comment = await commentService.createComment({
        postId: req.params.postId,
        content: req.body.content,
        parentId: req.body.parentId,
        authorId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const comment = await commentService.updateComment(
        req.params.commentId,
        req.user.id,
        req.body.content
      );

      res.json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      await commentService.deleteComment(req.params.commentId, req.user.id);

      res.json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async likeComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      await commentService.likeComment(req.params.commentId, req.user.id);

      res.json({
        success: true,
        message: 'Comment liked successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};