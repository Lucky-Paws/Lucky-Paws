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
      id: (user._id as any).toString(),
      email: user.email,
      type: user.type,
    };

    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this-in-production';

    const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '30d' });

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
    console.log('Social login attempt:', { email: data.email, provider: data.provider });
    
    // 기존 사용자 확인
    let user = await User.findOne({ email: data.email });
    let isNewUser = false;

    if (!user) {
      // 신규 사용자 - 임시 계정 생성
      isNewUser = true;
      console.log('Creating new user for social login');
      
      user = await User.create({
        email: data.email,
        name: data.name,
        password: `${data.provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // 임시 비밀번호
        avatar: data.profileImage,
        type: 'mentee', // 기본값, 나중에 변경 가능
        isVerified: false, // 추가 정보 입력 전까지는 미인증
      });
      
      console.log('New user created:', user._id);
      console.log('User data saved:', { email: user.email, name: user.name, type: user.type });
    } else {
      console.log('Existing user found:', user._id);
      console.log('Existing user data:', { email: user.email, name: user.name, type: user.type });
    }

    const tokens = this.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // 데이터베이스에 실제로 저장되었는지 확인
    const savedUser = await User.findById(user._id);
    console.log('User saved to database:', savedUser ? 'YES' : 'NO');
    if (savedUser) {
      console.log('Saved user details:', { id: savedUser._id, email: savedUser.email, name: savedUser.name });
    }

    console.log('Social login successful, isNewUser:', isNewUser);
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