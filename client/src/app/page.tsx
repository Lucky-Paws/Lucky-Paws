'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import PostCard from '@/components/post/PostCard';
import BottomNavigation from '@/components/BottomNavigation';
import { usePosts } from '@/hooks/usePosts';
import { TeacherLevel } from '@/types';

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState<TeacherLevel>('초등학교');
  const { posts: todaysPosts } = usePosts({ sortBy: 'popular' });
  const { posts: careerPosts } = usePosts({ category: '이직고민' });
  const { posts: guidancePosts } = usePosts({ category: '학생지도' });
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header />

      {/* Content with top padding for fixed header */}
      <div className="pt-16 px-4 py-6 space-y-6">
        {/* Today's Everyone's Worries Section */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            오늘 모두의 고민 <span className="text-yellow-500">⭐</span>
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {todaysPosts.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
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
            {careerPosts.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
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
            {guidancePosts.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
