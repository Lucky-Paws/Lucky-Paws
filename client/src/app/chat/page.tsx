'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/landing');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const chatList = [
    {
      id: 1,
      name: 'OOO 멘토님',
      info: '20년차 | 초등교사',
      message: '안녕하세요!',
      time: '12:25'
    },
    {
      id: 2,
      name: 'OOO 멘토님',
      info: '20년차 | 초등교사',
      message: '안녕하세요!',
      time: '12:25'
    },
    {
      id: 3,
      name: 'OOO 멘토님',
      info: '20년차 | 초등교사',
      message: '안녕하세요!',
      time: '12:25'
    },
    {
      id: 4,
      name: 'OOO 멘토님',
      info: '20년차 | 초등교사',
      message: '안녕하세요!',
      time: '12:25'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white px-3 py-2 flex items-center justify-between shadow-sm z-50">
        <h1 className="text-base font-medium">채팅</h1>
        <div className="flex items-center gap-3">
          <button>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5zm0 0V9a6 6 0 10-12 0v8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
        </div>
      </header>

      {/* Chat List */}
      <div className="pt-14">
        {chatList.map((chat) => (
          <div key={chat.id} className="flex items-center px-4 py-3 border-b border-gray-100">
            {/* Profile Image */}
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
            
            {/* Chat Info */}
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-medium text-sm">{chat.name}</span>
                <span className="text-xs text-gray-500">{chat.info}</span>
              </div>
              <p className="text-sm text-gray-700">{chat.message}</p>
            </div>
            
            {/* Time */}
            <div className="text-xs text-gray-400">{chat.time}</div>
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
} 