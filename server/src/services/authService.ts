import jwt from 'jsonwebtoken';
import { IUser } from '../types';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

interface TokenPayload {
  id: string;
  email: string;
  type: 'mentor' | 'mentee';
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  generateTokens(user: IUser): AuthTokens {
    const payload: TokenPayload = {
      id: user._id.toString(),
      email: user.email,
      type: user.type,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-jwt-secret',
      {
        expiresIn: process.env.JWT_EXPIRE_TIME || '7d',
      }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME || '30d',
      }
    );

    return { accessToken, refreshToken };
  },

  async signup(data: {
    name: string;
    email: string;
    password: string;
    type: 'mentor' | 'mentee';
    teacherType?: string;
    yearsOfExperience?: number;
  }): Promise<{ user: IUser; tokens: AuthTokens }> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const user = await User.create(data);
    const tokens = this.generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens };
  },

  async login(email: string, password: string): Promise<{ user: IUser; tokens: AuthTokens }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = this.generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens };
  },

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
      ) as TokenPayload;

      const user = await User.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      const tokens = this.generateTokens(user);

      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  },

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  },

  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },
};