import { authService } from '@/services/authService';

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if we have an access token in localStorage
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken;
};

export const getAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

export const setAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

export const removeAccessToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export const logout = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // 모든 인증 관련 데이터 완전 삭제
    removeAccessToken();
    localStorage.clear(); // 모든 localStorage 데이터 삭제
    sessionStorage.clear(); // 모든 sessionStorage 데이터 삭제
    
    // 모든 쿠키 삭제
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    window.location.href = '/landing';
  }
};