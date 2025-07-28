'use client';

import { useRouter } from 'next/navigation';
import BottomNavigation from "@/components/BottomNavigation";

export default function PostDetail() {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium">게시글</h1>
        </div>
        <button className="p-1">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </header>

      {/* Content with top padding for fixed header */}
      <div className="flex-1 pt-16 px-4 py-6">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div>
            <h2 className="font-medium text-lg">OOO 멘티</h2>
          </div>
        </div>

        {/* Post Title */}
        <h1 className="text-xl font-bold mb-3">제목 예시 제목 예시</h1>

        {/* Post Meta */}
        <div className="text-sm text-gray-500 mb-6">
          2025.07.28 12:24 · 조회 428
        </div>

        {/* Post Content */}
        <div className="mb-6">
          <p className="text-base leading-relaxed mb-4">
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
          </p>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-6">
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">초등학교 선생님</span>
          <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">2년차</span>
        </div>

        {/* Reaction Buttons */}
        <div className="flex gap-3 mb-6">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
            응원해요
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
            공감해요
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
            유익해요
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
            웃겨요
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <span className="text-gray-600">댓글 6</span>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1">
              15 <span className="text-red-500">❤️</span>
            </span>
            <span className="flex items-center gap-1">
              17 <span>🔖</span>
            </span>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4 mb-36">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-b border-gray-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">OOO 멘토님</span>
                    <span className="text-sm text-gray-500">20년차 | 초등교사</span>
                    <div className="ml-auto flex items-center gap-2">
                      <button className="p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.7-.413l-4.823 1.524a.75.75 0 01-.947-.947l1.524-4.823A8.955 8.955 0 014 12C4 7.582 7.582 4 12 4s8 3.582 8 8z" />
                        </svg>
                      </button>
                      <button className="p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mb-2">코멘트 내용</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>2025.07.28 12:25</span>
                    <span className="flex items-center gap-1">
                      22 <span className="text-red-500">❤️</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Input - Fixed at bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 flex items-center">
            <input 
              type="text" 
              placeholder="댓글을 입력하세요." 
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button className="ml-2">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
} 