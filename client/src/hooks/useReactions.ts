'use client';

import { useState, useCallback } from 'react';
import { Reaction } from '@/types';

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

export function useReactions(initialCounts: Partial<ReactionsState> = {}) {
  const [reactions, setReactions] = useState<ReactionsState>({
    ...initialReactions,
    ...initialCounts
  });
  
  const [userReactions, setUserReactions] = useState<Reaction['type'][]>([]);

  const toggleReaction = useCallback((type: Reaction['type']) => {
    setUserReactions(prev => {
      const hasReaction = prev.includes(type);
      if (hasReaction) {
        // Remove reaction
        setReactions(r => ({
          ...r,
          [type]: Math.max(0, r[type] - 1)
        }));
        return prev.filter(t => t !== type);
      } else {
        // Add reaction
        setReactions(r => ({
          ...r,
          [type]: r[type] + 1
        }));
        return [...prev, type];
      }
    });
  }, []);

  return {
    reactions,
    userReactions,
    toggleReaction
  };
}