'use client';

import { useState, useEffect, useRef } from 'react';
import { Comment, User } from '@/types';

interface CommentSectionProps {
  comments: Comment[];
  currentUser?: any; // session.user 타입과 호환되도록 any로 변경
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
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

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

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
    onLikeComment(commentId);
  };

  return (
    <>
      <div className="space-y-4 mb-36">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            onLike={handleLikeComment}
            isLiked={likedComments.has(comment.id)}
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
  currentUser?: any; // session.user 타입과 호환되도록 any로 변경
  onLike: (commentId: string) => void;
  isLiked: boolean;
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
  isLiked,
  onReply,
  onDelete,
  isReplying,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  onCancelReply
}: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // 현재 사용자가 댓글 작성자인지 확인
  // 새로 작성한 댓글은 'current-user@example.com'으로 설정됨
  const isAuthor = comment.author.email === 'current-user@example.com';

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11.8031 9.12076C12.0898 8.47221 12.249 7.7547 12.249 7C12.249 4.10051 9.89872 1.75 6.9995 1.75C4.10028 1.75 1.75 4.10051 1.75 7C1.75 9.8995 4.10028 12.25 6.9995 12.25C7.93293 12.25 8.80946 12.0064 9.56897 11.5792L12.25 12.2495L11.8031 9.12076Z" stroke="#565656" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {!isAuthor && (
                <div className="relative" ref={menuRef}>
                  <button 
                    className="p-1"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[100px] z-60">
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg text-sm">
                        채팅
                      </button>
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 last:rounded-b-lg text-sm">
                        신고
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-800 mb-2">{comment.content}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{formatDate(comment.createdAt)}</span>
            <button onClick={() => onLike(comment.id)} className="flex items-center gap-1">
              {comment.likeCount} 
              {isLiked ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M5.74683 11.3154C5.82076 11.3678 5.90912 11.3959 5.99971 11.3959C6.0903 11.3959 6.17866 11.3678 6.25258 11.3154L6 10.9584L6.25317 11.3154L6.25783 11.3119L6.27008 11.3032L6.31675 11.2693C6.35719 11.2402 6.41456 11.1976 6.48883 11.1416C7.35566 10.4873 8.17389 9.77106 8.93708 8.99841C9.60675 8.31708 10.2875 7.52083 10.8032 6.67617C11.3165 5.83617 11.6875 4.91217 11.6875 3.98583C11.6875 2.88625 11.3462 2.027 10.7425 1.44366C10.1417 0.863831 9.33083 0.604248 8.47917 0.604248C7.47292 0.604248 6.5845 1.09016 6 1.83916C5.4155 1.09016 4.5265 0.604248 3.52083 0.604248C1.72417 0.604248 0.3125 2.14366 0.3125 3.98583C0.3125 4.91217 0.684083 5.83558 1.19683 6.67617C1.7125 7.52083 2.39325 8.31708 3.06292 8.999C3.87655 9.82217 4.75261 10.5812 5.68325 11.2693L5.72992 11.3032L5.74217 11.3119L5.74683 11.3154Z" fill="#FF8181"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8.47949 1.10425C9.23205 1.10431 9.90783 1.33284 10.3955 1.80347C10.8818 2.27352 11.1875 2.99218 11.1875 3.98608C11.1874 4.78323 10.8662 5.61514 10.377 6.41577H10.376C9.88744 7.21593 9.23525 7.98156 8.58105 8.64722C7.83498 9.40251 7.03487 10.1024 6.1875 10.7419C6.11409 10.7973 6.06051 10.838 6.02441 10.864L6.02344 10.865L6 10.8816L5.97949 10.8669H5.98047C5.18431 10.2782 4.42904 9.63647 3.71973 8.94604L3.41895 8.64722C2.84646 8.06416 2.27548 7.40528 1.81445 6.71362L1.62402 6.41577C1.13496 5.61402 0.812568 4.78306 0.8125 3.98608C0.8125 2.38998 2.02939 1.10444 3.52051 1.10425C4.35886 1.10425 5.10723 1.50875 5.60547 2.14722L6 2.6521L6.39453 2.14722C6.89281 1.50871 7.6406 1.10425 8.47949 1.10425Z" stroke="#565656"/>
                </svg>
              )}
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
                  isLiked={false}
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