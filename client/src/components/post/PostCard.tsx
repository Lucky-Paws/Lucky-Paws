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
        <span className="bg-gray-100 text-black text-xs px-2 py-0.5 rounded">
          {post.author.teacherType} 선생님
        </span>
        <span className="bg-gray-100 text-black text-xs px-2 py-0.5 rounded">
          {post.author.yearsOfExperience}년차
        </span>
        {post.isHot && (
          <span className="bg-gray-100 text-black text-xs px-2 py-0.5 rounded flex items-center gap-1">
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
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M0.5 0.5C0.776142 0.5 1 0.723858 1 1V7H9.5C9.77614 7 10 7.22386 10 7.5C10 7.77614 9.77614 8 9.5 8H0.5C0.223858 8 0 7.77614 0 7.5V1C0 0.723858 0.223858 0.5 0.5 0.5Z" fill="#D8D5D5"/>
            </svg>
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <span className="text-xs text-gray-600 truncate">
              <span className="font-medium text-gray-700">멘토:</span> {mentorComment}
            </span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="truncate">{post.author.name} · {formatTimeAgo(post.createdAt)} · 조회 {post.viewCount}</span>
        <div className="flex items-center gap-2 ml-2">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8.47949 1.10425C9.23205 1.10431 9.90783 1.33284 10.3955 1.80347C10.8818 2.27352 11.1875 2.99218 11.1875 3.98608C11.1874 4.78323 10.8662 5.61514 10.377 6.41577H10.376C9.88744 7.21593 9.23525 7.98156 8.58105 8.64722C7.83498 9.40251 7.03487 10.1024 6.1875 10.7419C6.11409 10.7973 6.06051 10.838 6.02441 10.864L6.02344 10.865L6 10.8816L5.97949 10.8669H5.98047C5.18431 10.2782 4.42904 9.63647 3.71973 8.94604L3.41895 8.64722C2.84646 8.06416 2.27548 7.40528 1.81445 6.71362L1.62402 6.41577C1.13496 5.61402 0.812568 4.78306 0.8125 3.98608C0.8125 2.38998 2.02939 1.10444 3.52051 1.10425C4.35886 1.10425 5.10723 1.50875 5.60547 2.14722L6 2.6521L6.39453 2.14722C6.89281 1.50871 7.6406 1.10425 8.47949 1.10425Z" stroke="#565656"/>
            </svg>
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11.8031 9.12076C12.0898 8.47221 12.249 7.7547 12.249 7C12.249 4.10051 9.89872 1.75 6.9995 1.75C4.10028 1.75 1.75 4.10051 1.75 7C1.75 9.8995 4.10028 12.25 6.9995 12.25C7.93293 12.25 8.80946 12.0064 9.56897 11.5792L12.25 12.2495L11.8031 9.12076Z" stroke="#565656" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {post.commentCount}
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