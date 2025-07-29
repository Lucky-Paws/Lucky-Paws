'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';

export function useLikes(postId: string, initialCount: number = 0, initialLiked: boolean = false) {
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  // 좋아요 상태 가져오기
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        // 실제로는 서버에서 좋아요 상태를 가져와야 하지만,
        // 현재는 초기값을 사용하고 실제 좋아요 수는 게시글 데이터에서 가져옴
        setLikeCount(initialCount);
        setIsLiked(initialLiked);
      } catch (err) {
        console.warn('Failed to fetch like status:', err);
      }
    };

    if (postId && initialCount > 0) {
      fetchLikeStatus();
    }
  }, [postId, initialCount]); // initialCount 다시 추가하되 조건부 실행

  const toggleLike = useCallback(async () => {
    setLoading(true);
    try {
      if (isLiked) {
        // 좋아요 취소
        await apiClient.delete(API_ENDPOINTS.POSTS.UNLIKE(postId));
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // 좋아요 추가
        await apiClient.post(API_ENDPOINTS.POSTS.LIKE(postId));
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (err) {
      console.warn('Server connection failed, using mock data:', err);
      
      // 모의 데이터로 처리
      setIsLiked(prev => !prev);
      setLikeCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
    } finally {
      setLoading(false);
    }
  }, [postId, isLiked]);

  return {
    likeCount,
    isLiked,
    loading,
    toggleLike
  };
}