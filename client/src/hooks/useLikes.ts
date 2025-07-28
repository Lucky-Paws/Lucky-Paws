'use client';

import { useState, useCallback } from 'react';

export function useLikes(initialCount: number = 0, initialLiked: boolean = false) {
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(initialLiked);

  const toggleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  return {
    likeCount,
    isLiked,
    toggleLike
  };
}