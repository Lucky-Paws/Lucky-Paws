'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header, { HEADER_HEIGHT } from '@/components/common/Header';
import { supabasePostService } from '@/services/supabasePostService';
import { PostCategory, TeacherLevel } from '@/types';

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | ''>('');
  const [selectedLevel, setSelectedLevel] = useState<TeacherLevel>('초등학교');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const categories: PostCategory[] = ['학생지도', '수업운영', '평가/과제', '학부모상담', '학부모', '동료관계', '기타'];
  const teacherLevels: TeacherLevel[] = ['초등학교', '중학교', '고등학교'];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (!selectedCategory) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    try {
      const postData = {
        title,
        content,
        category: selectedCategory as PostCategory,
        teacherLevel: selectedLevel,
        tags: [...tags, selectedLevel],
      };

      const response = await supabasePostService.createPost(postData);
      
      if (response) {
        alert('게시글이 성공적으로 작성되었습니다.');
        router.push(`/post/${response.id}`);
      }
    } catch (error) {
      console.error('Post creation error:', error);
      alert('게시글 작성 중 오류가 발생했습니다. 로그인 상태를 확인해주세요.');
    }
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
        {/* Teacher Level Selection */}
        <div className="mb-4">
          <h2 className="text-base font-bold mb-3">학교급 선택</h2>
          <div className="flex gap-2">
            {teacherLevels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`py-1 px-3 rounded-full text-xs ${
                  selectedLevel === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-4">
          <h2 className="text-base font-bold mb-3">카테고리 선택</h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-1 px-3 rounded-full text-xs ${
                  selectedCategory === category
                    ? 'bg-gray-600 text-white'
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
            maxLength={100}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
        </div>

        {/* Content Section */}
        <div className="mb-4">
          <textarea
            placeholder="지금 고민중인 내용을 자유롭게 상담해보세요."
            className="w-full min-h-[250px] resize-none border-0 outline-none text-xs placeholder-gray-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Tags Section */}
        <div className="mb-4">
          <h2 className="text-base font-bold mb-3">태그 추가</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="태그 입력 후 엔터"
              className="flex-1 py-1 px-2 border border-gray-200 rounded text-sm outline-none"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center gap-1"
              >
                #{tag}
                <button
                  onClick={() => removeTag(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Selected Images */}
        {selectedImages.length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold mb-3">첨부 이미지</h2>
            <div className="flex flex-wrap gap-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
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
            <p className="text-xs text-gray-400 mt-1">최대 5장까지 첨부 가능</p>
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
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 mt-1">사진 첨부</span>
        </label>
      </div>
    </div>
  );
}