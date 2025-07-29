'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/common/Header';
import CommentSection from '@/components/post/CommentSection';
import ReactionButtons from '@/components/post/ReactionButtons';
import BottomNavigation from '@/components/BottomNavigation';
import { usePost } from '@/hooks/usePost';
import { useComments } from '@/hooks/useComments';
import { useLikes } from '@/hooks/useLikes';
import { useReactions } from '@/hooks/useReactions';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const { post, loading } = usePost(postId);
  const { comments, addComment, likeComment, deleteComment } = useComments(postId);
  const { likeCount, isLiked, toggleLike } = useLikes(post?.likeCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { data: session } = useSession();
  
  // 현재 사용자가 게시글 작성자인지 확인
  const isAuthor = session?.user?.email === post?.author?.email;
  const menuRef = useRef<HTMLDivElement>(null);

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
  const { reactions, userReactions, toggleReaction } = useReactions({
    cheer: 2,
    empathy: 3,
    helpful: 1,
    funny: 0
  });

  if (loading || !post) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white px-3 py-2 flex items-center shadow-sm z-50">
        <button onClick={() => router.back()} className="p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </header>

      {/* Content with top padding for fixed header */}
      <div className="flex-1 pt-14 px-3 py-4">
        {/* User Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <h2 className="font-medium text-base">{post.author.name}</h2>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button 
              className="p-1"
              onClick={() => setShowMenu(!showMenu)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[120px] z-60">
                {isAuthor ? (
                  <>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg text-sm">
                      수정
                    </button>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm">
                      삭제
                    </button>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 last:rounded-b-lg text-sm">
                      공유
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg text-sm">
                      신고
                    </button>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 last:rounded-b-lg text-sm">
                      공유
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Title */}
        <h1 className="text-lg font-bold mb-2">{post.title}</h1>

        {/* Post Meta */}
        <div className="text-xs text-gray-500 mb-4">
          {formatDate(post.createdAt)} · 조회 {post.viewCount}
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-sm leading-relaxed mb-3">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Reaction Buttons */}
        <ReactionButtons 
          reactions={reactions}
          userReactions={userReactions}
          onReactionToggle={toggleReaction}
        />

        {/* Stats */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <span className="text-gray-600">댓글 {comments.length}</span>
          <div className="flex items-center gap-4 text-gray-600">
            <button onClick={toggleLike} className="flex items-center gap-1">
              {likeCount} 
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
            <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex items-center gap-1">
              17 
              {isBookmarked ? (
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                  <path d="M1 11.5V0.5H9V11.5L5 8.91177L1 11.5Z" fill="#565656" stroke="#565656" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                  <path d="M1 11.5V0.5H9V11.5L5 8.91177L1 11.5Z" stroke="#565656" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Comments */}
        <CommentSection
          comments={comments}
          currentUser={session?.user}
          onAddComment={addComment}
          onLikeComment={likeComment}
          onDeleteComment={deleteComment}
        />
      </div>
      
      <BottomNavigation />
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