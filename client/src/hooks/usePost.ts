'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';

// Mock post data generator
const generateMockPost = (id: string): Post => ({
  id,
  title: '제목 예시 제목 예시',
  content: '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용',
  author: {
    id: 'user-1',
    name: 'OOO 멘티',
    type: 'mentee',
    teacherType: '초등학교',
    yearsOfExperience: 2
  },
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  viewCount: 428,
  likeCount: 15,
  commentCount: 6,
  tags: ['초등학교 선생님', '2년차'],
  category: '학생지도',
  isAnswered: true
});

export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 실제 서버 API 호출 시도
        const response = await apiClient.get<Post>(API_ENDPOINTS.POSTS.BY_ID(postId));
        setPost(response);
      } catch (err) {
        console.warn('Server connection failed, using mock data:', err);
        
        // 서버 연결 실패 시 모의 데이터 사용
        const mockPost = generateMockPost(postId);
        setPost(mockPost);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return { post, loading, error };
}