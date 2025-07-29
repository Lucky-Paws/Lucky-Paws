'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import PostCard from '@/components/post/PostCard';
import BottomNavigation from '@/components/BottomNavigation';
import { usePosts } from '@/hooks/usePosts';
import { TeacherLevel } from '@/types';
import { isAuthenticated } from '@/utils/auth';
import { supabasePostService } from '@/services/supabasePostService';
import { supabaseAuthService } from '@/services/supabaseAuthService';

export default function Home() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<TeacherLevel>('초등학교');
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { posts: todaysPosts } = usePosts({ sortBy: 'popular' });
  const [popularTopic, setPopularTopic] = useState<string>('이직고민');
  const [interestTopic, setInterestTopic] = useState<string>('학생지도');
  const { posts: popularPosts } = usePosts({ category: popularTopic as any });
  const { posts: interestPosts } = usePosts({ category: interestTopic as any });
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/landing');
      return;
    }
    setIsUserAuthenticated(true);
    setIsLoading(false);
    
    // Load popular topics and user data
    const loadData = async () => {
      try {
        // Get popular topics based on likes
        const topics = await supabasePostService.getPopularTopics();
        if (topics.length > 0) {
          setPopularTopic(topics[0].topic);
        }
        
        // Get current user and their interest topics
        const user = await supabaseAuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          const interests = await supabasePostService.getInterestTopics(user.id);
          if (interests.length > 0) {
            setInterestTopic(interests[0].topic);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  if (!isUserAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header />

      {/* Content with top padding for fixed header */}
      <div className="pt-14 px-3 py-4 space-y-4">
        {/* Today's Everyone's Worries Section */}
        <div>
          <h2 className="text-base font-bold mb-3 flex items-center gap-1">
            오늘 모두의 고민 <span className="text-yellow-500">⭐</span>
          </h2>
          
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1">
            {todaysPosts.slice(0, 4).map((post) => (
              <div key={post.id} className="flex-shrink-0 w-60">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>

        {/* Counselors Section */}
        <div className="bg-gray-200 rounded-lg p-3">
          <h2 className="text-sm font-bold text-gray-700 mb-3">{currentUser?.name || '회원'}님의 주변에 이런 상담사분들이 계세요</h2>
          
          <div className="bg-white rounded-lg p-3 flex items-center justify-between">
            <div className="w-16 h-12 bg-gray-100 rounded-lg"></div>
            <div className="flex-1 ml-3">
              <h3 className="font-medium text-red-500 mb-1 text-sm">상담 예약하기</h3>
              <p className="text-xs text-gray-500">상담 코칭 예약</p>
            </div>
            <div className="text-2xl">📋</div>
          </div>
        </div>

        {/* Popular Topic Section */}
        <div>
          <h2 className="text-base font-bold mb-3">인기 주제 #{popularTopic}</h2>
          
          <div className="space-y-3">
            {popularPosts.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Government Support Section */}
        <div className="bg-gray-200 rounded-lg p-3">
          <div className="text-center">
            <h2 className="text-sm font-bold text-gray-700 mb-2">(국가심리지원사업정부)</h2>
            <div className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full inline-block">
              2 / 10
            </div>
          </div>
        </div>

        {/* Interest Topic Section */}
        <div>
          <h2 className="text-base font-bold mb-3">관심 주제 #{interestTopic}</h2>
          
          <div className="space-y-3">
            {interestPosts.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
