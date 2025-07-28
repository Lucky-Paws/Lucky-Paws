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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 15L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 0.145874C8.11592 0.145874 6.30894 0.894347 4.97665 2.22664C3.64436 3.55893 2.89589 5.3659 2.89589 7.25004V7.89537C2.89584 8.53419 2.7067 9.1587 2.35231 9.69021L1.30089 11.2696C0.0780587 13.103 1.01123 15.5945 3.13698 16.1738C3.82936 16.3626 4.52725 16.5224 5.23064 16.6532L5.23248 16.6578C5.93648 18.5388 7.82023 19.8542 10.0001 19.8542C12.1799 19.8542 14.0636 18.5388 14.7686 16.6578L14.7704 16.6532C15.4745 16.5217 16.1729 16.3617 16.8641 16.1738C18.9898 15.5945 19.923 13.103 18.7001 11.2696L17.6478 9.69021C17.2934 9.1587 17.1043 8.53419 17.1042 7.89537V7.25004C17.1042 5.3659 16.3558 3.55893 15.0235 2.22664C13.6912 0.894347 11.8842 0.145874 10.0001 0.145874ZM13.0947 16.909C11.0386 17.1543 8.9606 17.1543 6.90448 16.909C7.55623 17.8449 8.69014 18.4792 10.0001 18.4792C11.31 18.4792 12.443 17.8449 13.0947 16.909ZM4.27089 7.25004C4.27089 5.73057 4.8745 4.27334 5.94893 3.19891C7.02335 2.12448 8.48059 1.52087 10.0001 1.52087C11.5195 1.52087 12.9768 2.12448 14.0512 3.19891C15.1256 4.27334 15.7292 5.73057 15.7292 7.25004V7.89537C15.7292 8.80562 15.9987 9.69571 16.5038 10.4529L17.5561 12.0323C17.7192 12.2765 17.8219 12.556 17.8556 12.8477C17.8894 13.1394 17.8533 13.4349 17.7503 13.7099C17.6473 13.9849 17.4804 14.2315 17.2634 14.4292C17.0463 14.627 16.7853 14.7703 16.502 14.8474C12.2448 16.0084 7.7544 16.0084 3.49723 14.8474C3.21401 14.7703 2.95317 14.627 2.73623 14.4293C2.51929 14.2316 2.35245 13.9851 2.24949 13.7102C2.14653 13.4354 2.11038 13.14 2.14404 12.8484C2.17769 12.5568 2.28018 12.2774 2.44306 12.0332L3.49723 10.4529C4.00189 9.69542 4.27108 8.80555 4.27089 7.89537V7.25004Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Chat List */}
      <div className="pt-14">
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