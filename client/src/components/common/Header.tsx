'use client';

import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}

export default function Header({
  title = '어플로고',
  showBackButton = false,
  showSearch = true,
  showMenu = true,
  onSearchClick,
  onMenuClick
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white px-3 py-2 flex items-center justify-between shadow-sm z-50">
      <div className="flex items-center gap-2">
        {showBackButton ? (
          <button onClick={() => router.back()} className="p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        )}
        <span className="text-base font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {showSearch && (
          <button onClick={onSearchClick}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
        {showMenu && (
          <button onClick={onMenuClick}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5z" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}