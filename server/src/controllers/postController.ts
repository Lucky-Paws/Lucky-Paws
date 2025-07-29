import { Response, NextFunction } from 'express';
import { postService } from '../services/postService';
import { AuthRequest } from '../types';

export const postController = {
  async getPosts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await postService.getPosts(req.query);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.getPost(req.params.id);
      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  },

  async createPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const post = await postService.createPost({
        ...req.body,
        authorId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const post = await postService.updatePost(
        req.params.id,
        req.user.id,
        req.body
      );

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  },

  async deletePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      await postService.deletePost(req.params.id, req.user.id);

      res.json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async likePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      await postService.likePost(req.params.id, req.user.id);

      res.json({
        success: true,
        message: 'Post liked successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async unlikePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      await postService.unlikePost(req.params.id, req.user.id);

      res.json({
        success: true,
        message: 'Post unliked successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async searchPosts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, ...params } = req.query;
      const result = await postService.searchPosts(q as string, params);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};