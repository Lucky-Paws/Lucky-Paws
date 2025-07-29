import { API_BASE_URL } from './config';

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

interface ApiError extends Error {
  code?: string;
  status?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, headers = {}, ...restOptions } = options;

    let url = `${this.baseURL}${endpoint}`;
    
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const config: RequestInit = {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        ...headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData: ApiResponse<any>;
        try {
          errorData = await response.json() as ApiResponse<any>;
        } catch {
          // JSON 파싱 실패 시 기본 오류 메시지 사용
          errorData = { 
            success: false, 
            message: `HTTP ${response.status}: ${response.statusText}` 
          };
        }
        
        const error = new Error(errorData.message || 'Request failed') as ApiError;
        error.code = errorData.error?.code;
        error.status = response.status;

        if (response.status === 401 && this.accessToken) {
          // Try to refresh token
          await this.refreshToken();
          // Retry the request
          return this.request<T>(endpoint, options);
        }

        throw error;
      }

      const data = await response.json() as ApiResponse<T>;
      return data.data as T;
    } catch (error) {
      if (error instanceof Error) {
        // 네트워크 오류나 서버 연결 실패 시 더 명확한 메시지
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.setAccessToken(null);
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json() as ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>;
      if (data.data) {
        this.setAccessToken(data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      }
    } catch (error) {
      this.setAccessToken(null);
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);