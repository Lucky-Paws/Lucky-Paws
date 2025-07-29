import jwt from 'jsonwebtoken';
import { IUser } from '../types';
import { supabase } from '../config/supabase';
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
      id: user.id,
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
    // 기존 사용자 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.email)
      .single();

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // 새 사용자 생성
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        name: data.name,
        email: data.email,
        password: data.password, // 실제로는 해시된 비밀번호를 저장해야 함
        type: data.type,
        teacher_type: data.teacherType,
        years_of_experience: data.yearsOfExperience,
        is_verified: false,
      }])
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to create user', 500);
    }

    const tokens = this.generateTokens(user as IUser);
    
    // refresh token 업데이트
    await supabase
      .from('users')
      .update({ refresh_token: tokens.refreshToken })
      .eq('id', user.id);

    return { user: user as IUser, tokens };
  },

  async login(email: string, password: string): Promise<{ user: IUser; tokens: AuthTokens }> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new AppError('Invalid credentials', 401);
    }

    // 실제로는 bcrypt로 비밀번호를 검증해야 함
    if (user.password !== password) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = this.generateTokens(user as IUser);
    
    // refresh token 업데이트
    await supabase
      .from('users')
      .update({ refresh_token: tokens.refreshToken })
      .eq('id', user.id);

    return { user: user as IUser, tokens };
  },

  async socialLogin(data: SocialLoginData): Promise<{ user: IUser; tokens: AuthTokens; isNewUser: boolean }> {
    console.log('Social login attempt:', { email: data.email, provider: data.provider });
    
    // 기존 사용자 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.email)
      .single();

    let user: any;
    let isNewUser = false;

    if (!existingUser) {
      // 신규 사용자 - 임시 계정 생성
      isNewUser = true;
      console.log('Creating new user for social login');
      
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          email: data.email,
          name: data.name,
          password: `${data.provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // 임시 비밀번호
          avatar: data.profileImage,
          type: 'mentee', // 기본값, 나중에 변경 가능
          is_verified: false, // 추가 정보 입력 전까지는 미인증
        }])
        .select()
        .single();

      if (error) {
        throw new AppError('Failed to create user', 500);
      }

      user = newUser;
      console.log('New user created:', user.id);
      console.log('User data saved:', { email: user.email, name: user.name, type: user.type });
    } else {
      user = existingUser;
      console.log('Existing user found:', user.id);
      console.log('Existing user data:', { email: user.email, name: user.name, type: user.type });
    }

    const tokens = this.generateTokens(user as IUser);
    
    // refresh token 업데이트
    await supabase
      .from('users')
      .update({ refresh_token: tokens.refreshToken })
      .eq('id', user.id);

    console.log('Social login successful, isNewUser:', isNewUser);
    return { user: user as IUser, tokens, isNewUser };
  },

  async completeSocialSignup(data: {
    email: string;
    name: string;
    type: 'mentor' | 'mentee';
    teacherType?: string;
    yearsOfExperience?: number;
  }): Promise<{ user: IUser; tokens: AuthTokens }> {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.email)
      .single();

    if (error || !user) {
      throw new AppError('User not found', 404);
    }

    // 사용자 정보 업데이트
    const { error: updateError } = await supabase
      .from('users')
      .update({
        name: data.name,
        type: data.type,
        teacher_type: data.teacherType,
        years_of_experience: data.yearsOfExperience,
        is_verified: true,
      })
      .eq('id', user.id);

    if (updateError) {
      throw new AppError('Failed to update user', 500);
    }

    const updatedUser = { ...user, ...data, is_verified: true };
    const tokens = this.generateTokens(updatedUser as IUser);
    
    // refresh token 업데이트
    await supabase
      .from('users')
      .update({ refresh_token: tokens.refreshToken })
      .eq('id', user.id);

    return { user: updatedUser as IUser, tokens };
  },

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
      ) as TokenPayload;

      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.id)
        .eq('refresh_token', refreshToken)
        .single();

      if (!user) {
        throw new AppError('Invalid refresh token', 401);
      }

      const tokens = this.generateTokens(user as IUser);

      // refresh token 업데이트
      await supabase
        .from('users')
        .update({ refresh_token: tokens.refreshToken })
        .eq('id', user.id);

      return tokens;
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  },

  async logout(userId: string): Promise<void> {
    await supabase
      .from('users')
      .update({ refresh_token: null })
      .eq('id', userId);
  },

  async getProfile(userId: string): Promise<IUser> {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, avatar, type, teacher_type, years_of_experience, bio, is_verified, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new AppError('User not found', 404);
    }

    return user as IUser;
  },
};