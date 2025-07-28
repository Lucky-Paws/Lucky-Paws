'use client';

import { useState } from 'react';
import { Comment, User } from '@/types';

interface CommentSectionProps {
  comments: Comment[];
  currentUser?: User;
  onAddComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export default function CommentSection({
  comments,
  currentUser,
  onAddComment,
  onLikeComment,
  onDeleteComment
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment(replyContent, parentId);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  return (
    <>
      <div className="space-y-4 mb-36">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            onLike={onLikeComment}
            onReply={(id) => setReplyingTo(id)}
            onDelete={onDeleteComment}
            isReplying={replyingTo === comment.id}
            replyContent={replyContent}
            onReplyContentChange={setReplyContent}
            onSubmitReply={() => handleSubmitReply(comment.id)}
            onCancelReply={() => {
              setReplyingTo(null);
              setReplyContent('');
            }}
          />
        ))}
      </div>

      {/* Comment Input - Fixed at bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 flex items-center">
            <input 
              type="text" 
              placeholder="댓글을 입력하세요." 
              className="flex-1 bg-transparent outline-none text-sm"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            />
            <button onClick={handleSubmitComment} className="ml-2">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

interface CommentItemProps {
  comment: Comment;
  currentUser?: User;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  isReplying: boolean;
  replyContent: string;
  onReplyContentChange: (content: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
}

function CommentItem({
  comment,
  currentUser,
  onLike,
  onReply,
  onDelete,
  isReplying,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  onCancelReply
}: CommentItemProps) {
  const isAuthor = currentUser?.id === comment.author.id;

  return (
    <div className="border-b border-gray-100 pb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{comment.author.name}</span>
            <span className="text-sm text-gray-500">
              {comment.author.yearsOfExperience}년차 | {comment.author.teacherType}교사
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => onReply(comment.id)} className="p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.7-.413l-4.823 1.524a.75.75 0 01-.947-.947l1.524-4.823A8.955 8.955 0 014 12C4 7.582 7.582 4 12 4s8 3.582 8 8z" />
                </svg>
              </button>
              {(isAuthor || onDelete) && (
                <button onClick={() => onDelete?.(comment.id)} className="p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-800 mb-2">{comment.content}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{formatDate(comment.createdAt)}</span>
            <button onClick={() => onLike(comment.id)} className="flex items-center gap-1 hover:text-red-500">
              {comment.likeCount} <span className="text-red-500">❤️</span>
            </button>
          </div>
          
          {isReplying && (
            <div className="mt-3 bg-gray-50 rounded-lg p-3">
              <input
                type="text"
                placeholder="답글을 입력하세요..."
                className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={replyContent}
                onChange={(e) => onReplyContentChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSubmitReply()}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={onSubmitReply}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  답글
                </button>
                <button
                  onClick={onCancelReply}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  취소
                </button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ml-6 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  onLike={onLike}
                  onReply={onReply}
                  onDelete={onDelete}
                  isReplying={false}
                  replyContent=""
                  onReplyContentChange={() => {}}
                  onSubmitReply={() => {}}
                  onCancelReply={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}