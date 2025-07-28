'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BottomNavigation from "@/components/BottomNavigation";

export default function Community() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('미답변');
  const [selectedSchool, setSelectedSchool] = useState('초등학교');
  const [selectedSort, setSelectedSort] = useState('최신순');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowSchoolDropdown(false);
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-between shadow-sm z-50">
        <div className="relative dropdown-container">
          <button 
            className="flex items-center gap-2"
            onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
          >
            <span className="text-lg font-medium">{selectedSchool}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* School Dropdown */}
          {showSchoolDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[120px] z-60">
              {['초등학교', '중학교', '고등학교'].map((school) => (
                <button
                  key={school}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    selectedSchool === school ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    setSelectedSchool(school);
                    setShowSchoolDropdown(false);
                  }}
                >
                  {school}
                </button>
              ))}
            </div>
          )}
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
      <div className="pt-16">
        {/* Categories */}
        <div className="bg-white px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-300 rounded-full mb-2"></div>
              <span className="text-sm text-gray-700">학생 지도</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-300 rounded-full mb-2"></div>
              <span className="text-sm text-gray-700">수업 운영</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-300 rounded-full mb-2"></div>
              <span className="text-sm text-gray-700">평가/과제</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-300 rounded-full mb-2"></div>
              <span className="text-sm text-gray-700">학부모 상담</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-gray-300 rounded-full mb-2"></div>
              <span className="text-sm text-gray-700">학부모</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button 
              className={`flex-1 py-4 text-center font-medium ${activeTab === '미답변' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
              onClick={() => setActiveTab('미답변')}
            >
              미답변
            </button>
            <button 
              className={`flex-1 py-4 text-center font-medium ${activeTab === '답변 완료' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
              onClick={() => setActiveTab('답변 완료')}
            >
              답변 완료
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="relative dropdown-container">
            <button 
              className="flex items-center gap-2"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span className="text-sm text-gray-700">{selectedSort}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Sort Dropdown */}
            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[100px] z-60">
                {['최신순', '인기순'].map((sort) => (
                  <button
                    key={sort}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      selectedSort === sort ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedSort(sort);
                      setShowSortDropdown(false);
                    }}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-500">총 349개</span>
        </div>

        {/* Posts List */}
        <div className="bg-white">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/post/${i}`)}>
              {/* Post Title */}
              <div className="mb-3">
                <h2 className="text-lg font-medium mb-2">혼자가 아니라는 것을 잊지 마세요. 🙂</h2>
                <div className="flex gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">초등학교 선생님</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">3년차</span>
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded flex items-center gap-1">
                    HOT <span>🔥</span>
                  </span>
                </div>
              </div>

              {/* Post Subtitle */}
              <h3 className="font-medium text-base mb-3">오늘 아이가 어찌구</h3>

              {/* Post Content */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
              </p>

              {/* Mentor Comment Preview */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">멘토:</span>
                  <span className="text-sm text-gray-600">아이가 그럴게 해도 이러지도 저러지도 못하는 마...</span>
                </div>
              </div>

              {/* Post Meta */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">러블리두두님 · 3시간 전 · 조회 428</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm">15</span>
                  <span className="text-red-500">❤️</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Floating Write Button */}
      <button
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 flex items-center justify-center"
        onClick={() => router.push('/write')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      
      <BottomNavigation />
    </div>
  );
} 