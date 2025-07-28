'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['초등학교', '중학교', '고등학교', '학생지도', '학부모상담', '단순고민'];

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // TODO: API call to create post
    console.log({
      title,
      content,
      selectedCategory
    });

    // Navigate back to previous page
    router.back();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white px-3 py-2 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium">글 작성</h1>
        </div>
        <button 
          className="text-blue-600 font-medium text-base"
          onClick={handleSubmit}
        >
          게시하기
        </button>
      </header>

      <div className="pt-14 p-4">
        {/* Category Selection */}
        <div className="mb-4">
          <h2 className="text-base font-bold mb-3">카테고리 선택</h2>
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-1 px-3 rounded-full text-xs flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="제목을 입력해주세요"
            className="w-full py-2 px-0 border-0 border-b border-gray-200 outline-none text-base font-medium placeholder-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content Section */}
        <div className="mb-8">
          <textarea
            placeholder="지금 고민중인 내용을 자유롭게 상담해보세요."
            className="w-full min-h-[250px] resize-none border-0 outline-none text-xs placeholder-gray-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      {/* Photo Attachment Button */}
      <div className="fixed bottom-6 left-6">
        <div className="flex flex-col items-center">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs text-gray-600 mt-1">사진 첨부</span>
        </div>
      </div>
    </div>
  );
}