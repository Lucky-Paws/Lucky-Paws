'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';

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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockPost = generateMockPost(postId);
        setPost(mockPost);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
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