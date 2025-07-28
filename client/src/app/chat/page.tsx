'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import Header, { HEADER_HEIGHT } from '@/components/common/Header';

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
      <Header 
        title="채팅" 
        showLogo={false}
      />

      {/* Chat List */}
      <div style={{ paddingTop: `${HEADER_HEIGHT}px` }}>
        {chatList.map((chat) => (
          <div 
            key={chat.id} 
            className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
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