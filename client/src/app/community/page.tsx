'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/common/Header';
import FilterDropdown from '@/components/common/FilterDropdown';
import PostCard from '@/components/post/PostCard';
import BottomNavigation from '@/components/BottomNavigation';
import { usePosts } from '@/hooks/usePosts';
import { PostCategory, TeacherLevel, TabOption, SortOption } from '@/types';

export default function Community() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabOption>('미답변');
  const [selectedSchool, setSelectedSchool] = useState<TeacherLevel>('초등학교');
  const [selectedSort, setSelectedSort] = useState<SortOption>('최신순');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(null);
  
  const { posts, loading } = usePosts({
    teacherLevel: selectedSchool,
    isAnswered: activeTab === '답변 완료',
    sortBy: selectedSort === '최신순' ? 'latest' : 'popular',
    category: selectedCategory || undefined
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/landing');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const categories: { name: PostCategory; icon: string }[] = [
    { name: '학생지도', icon: '👨‍🏫' },
    { name: '수업운영', icon: '📚' },
    { name: '평가/과제', icon: '📝' },
    { name: '학부모상담', icon: '🗣️' },
    { name: '학부모', icon: '👨‍👩‍👧' }
  ];

  const allCategories = [
    '학생 지도', '수업 운영', '평가/과제', '학부모 상담',
    '동료 관계', '상사 관계', '동료 관계'
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Fixed Header with School Dropdown */}
      <header className="fixed top-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-between shadow-sm z-50">
        <FilterDropdown
          label="학교급"
          value={selectedSchool}
          options={['초등학교', '중학교', '고등학교']}
          onChange={(value) => setSelectedSchool(value as TeacherLevel)}
        />
        
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
        <div className="bg-white py-6">
          <div 
            className="flex gap-6 px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {allCategories.map((category, index) => (
              <div key={index} className="flex flex-col items-center flex-shrink-0">
                <div className="w-14 h-14 bg-gray-300 rounded-full mb-2"></div>
                <span className="text-sm text-gray-700 whitespace-nowrap">{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            {['미답변', '답변 완료'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === tab ? 'text-black border-b-2 border-black' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab(tab as TabOption)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <FilterDropdown
            label="정렬"
            value={selectedSort}
            options={['최신순', '인기순']}
            onChange={(value) => setSelectedSort(value as SortOption)}
            className="text-sm"
          />
          <span className="text-sm text-gray-500">총 {posts.length}개</span>
        </div>

        {/* Posts List */}
        <div className="bg-white">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              로딩 중...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              게시글이 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="px-4 py-6 border-b border-gray-100">
                <PostCard 
                  post={post} 
                  showMentorComment={true}
                  mentorComment="아이가 그럴게 해도 이러지도 저러지도 못하는 마..."
                />
              </div>
            ))
          )}
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