import { AuthResponse, SocialAuthResponse } from './authService';

// 모의 사용자 데이터
const mockUsers = new Map<string, any>();

export const mockAuthService = {
  async socialLogin(data: any): Promise<SocialAuthResponse> {
    // 모의 지연
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const email = data.email;
    const existingUser = mockUsers.get(email);
    
    if (existingUser) {
      // 기존 사용자
      const tokens = {
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
      };
      
      // 토큰 저장
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      return {
        user: existingUser,
        tokens,
        isNewUser: false,
      };
    } else {
      // 신규 사용자
      const newUser = {
        _id: `user-${Date.now()}`,
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        type: 'mentee' as const,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockUsers.set(email, newUser);
      
      const tokens = {
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
      };
      
      // 토큰 저장
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      return {
        user: newUser,
        tokens,
        isNewUser: true,
      };
    }
  },

  async completeSocialSignup(data: any): Promise<AuthResponse> {
    // 모의 지연
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const email = data.email;
    const user = mockUsers.get(email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // 사용자 정보 업데이트
    const updatedUser = {
      ...user,
      name: data.name,
      type: data.type,
      teacherType: data.teacherType,
      yearsOfExperience: data.yearsOfExperience,
      isVerified: true,
      updatedAt: new Date(),
    };
    
    mockUsers.set(email, updatedUser);
    
    const tokens = {
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    };
    
    // 토큰 저장
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    
    return {
      user: updatedUser,
      tokens,
    };
  },

  async signup(data: any): Promise<AuthResponse> {
    // 모의 지연
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const email = data.email;
    const existingUser = mockUsers.get(email);
    
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // 신규 사용자 생성
    const newUser = {
      _id: `user-${Date.now()}`,
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      type: data.type,
      teacherType: data.teacherType,
      yearsOfExperience: data.yearsOfExperience,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockUsers.set(email, newUser);
    
    const tokens = {
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    };
    
    // 토큰 저장
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    
    return {
      user: newUser,
      tokens,
    };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  async getProfile(): Promise<any> {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token');
    }
    
    // 토큰에서 사용자 정보 추출 (실제로는 JWT 디코딩)
    for (const user of mockUsers.values()) {
      return user;
    }
    
    throw new Error('User not found');
  },
}; 