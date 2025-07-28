'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BottomNavigation from "@/components/BottomNavigation";

export default function Write() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('학생 지도');

  const categories = ['학생 지도', '수업 운영', '평가/과제', '학부모 상담', '학부모'];

  const handleSubmit = () => {
    // 글 작성 로직 (여기서는 간단히 뒤로가기)
    router.back();
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium">글쓰기</h1>
        </div>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          onClick={handleSubmit}
        >
          완료
        </button>
      </header>

      {/* Content with top padding for fixed header */}
      <div className="pt-16 p-4">
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">카테고리</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-2 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <textarea
            placeholder="내용을 입력하세요..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Tags Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
          <div className="flex gap-2 mb-3">
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">초등학교 선생님</span>
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">3년차</span>
          </div>
          <input
            type="text"
            placeholder="태그를 추가하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
} 