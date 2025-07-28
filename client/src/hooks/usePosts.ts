'use client';

import { useState, useEffect } from 'react';
import { Post, PostCategory, TeacherLevel, ExperienceYears } from '@/types';

interface UsePostsOptions {
  category?: PostCategory;
  teacherLevel?: TeacherLevel;
  experienceYears?: ExperienceYears;
  isAnswered?: boolean;
  sortBy?: 'latest' | 'popular';
  searchQuery?: string;
}

// Mock data generator
const generateMockPosts = (): Post[] => {
  const categories: PostCategory[] = ['학생지도', '수업운영', '평가/과제', '학부모상담', '학부모'];
  const levels: TeacherLevel[] = ['초등학교', '중학교', '고등학교'];
  const experiences: ExperienceYears[] = ['1년차', '2년차', '3년차', '4년차', '5년차', '6-10년차', '11-20년차', '20년차 이상'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `오늘 아이가 어떠구 ${i + 1}`,
    content: '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...',
    author: {
      id: `user-${i % 10}`,
      name: `${i % 2 === 0 ? 'OOO 멘티' : 'OOO 멘토'}`,
      type: i % 2 === 0 ? 'mentee' : 'mentor',
      teacherType: levels[i % 3],
      yearsOfExperience: parseInt(experiences[i % 8])
    },
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    viewCount: Math.floor(Math.random() * 1000),
    likeCount: Math.floor(Math.random() * 100),
    commentCount: Math.floor(Math.random() * 50),
    tags: [levels[i % 3] + ' 선생님', experiences[i % 8]],
    category: categories[i % 5],
    isAnswered: i % 3 !== 0,
    isHot: Math.random() > 0.8
  }));
};

export function usePosts(options: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 목 데이터 사용 (API 호출 비활성화)
        console.log('목 데이터 사용 중');
        
        let allPosts = generateMockPosts();
        
        // Apply filters
        if (options.category) {
          allPosts = allPosts.filter(post => post.category === options.category);
        }
        
        if (options.teacherLevel) {
          allPosts = allPosts.filter(post => post.author.teacherType === options.teacherLevel);
        }
        
        if (options.experienceYears) {
          allPosts = allPosts.filter(post => {
            const years = post.author.yearsOfExperience;
            if (!years) return false;
            
            switch (options.experienceYears) {
              case '1년차': return years === 1;
              case '2년차': return years === 2;
              case '3년차': return years === 3;
              case '4년차': return years === 4;
              case '5년차': return years === 5;
              case '6-10년차': return years >= 6 && years <= 10;
              case '11-20년차': return years >= 11 && years <= 20;
              case '20년차 이상': return years > 20;
              default: return true;
            }
          });
        }
        
        if (options.isAnswered !== undefined) {
          allPosts = allPosts.filter(post => post.isAnswered === options.isAnswered);
        }
        
        if (options.searchQuery) {
          const query = options.searchQuery.toLowerCase();
          allPosts = allPosts.filter(post => 
            post.title.toLowerCase().includes(query) || 
            post.content.toLowerCase().includes(query)
          );
        }
        
        // Apply sorting
        if (options.sortBy === 'popular') {
          allPosts.sort((a, b) => b.likeCount - a.likeCount);
        } else {
          allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        
        setPosts(allPosts);
        setTotal(allPosts.length);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [options.category, options.teacherLevel, options.experienceYears, options.isAnswered, options.sortBy, options.searchQuery, page]);

  return { posts, loading, error, total, page, setPage };
}