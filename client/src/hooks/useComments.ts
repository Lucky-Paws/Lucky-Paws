'use client';

import { useState, useCallback } from 'react';
import { Comment, User } from '@/types';

// Mock comment generator
const generateMockComment = (id: string, postId: string, parentId?: string): Comment => ({
  id,
  postId,
  content: '코멘트 내용입니다. 좋은 의견 감사합니다.',
  author: {
    id: `user-${Math.floor(Math.random() * 10)}`,
    name: 'OOO 멘토님',
    email: `user${Math.floor(Math.random() * 10)}@example.com`,
    type: 'mentor',
    teacherType: '초등학교',
    yearsOfExperience: 20
  },
  createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
  likeCount: Math.floor(Math.random() * 50),
  parentId,
  replies: []
});

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>(() => {
    // Generate initial mock comments
    return Array.from({ length: 4 }, (_, i) => generateMockComment(`comment-${i + 1}`, postId));
  });

  const addComment = useCallback((content: string, parentId?: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      content,
      author: {
        id: 'current-user',
        name: '나',
        email: 'current-user@example.com',
        type: 'mentee',
        teacherType: '초등학교',
        yearsOfExperience: 2
      },
      createdAt: new Date(),
      likeCount: 0,
      parentId,
      replies: []
    };

    setComments(prev => {
      if (parentId) {
        // Add as a reply
        return prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            };
          }
          return comment;
        });
      } else {
        // Add as a top-level comment
        return [...prev, newComment];
      }
    });
  }, [postId]);

  const likeComment = useCallback((commentId: string) => {
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likeCount: comment.likeCount + 1
          };
        }
        // Also check replies
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? { ...reply, likeCount: reply.likeCount + 1 }
                : reply
            )
          };
        }
        return comment;
      })
    );
  }, []);

  const deleteComment = useCallback((commentId: string) => {
    setComments(prev => {
      // Remove top-level comments
      const filtered = prev.filter(comment => comment.id !== commentId);
      
      // Remove replies
      return filtered.map(comment => ({
        ...comment,
        replies: comment.replies?.filter(reply => reply.id !== commentId) || []
      }));
    });
  }, []);

  return {
    comments,
    addComment,
    likeComment,
    deleteComment
  };
}