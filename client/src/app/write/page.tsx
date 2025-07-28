'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { PostCategory, TeacherLevel, ExperienceYears } from '@/types';

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('학생지도');
  const [teacherLevel, setTeacherLevel] = useState<TeacherLevel>('초등학교');
  const [experienceYears, setExperienceYears] = useState<ExperienceYears>('1년차');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const categories: PostCategory[] = ['학생지도', '수업운영', '평가/과제', '학부모상담', '학부모'];
  const levels: TeacherLevel[] = ['초등학교', '중학교', '고등학교'];
  const experiences: ExperienceYears[] = ['1년차', '2년차', '3년차', '4년차', '5년차', '6-10년차', '11-20년차', '20년차 이상'];

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // TODO: API call to create post
    console.log({
      title,
      content,
      category,
      teacherLevel,
      experienceYears,
      isAnonymous
    });

    // Navigate back to previous page
    router.back();
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Header 
        title="글쓰기" 
        showBackButton={true}
        showSearch={false}
        showMenu={false}
      />

             <div className="pt-14 p-3">
         {/* Title Input */}
         <input
           type="text"
           placeholder="제목을 입력하세요"
           className="w-full text-lg font-medium outline-none py-2 border-b border-gray-200"
           value={title}
           onChange={(e) => setTitle(e.target.value)}
         />

         {/* Content Input */}
         <textarea
           placeholder="내용을 입력하세요"
           className="w-full outline-none py-3 min-h-[250px] resize-none text-sm"
           value={content}
           onChange={(e) => setContent(e.target.value)}
         />

        {/* Category Selection */}
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">학교급</label>
            <div className="flex gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setTeacherLevel(level)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    teacherLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Years */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">경력</label>
            <div className="flex flex-wrap gap-2">
              {experiences.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setExperienceYears(exp)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    experienceYears === exp
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              익명으로 작성
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            등록하기
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}