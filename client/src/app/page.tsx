'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";

export default function Home() {
  const router = useRouter();

  const handlePostClick = (postId: string) => {
    router.push(`/post/${postId}`);
  };
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <span className="text-lg font-medium">어플로고</span>
        </div>
        <div className="flex items-center gap-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5z" />
          </svg>
        </div>
      </header>

      {/* Content with top padding for fixed header */}
      <div className="pt-16 px-4 py-6 space-y-6">
        {/* Today's Everyone's Worries Section */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            오늘 모두의 고민 <span className="text-yellow-500">⭐</span>
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick('1')}>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">초등학교 선생님</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">2년차 </span>
              </div>
              <h3 className="font-medium mb-2">오늘 아이가 어떠구</h3>
              <p className="text-sm text-gray-600 leading-tight mb-3">
                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-red-500">❤️</span> 15
                </span>
                <span className="flex items-center gap-1">
                  <span>💬</span> 7
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick('2')}>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">초등학교 선생님</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">2년차 </span>
              </div>
              <h3 className="font-medium mb-2">오늘 아이가 어떠구</h3>
              <p className="text-sm text-gray-600 leading-tight mb-3">
                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-red-500">❤️</span> 15
                </span>
                <span className="flex items-center gap-1">
                  <span>💬</span> 7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Counselors Section */}
        <div className="bg-gray-200 rounded-lg p-4">
          <h2 className="text-base font-bold text-gray-700 mb-4">00님의 주변에 이런 상담사분들이 계세요</h2>
          
          <div className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div className="w-20 h-16 bg-gray-100 rounded-lg"></div>
            <div className="flex-1 ml-4">
              <h3 className="font-medium text-red-500 mb-1">상담 예약하기</h3>
              <p className="text-sm text-gray-500">상담 코칭 예약</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        {/* Popular Topic Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">인기 주제 #이직고민</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick('3')}>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">초등학교 선생님</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">2년차 </span>
              </div>
              <h3 className="font-medium mb-2">오늘 아이가 어떠구</h3>
              <p className="text-sm text-gray-600 leading-tight mb-3">
                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-red-500">❤️</span> 15
                </span>
                <span className="flex items-center gap-1">
                  <span>💬</span> 7
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick('4')}>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">초등학교 선생님</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">2년차 </span>
              </div>
              <h3 className="font-medium mb-2">오늘 아이가 어떠구</h3>
              <p className="text-sm text-gray-600 leading-tight mb-3">
                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-red-500">❤️</span> 15
                </span>
                <span className="flex items-center gap-1">
                  <span>💬</span> 7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Government Support Section */}
        <div className="bg-gray-200 rounded-lg p-4">
          <div className="text-center">
            <h2 className="text-base font-bold text-gray-700 mb-2">(국가심리지원사업정부)</h2>
            <div className="bg-gray-400 text-white text-sm px-3 py-1 rounded-full inline-block">
              2 / 10
            </div>
          </div>
        </div>

        {/* Interest Topic Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">관심 주제 #학생지도</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick('5')}>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">초등학교 선생님</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">2년차 </span>
              </div>
              <h3 className="font-medium mb-2">오늘 아이가 어떠구</h3>
              <p className="text-sm text-gray-600 leading-tight mb-3">
                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-red-500">❤️</span> 15
                </span>
                <span className="flex items-center gap-1">
                  <span>💬</span> 7
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePostClick('6')}>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">초등학교 선생님</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">2년차 </span>
              </div>
              <h3 className="font-medium mb-2">오늘 아이가 어떠구</h3>
              <p className="text-sm text-gray-600 leading-tight mb-3">
                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-red-500">❤️</span> 15
                </span>
                <span className="flex items-center gap-1">
                  <span>💬</span> 7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
