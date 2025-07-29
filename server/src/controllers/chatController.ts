import { Response, NextFunction } from 'express';
import { chatService } from '../services/chatService';
import { AuthRequest } from '../types';

export const chatController = {
  async getRooms(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const rooms = await chatService.getUserRooms(req.user.id);
      res.json({
        success: true,
        data: rooms,
      });
    } catch (error) {
      next(error);
    }
  },

  async createRoom(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const room = await chatService.createRoom(
        req.user.id,
        req.body.participantId
      );

      res.status(201).json({
        success: true,
        data: room,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMessages(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const messages = await chatService.getRoomMessages(
        req.params.roomId,
        req.user.id
      );

      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  },

  async sendMessage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const message = await chatService.sendMessage({
        roomId: req.params.roomId,
        senderId: req.user.id,
        content: req.body.content,
      });

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  },
};