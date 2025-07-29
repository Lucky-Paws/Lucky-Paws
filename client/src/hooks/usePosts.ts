'use client';

import { useState, useEffect } from 'react';
import { Post, PostCategory, TeacherLevel, ExperienceYears } from '@/types';
import { supabasePostService, PostQueryParams } from '@/services/supabasePostService';

interface UsePostsOptions {
  category?: PostCategory;
  teacherLevel?: TeacherLevel;
  experienceYears?: ExperienceYears;
  isAnswered?: boolean;
  sortBy?: 'latest' | 'popular';
  searchQuery?: string;
}

export function usePosts(options: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params: PostQueryParams = {
          category: options.category,
          teacherLevel: options.teacherLevel,
          isAnswered: options.isAnswered,
          sortBy: options.sortBy || 'latest',
          page,
          limit: 20,
        };

        const response = await supabasePostService.getPosts(params);
        
        let filteredPosts = response.posts;
        
        // Apply experience years filter if needed
        if (options.experienceYears && filteredPosts.length > 0) {
          filteredPosts = filteredPosts.filter((post: Post) => {
            const years = post.author.yearsOfExperience;
            if (!years) return false;
            
            switch (options.experienceYears) {
              case '1년차': return years === 1;
              case '2년차': return years === 2;
              case '3년차': return years === 3;
              case '4년차': return years === 4;
              case '5년차': return years === 5;
              case '6-10년차': return years >= 6 && years <= 10;
              case '11-20년차': return years >= 11 && years <= 20;
              case '20년차 이상': return years > 20;
              default: return true;
            }
          });
        }
        
        // Apply search query filter
        if (options.searchQuery) {
          const query = options.searchQuery.toLowerCase();
          filteredPosts = filteredPosts.filter((post: Post) => 
            post.title.toLowerCase().includes(query) || 
            post.content.toLowerCase().includes(query)
          );
        }
        
        setPosts(filteredPosts);
        setTotal(response.total);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('게시글을 불러오는데 실패했습니다.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [options.category, options.teacherLevel, options.experienceYears, options.isAnswered, options.sortBy, options.searchQuery, page]);

  return { posts, loading, error, total, page, setPage };
}