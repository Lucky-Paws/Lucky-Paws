'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { isAuthenticated } from '@/utils/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/landing');
      return;
    }
    setIsUserAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  if (!isUserAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header 
        title="내 정보" 
        showLogo={false}
      />

      {/* Content with top padding for fixed header */}
      <div className="pt-14 px-4 py-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div>
              <h2 className="text-lg font-bold">사용자님</h2>
              <p className="text-sm text-gray-500">멘티</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-lg">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm">프로필 수정</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm">알림 설정</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm">개인정보 처리방침</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm">이용약관</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">고객센터</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-lg">
          <button 
            className="w-full p-4 text-left text-red-500"
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              router.push('/landing');
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
} 