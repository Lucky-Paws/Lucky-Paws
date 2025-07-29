'use client';

import { useState, useCallback, useEffect } from 'react';
import { Reaction } from '@/types';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';

interface ReactionsState {
  cheer: number;
  empathy: number;
  helpful: number;
  funny: number;
}

const initialReactions: ReactionsState = {
  cheer: 0,
  empathy: 0,
  helpful: 0,
  funny: 0
};

export function useReactions(postId: string, initialCounts: Partial<ReactionsState> = {}) {
  const [reactions, setReactions] = useState<ReactionsState>({
    ...initialReactions,
    ...initialCounts
  });
  
  const [userReactions, setUserReactions] = useState<Reaction['type'][]>([]);
  const [loading, setLoading] = useState(false);

  // 리액션 상태 가져오기
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        // 실제로는 서버에서 리액션 상태를 가져와야 하지만,
        // 현재는 초기값을 사용
        setReactions({
          ...initialReactions,
          ...initialCounts
        });
      } catch (err) {
        console.warn('Failed to fetch reactions:', err);
      }
    };

    if (postId) {
      fetchReactions();
    }
  }, [postId]); // initialCounts 제거

  const toggleReaction = useCallback(async (type: Reaction['type']) => {
    setLoading(true);
    try {
      const hasReaction = userReactions.includes(type);
      
      if (hasReaction) {
        // 리액션 제거
        await apiClient.delete(API_ENDPOINTS.REACTIONS.REMOVE(postId, `reaction-${type}`));
        setUserReactions(prev => prev.filter(t => t !== type));
        setReactions(r => ({
          ...r,
          [type]: Math.max(0, r[type] - 1)
        }));
      } else {
        // 리액션 추가
        await apiClient.post(API_ENDPOINTS.REACTIONS.ADD(postId), { type });
        setUserReactions(prev => [...prev, type]);
        setReactions(r => ({
          ...r,
          [type]: r[type] + 1
        }));
      }
    } catch (err) {
      console.warn('Server connection failed, using mock data:', err);
      
      // 모의 데이터로 처리
      setUserReactions(prev => {
        const hasReaction = prev.includes(type);
        if (hasReaction) {
          setReactions(r => ({
            ...r,
            [type]: Math.max(0, r[type] - 1)
          }));
          return prev.filter(t => t !== type);
        } else {
          setReactions(r => ({
            ...r,
            [type]: r[type] + 1
          }));
          return [...prev, type];
        }
      });
    } finally {
      setLoading(false);
    }
  }, [postId, userReactions]);

  return {
    reactions,
    userReactions,
    loading,
    toggleReaction
  };
}