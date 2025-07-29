'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header, { HEADER_HEIGHT } from '@/components/common/Header';
import FilterDropdown from '@/components/common/FilterDropdown';
import PostCard from '@/components/post/PostCard';
import BottomNavigation from '@/components/BottomNavigation';
import CategoryList from '@/components/common/CategoryList';
import TabSelector from '@/components/common/TabSelector';
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
    { name: '학생지도', icon: '👨‍🏫' },
    { name: '수업운영', icon: '📚' },
    { name: '평가/과제', icon: '📝' },
    { name: '학부모상담', icon: '🗣️' },
    { name: '동료 관계', icon: '🤝' },
    { name: '상사 관계', icon: '👥' },
    { name: '기타', icon: '✨' }
  ];

  const tabs = [
    { label: '미답변', value: '미답변' },
    { label: '답변 완료', value: '답변 완료' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header 
        title="고민상담"
        showLogo={false}
        showBackButton={false}
        leftContent={
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold">고민상담</h1>
            <FilterDropdown
              label=""
              value={selectedSchool}
              options={['초등학교', '중학교', '고등학교']}
              onChange={(value) => setSelectedSchool(value as TeacherLevel)}
            />
          </div>
        }
      />

      {/* Content with top padding for fixed header */}
      <div style={{ paddingTop: `${HEADER_HEIGHT}px` }}>
        {/* Categories */}
        <div className="bg-white py-4">
          <CategoryList 
            categories={allCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={(category) => setSelectedCategory(category as PostCategory)}
          />
        </div>

        {/* Tabs */}
        <TabSelector
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(value) => setActiveTab(value as TabOption)}
        />

        {/* Filter */}
        <div className="bg-white px-3 py-2 flex items-center justify-between border-b border-gray-100">
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
        className="fixed bottom-24 right-6 w-14 h-14 bg-gray-200 text-gray-700 rounded-full shadow-lg hover:bg-gray-300 transition-colors z-40 flex items-center justify-center"
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