import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import { User } from '@/types';

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  name: string;
  type: 'mentor' | 'mentee';
  teacherType?: '초등학교' | '중학교' | '고등학교';
  yearsOfExperience?: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  // 로그인
  async login(data: LoginDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  // 회원가입
  async signup(data: SignupDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, data);
  },

  // 로그아웃
  async logout(): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // 토큰 갱신
  async refresh(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  // 프로필 조회
  async getProfile(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  },
};