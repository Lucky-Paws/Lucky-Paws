'use client';

import { useState, useCallback, useEffect } from 'react';
import { Comment, User } from '@/types';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // 댓글 목록 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Comment[]>(API_ENDPOINTS.COMMENTS.LIST(postId));
        setComments(response);
      } catch (err) {
        console.warn('Server connection failed, using mock data:', err);
        // 서버 연결 실패 시 모의 데이터 사용
        setComments(Array.from({ length: 4 }, (_, i) => generateMockComment(`comment-${i + 1}`, postId)));
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const addComment = useCallback(async (content: string, parentId?: string) => {
    try {
      const response = await apiClient.post<Comment>(API_ENDPOINTS.COMMENTS.CREATE(postId), {
        content,
        parentId
      });
      
      setComments(prev => {
        if (parentId) {
          // 답글로 추가
          return prev.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), response]
              };
            }
            return comment;
          });
        } else {
          // 최상위 댓글로 추가
          return [...prev, response];
        }
      });
    } catch (err) {
      console.warn('Server connection failed, using mock data:', err);
      
      // 모의 데이터로 추가
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
          return [...prev, newComment];
        }
      });
    }
  }, [postId]);

  const likeComment = useCallback(async (commentId: string) => {
    try {
      await apiClient.post(API_ENDPOINTS.COMMENTS.LIKE(postId, commentId));
      
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likeCount: comment.likeCount + 1
            };
          }
          // 답글도 확인
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
    } catch (err) {
      console.warn('Server connection failed, using mock data:', err);
      
      // 모의 데이터로 좋아요 처리
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likeCount: comment.likeCount + 1
            };
          }
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
    }
  }, [postId]);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await apiClient.delete(API_ENDPOINTS.COMMENTS.DELETE(postId, commentId));
      
      setComments(prev => {
        // 최상위 댓글 제거
        const filtered = prev.filter(comment => comment.id !== commentId);
        
        // 답글 제거
        return filtered.map(comment => ({
          ...comment,
          replies: comment.replies?.filter(reply => reply.id !== commentId) || []
        }));
      });
    } catch (err) {
      console.warn('Server connection failed, using mock data:', err);
      
      // 모의 데이터로 삭제 처리
      setComments(prev => {
        const filtered = prev.filter(comment => comment.id !== commentId);
        return filtered.map(comment => ({
          ...comment,
          replies: comment.replies?.filter(reply => reply.id !== commentId) || []
        }));
      });
    }
  }, [postId]);

  return {
    comments,
    loading,
    addComment,
    likeComment,
    deleteComment
  };
}