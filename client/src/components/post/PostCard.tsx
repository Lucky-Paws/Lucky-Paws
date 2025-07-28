'use client';

import { useRouter } from 'next/navigation';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  showMentorComment?: boolean;
  mentorComment?: string;
}

export default function PostCard({ post, showMentorComment = false, mentorComment }: PostCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <div className="flex gap-1 mb-2">
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
          {post.author.teacherType} 선생님
        </span>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
          {post.author.yearsOfExperience}년차
        </span>
        {post.isHot && (
          <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded flex items-center gap-1">
            HOT <span>🔥</span>
          </span>
        )}
      </div>
      <h3 className="font-medium mb-2 text-sm">{post.title}</h3>
      <p className="text-xs text-gray-600 leading-tight mb-2 line-clamp-2">
        {post.content}
      </p>
      
      {showMentorComment && mentorComment && (
        <div className="bg-gray-50 rounded-lg p-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">멘토:</span>
            <span className="text-xs text-gray-600 truncate">{mentorComment}</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="truncate">{post.author.name} · {formatTimeAgo(post.createdAt)} · 조회 {post.viewCount}</span>
        <div className="flex items-center gap-2 ml-2">
          <span className="flex items-center gap-1">
            <span className="text-red-500">❤️</span> {post.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <span>💬</span> {post.commentCount}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
}