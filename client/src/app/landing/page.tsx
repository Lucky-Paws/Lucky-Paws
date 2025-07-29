'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { checkServerStatus, getServerStatusMessage, ServerStatus } from '@/utils/serverStatus';

export default function Landing() {
  const router = useRouter();
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [isCheckingServer, setIsCheckingServer] = useState(true);

  const handleGoogleLogin = async () => {
    // Google OAuth 구현 필요
    alert('Google 로그인은 OAuth 설정이 필요합니다.');
  };

  const handleKakaoLogin = async () => {
    // Kakao OAuth 구현 필요
    alert('Kakao 로그인은 OAuth 설정이 필요합니다.');
  };

  const handleNormalLogin = () => {
    router.push('/login');
  };

  // 서버 상태 확인
  useEffect(() => {
    const checkServer = async () => {
      try {
        const status = await checkServerStatus();
        setServerStatus(status);
      } catch (error) {
        console.error('Server status check failed:', error);
        setServerStatus({
          isOnline: false,
          message: '서버 상태 확인 중 오류가 발생했습니다.',
          timestamp: new Date(),
        });
      } finally {
        setIsCheckingServer(false);
      }
    };

    checkServer();
  }, []);

  // 테스트용 소셜 로그인 시뮬레이션
  const handleTestSocialLogin = async (provider: 'google' | 'kakao') => {
    try {
      // 실제로는 OAuth로 받은 데이터를 사용
      const mockSocialData = {
        provider,
        accessToken: 'mock-access-token',
        email: `test@${provider}.com`,
        name: `${provider} 사용자`,
        profileImage: undefined,
      };

      console.log(`Attempting ${provider} social login...`);
      const response = await authService.socialLogin(mockSocialData);
      
      console.log('Social login response:', response);
      
      if (response.isNewUser) {
        // 신규 사용자 - 추가 정보 입력 필요
        console.log('New user, redirecting to signup page');
        window.location.href = `/signup?type=social&email=${mockSocialData.email}&name=${mockSocialData.name}`;
      } else {
        // 기존 사용자 - community 페이지로
        console.log('Existing user, redirecting to community page');
        window.location.href = '/community';
      }
    } catch (error) {
      console.error('Social login error:', error);
      
      // 더 구체적인 오류 메시지 표시
      let errorMessage = '소셜 로그인 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('서버에 연결할 수 없습니다')) {
          errorMessage = '서버가 실행되지 않았습니다. 모의 데이터로 계속 진행합니다.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* 서버 상태 표시 */}
      {!isCheckingServer && serverStatus && (
        <div className="absolute top-4 right-4 p-3 bg-white rounded-lg shadow-md border">
          <div className="text-sm">
            <div className="font-medium">서버 상태</div>
            <div className={`text-xs ${serverStatus.isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {getServerStatusMessage(serverStatus)}
            </div>
            {!serverStatus.isOnline && (
              <div className="text-xs text-gray-500 mt-1">
                모의 데이터로 테스트 가능
              </div>
            )}
          </div>
        </div>
      )}

      {/* 서버 오프라인 안내 */}
      {!isCheckingServer && serverStatus && !serverStatus.isOnline && (
        <div className="absolute top-4 left-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md">
          <div className="text-sm text-yellow-800">
            <div className="font-medium">⚠️ 개발 모드</div>
            <div className="text-xs">
              서버가 실행되지 않아 모의 데이터를 사용합니다.
            </div>
          </div>
        </div>
      )}

      {/* 로고 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">로고</h1>
      </div>

      {/* 로그인 버튼들 */}
      <div className="w-full max-w-xs space-y-3">
        {/* 카카오 로그인 */}
        <button
          onClick={() => handleTestSocialLogin('kakao')}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
            <span className="text-yellow-400 text-xs font-bold">K</span>
          </div>
          {serverStatus?.isOnline ? '카카오로 시작하기' : '카카오로 시작하기 (모의 데이터)'}
        </button>

        {/* 구글 로그인 */}
        <button
          onClick={() => handleTestSocialLogin('google')}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-lg border border-gray-300 flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {serverStatus?.isOnline ? '구글로 시작하기' : '구글로 시작하기 (모의 데이터)'}
        </button>

        {/* 전통적인 로그인 */}
        <button
          onClick={handleNormalLogin}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          아이디/비밀번호로 로그인
        </button>
      </div>
    </div>
  );
} 