'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path === '/community' && pathname === '/community') return true;
    if (path === '/chat' && pathname === '/chat') return true;
    return false;
  };

  const handleComingSoon = () => {
    alert('준비중입니다.');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex">
        {/* Tab 1 - 마이 홈 */}
        <button
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${
            isActive('/') ? 'text-black' : 'text-gray-400'
          }`}
          onClick={() => router.push('/')}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span className="text-xs">마이 홈</span>
        </button>

        {/* Tab 2 - 고민상담 */}
        <button
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${
            isActive('/community') ? 'text-black' : 'text-gray-400'
          }`}
          onClick={() => router.push('/community')}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h4v4H6V6zm0 8h4v4H6v-4zm8-8h4v4h-4V6zm0 8h4v4h-4v-4z"/>
          </svg>
          <span className="text-xs">고민상담</span>
        </button>

        {/* Tab 3 - 채팅 */}
        <button
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${
            isActive('/chat') ? 'text-black' : 'text-gray-400'
          }`}
          onClick={() => router.push('/chat')}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"/>
          </svg>
          <span className="text-xs">채팅</span>
        </button>

        {/* Tab 4 - 내 정보 (준비중) */}
        <button
          className="flex-1 py-3 flex flex-col items-center gap-1 text-gray-400"
          onClick={handleComingSoon}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span className="text-xs">내 정보</span>
        </button>
      </div>
    </div>
  );
} 