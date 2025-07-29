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

interface SocialLoginData {
  provider: 'google' | 'kakao';
  accessToken: string;
  email: string;
  name: string;
  profileImage?: string;
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

  async socialLogin(data: SocialLoginData): Promise<{ user: IUser; tokens: AuthTokens; isNewUser: boolean }> {
    // 기존 사용자 확인
    let user = await User.findOne({ email: data.email });
    let isNewUser = false;

    if (!user) {
      // 신규 사용자 - 임시 계정 생성
      isNewUser = true;
      user = await User.create({
        email: data.email,
        name: data.name,
        password: `${data.provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // 임시 비밀번호
        avatar: data.profileImage,
        type: 'mentee', // 기본값, 나중에 변경 가능
        isVerified: false, // 추가 정보 입력 전까지는 미인증
      });
    }

    const tokens = this.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens, isNewUser };
  },

  async completeSocialSignup(data: {
    email: string;
    name: string;
    type: 'mentor' | 'mentee';
    teacherType?: string;
    yearsOfExperience?: number;
  }): Promise<{ user: IUser; tokens: AuthTokens }> {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // 사용자 정보 업데이트
    user.name = data.name;
    user.type = data.type;
    if (data.type === 'mentor') {
      user.teacherType = data.teacherType as any;
      user.yearsOfExperience = data.yearsOfExperience;
    }
    user.isVerified = true;
    await user.save();

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