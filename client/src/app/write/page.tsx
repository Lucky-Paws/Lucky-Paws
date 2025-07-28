'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header, { HEADER_HEIGHT } from '@/components/common/Header';

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const categories = ['초등학교', '중학교', '고등학교', '학생지도', '학부모상담', '단순고민'];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // TODO: API call to create post
    console.log({
      title,
      content,
      selectedCategory,
      selectedImages
    });

    // Navigate back to previous page
    router.back();
  };

  return (
    <div className="bg-white min-h-screen">
      <Header 
        title="글 작성"
        showBackButton={true}
        showLogo={false}
        showSearch={false}
        showNotification={false}
        rightContent={
          <div className="flex flex-col items-center">
            <button 
              className="text-gray-600 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              style={{
                width: '40px',
                height: '40px'
              }}
              onClick={handleSubmit}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
            <span className="text-gray-600 text-xs mt-1">게시하기</span>
          </div>
        }
      />

      <div style={{ paddingTop: `${HEADER_HEIGHT}px` }} className="p-4">
        {/* Category Selection */}
        <div className="mb-4">
          <h2 className="text-base font-bold mb-3">카테고리 선택</h2>
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1">
            {categories.map((category, index) => (
              <div key={category} className="contents">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`py-1 px-3 rounded-full text-xs flex-shrink-0 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {category}
                </button>
                {index === 2 && (
                  <div className="w-px h-4 bg-gray-300 flex-shrink-0 self-center"></div>
                )}
              </div>
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

        {/* Selected Images */}
        {selectedImages.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photo Attachment Button */}
      <div className="fixed bottom-6 left-6">
        <label className="flex flex-col items-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs text-gray-600 mt-1">사진 첨부</span>
        </label>
      </div>
    </div>
  );
}