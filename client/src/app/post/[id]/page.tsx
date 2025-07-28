'use client';

import { useParams } from 'next/navigation';
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
  const postId = params.id as string;
  
  const { post, loading } = usePost(postId);
  const { comments, addComment, likeComment, deleteComment } = useComments(postId);
  const { likeCount, isLiked, toggleLike } = useLikes(post?.likeCount || 0);
  const { reactions, userReactions, toggleReaction } = useReactions({
    cheer: 5,
    empathy: 8,
    helpful: 12,
    funny: 3
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
      <Header 
        title="게시글" 
        showBackButton={true}
        showSearch={false}
        showMenu={true}
      />

      {/* Content with top padding for fixed header */}
      <div className="flex-1 pt-16 px-4 py-6">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div>
            <h2 className="font-medium text-lg">{post.author.name}</h2>
          </div>
        </div>

        {/* Post Title */}
        <h1 className="text-xl font-bold mb-3">{post.title}</h1>

        {/* Post Meta */}
        <div className="text-sm text-gray-500 mb-6">
          {formatDate(post.createdAt)} · 조회 {post.viewCount}
        </div>

        {/* Post Content */}
        <div className="mb-6">
          <p className="text-base leading-relaxed mb-4">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
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
            <button onClick={toggleLike} className="flex items-center gap-1 hover:text-red-500">
              {likeCount} <span className={isLiked ? "text-red-500" : "text-gray-400"}>❤️</span>
            </button>
            <span className="flex items-center gap-1">
              17 <span>🔖</span>
            </span>
          </div>
        </div>

        {/* Comments */}
        <CommentSection
          comments={comments}
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