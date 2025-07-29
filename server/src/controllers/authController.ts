import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { AuthRequest } from '../types';

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, tokens } = await authService.signup(req.body);

      res.status(201).json({
        success: true,
        data: {
          user,
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, tokens } = await authService.login(email, password);

      res.json({
        success: true,
        data: {
          user,
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async socialLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider, accessToken, email, name, profileImage } = req.body;
      const { user, tokens, isNewUser } = await authService.socialLogin({
        provider,
        accessToken,
        email,
        name,
        profileImage,
      });

      res.json({
        success: true,
        data: {
          user,
          tokens,
          isNewUser, // 신규 사용자인 경우 회원가입 페이지로 이동 필요
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async completeSocialSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name, type, teacherType, yearsOfExperience } = req.body;
      const { user, tokens } = await authService.completeSocialSignup({
        email,
        name,
        type,
        teacherType,
        yearsOfExperience,
      });

      res.json({
        success: true,
        data: {
          user,
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      const tokens = await authService.refreshTokens(refreshToken);

      res.json({
        success: true,
        data: { tokens },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      await authService.logout(req.user.id);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const user = await authService.getProfile(req.user.id);

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },
};