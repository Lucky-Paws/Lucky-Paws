'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path === '/community' && pathname === '/community') return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex">
        {/* Tab 1 - Home */}
        <button
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${
            isActive('/') ? 'text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => router.push('/')}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${
            isActive('/') ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <span className="text-xs">홈</span>
        </button>

        {/* Tab 2 - Community */}
        <button
          className={`flex-1 py-3 flex flex-col items-center gap-1 ${
            isActive('/community') ? 'text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => router.push('/community')}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${
            isActive('/community') ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
          <span className="text-xs">커뮤니티</span>
        </button>
      </div>
    </div>
  );
} 