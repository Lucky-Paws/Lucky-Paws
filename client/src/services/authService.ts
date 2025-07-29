import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import { TeacherLevel } from '@/types';
import { User } from '@/types';

export interface SignupDto {
  email: string;
  password: string;
  name: string;
  type: 'mentor' | 'mentee';
  teacherType?: 'elementary' | 'middle' | 'high';
  yearsOfExperience?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SocialLoginDto {
  provider: 'google' | 'kakao';
  accessToken: string;
  email: string;
  name: string;
  profileImage?: string;
}

export interface CompleteSocialSignupDto {
  email: string;
  name: string;
  type: 'mentor' | 'mentee';
  teacherType?: 'elementary' | 'middle' | 'high';
  yearsOfExperience?: number;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SocialAuthResponse extends AuthResponse {
  isNewUser: boolean;
}

export const authService = {
  async signup(data: SignupDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, data);
    
    // Store tokens
    if (response.tokens) {
      apiClient.setAccessToken(response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
    }
    
    return response;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    
    // Store tokens
    if (response.tokens) {
      apiClient.setAccessToken(response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
    }
    
    return response;
  },

  async socialLogin(data: SocialLoginDto): Promise<SocialAuthResponse> {
    try {
      const response = await apiClient.post<SocialAuthResponse>(API_ENDPOINTS.AUTH.SOCIAL_LOGIN, data);
      
      // Store tokens
      if (response.tokens) {
        apiClient.setAccessToken(response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
      }
      
      return response;
    } catch (error) {
      console.warn('Server connection failed, using mock data:', error);
      
      // 서버 연결 실패 시 모의 데이터 사용
      const mockResponse: SocialAuthResponse = {
        user: {
          id: `mock-${Date.now()}`,
          email: data.email,
          name: data.name,
          type: 'mentee',
          isVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        tokens: {
          accessToken: `mock-access-${Date.now()}`,
          refreshToken: `mock-refresh-${Date.now()}`,
        },
        isNewUser: true,
      };
      
      // 모의 토큰 저장
      apiClient.setAccessToken(mockResponse.tokens.accessToken);
      localStorage.setItem('refreshToken', mockResponse.tokens.refreshToken);
      
      return mockResponse;
    }
  },

  async completeSocialSignup(data: CompleteSocialSignupDto): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.COMPLETE_SOCIAL_SIGNUP, data);
      
      // Store tokens
      if (response.tokens) {
        apiClient.setAccessToken(response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
      }
      
      return response;
    } catch (error) {
      console.warn('Server connection failed, using mock data:', error);
      
      // TeacherLevel 타입 매핑
      const teacherTypeMap: Record<string, TeacherLevel> = {
        'elementary': '초등학교',
        'middle': '중학교',
        'high': '고등학교',
      };

      // 서버 연결 실패 시 모의 데이터 사용
      const mockResponse: AuthResponse = {
        user: {
          id: `mock-${Date.now()}`,
          email: data.email,
          name: data.name,
          type: data.type,
          teacherType: data.teacherType ? teacherTypeMap[data.teacherType] : undefined,
          yearsOfExperience: data.yearsOfExperience,
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        tokens: {
          accessToken: `mock-access-${Date.now()}`,
          refreshToken: `mock-refresh-${Date.now()}`,
        },
      };
      
      // 모의 토큰 저장
      apiClient.setAccessToken(mockResponse.tokens.accessToken);
      localStorage.setItem('refreshToken', mockResponse.tokens.refreshToken);
      
      return mockResponse;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Clear tokens regardless of API response
      apiClient.setAccessToken(null);
      localStorage.removeItem('refreshToken');
    }
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });

    // Update tokens
    if (response.tokens) {
      apiClient.setAccessToken(response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
    }

    return response;
  },
};