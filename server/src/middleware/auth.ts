import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { User } from '../models/User';

interface JwtPayload {
  id: string;
  email: string;
  type: 'mentor' | 'mentee';
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-jwt-secret'
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      type: user.type,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
    });
  }
};

export const authorizeRole = (roles: Array<'mentor' | 'mentee'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.type)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
      return;
    }
    next();
  };
};