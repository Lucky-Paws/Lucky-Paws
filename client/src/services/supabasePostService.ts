import { supabase } from '@/lib/supabase/client';
import { Post, PostCategory, TeacherLevel } from '@/types';

export interface CreatePostDto {
  title: string;
  content: string;
  category: PostCategory;
  tags: string[];
  teacherLevel?: TeacherLevel;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  category?: PostCategory;
  tags?: string[];
}

export interface PostQueryParams {
  teacherLevel?: TeacherLevel;
  category?: PostCategory;
  isAnswered?: boolean;
  sortBy?: 'latest' | 'popular';
  page?: number;
  limit?: number;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export const supabasePostService = {
  async getPosts(params?: PostQueryParams): Promise<PostListResponse> {
    const {
      category,
      isAnswered,
      sortBy = 'latest',
      page = 1,
      limit = 20,
    } = params || {};

    let query = supabase.from('posts').select('*, author:users!author_id(*)', { count: 'exact' });

    if (category) {
      query = query.eq('category', category);
    }
    if (isAnswered !== undefined) {
      query = query.eq('is_answered', isAnswered);
    }

    if (sortBy === 'latest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'popular') {
      query = query.order('like_count', { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: posts, error, count } = await query;

    if (error) throw error;

    // Transform snake_case to camelCase
    const transformedPosts = (posts || []).map(post => ({
      ...post,
      createdAt: new Date(post.created_at),
      updatedAt: post.updated_at ? new Date(post.updated_at) : undefined,
      viewCount: post.view_count,
      likeCount: post.like_count,
      commentCount: post.comment_count,
      isAnswered: post.is_answered,
      isHot: post.is_hot,
      isPinned: post.is_pinned,
      teacherLevel: post.teacher_level,
    }));

    return {
      posts: transformedPosts as Post[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  async getPost(id: string): Promise<Post> {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*, author:users!author_id(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Increment view count
    await supabase.rpc('increment_view_count', { post_id: id });

    return post as Post;
  },

  async createPost(data: CreatePostDto): Promise<Post> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Unauthorized');

    const { data: post, error } = await supabase
      .from('posts')
      .insert([{
        title: data.title,
        content: data.content,
        category: data.category,
        teacher_level: data.teacherLevel || '초등학교',
        tags: data.tags || [],
        author_id: user.data.user.id,
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        is_answered: false,
        is_hot: false,
        is_pinned: false,
        images: [],
      }])
      .select('*, author:users!author_id(*)')
      .single();

    if (error) throw error;
    
    // Transform snake_case to camelCase
    const transformedPost = {
      ...post,
      createdAt: new Date(post.created_at),
      updatedAt: post.updated_at ? new Date(post.updated_at) : undefined,
      viewCount: post.view_count,
      likeCount: post.like_count,
      commentCount: post.comment_count,
      isAnswered: post.is_answered,
      isHot: post.is_hot,
      isPinned: post.is_pinned,
      teacherLevel: post.teacher_level,
    };
    
    return transformedPost as Post;
  },

  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Unauthorized');

    // Check ownership
    const { data: existingPost } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (!existingPost || existingPost.author_id !== user.data.user.id) {
      throw new Error('Unauthorized');
    }

    const { data: post, error } = await supabase
      .from('posts')
      .update(data)
      .eq('id', id)
      .select('*, author:users!author_id(*)')
      .single();

    if (error) throw error;
    
    // Transform snake_case to camelCase
    const transformedPost = {
      ...post,
      createdAt: new Date(post.created_at),
      updatedAt: post.updated_at ? new Date(post.updated_at) : undefined,
      viewCount: post.view_count,
      likeCount: post.like_count,
      commentCount: post.comment_count,
      isAnswered: post.is_answered,
      isHot: post.is_hot,
      isPinned: post.is_pinned,
      teacherLevel: post.teacher_level,
    };
    
    return transformedPost as Post;
  },

  async deletePost(id: string): Promise<void> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Unauthorized');

    // Check ownership
    const { data: existingPost } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (!existingPost || existingPost.author_id !== user.data.user.id) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
  },

  async likePost(id: string): Promise<void> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Unauthorized');

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('target_id', id)
      .eq('target_type', 'post')
      .eq('user_id', user.data.user.id)
      .single();

    if (existingLike) throw new Error('Already liked');

    // Create like
    const { error: likeError } = await supabase.from('likes').insert([{
      target_id: id,
      target_type: 'post',
      user_id: user.data.user.id,
    }]);

    if (likeError) throw likeError;

    // Update like count
    await supabase.rpc('increment_like_count', { post_id: id });
  },

  async unlikePost(id: string): Promise<void> {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('target_id', id)
      .eq('target_type', 'post')
      .eq('user_id', user.data.user.id);

    if (error) throw error;

    // Update like count
    await supabase.rpc('decrement_like_count', { post_id: id });
  },

  async searchPosts(query: string, params?: PostQueryParams): Promise<PostListResponse> {
    const {
      category,
      isAnswered,
      sortBy = 'latest',
      page = 1,
      limit = 20,
    } = params || {};

    let supabaseQuery = supabase
      .from('posts')
      .select('*, author:users!author_id(*)', { count: 'exact' })
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`);

    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }
    if (isAnswered !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_answered', isAnswered);
    }

    if (sortBy === 'latest') {
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
    } else if (sortBy === 'popular') {
      supabaseQuery = supabaseQuery.order('like_count', { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    supabaseQuery = supabaseQuery.range(from, to);

    const { data: posts, error, count } = await supabaseQuery;

    if (error) throw error;

    return {
      posts: (posts || []) as Post[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  },

  async getPopularTopics(): Promise<{ topic: string; count: number }[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('category, like_count')
      .order('like_count', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Aggregate by category
    const topicCounts = new Map<string, number>();
    (data || []).forEach(post => {
      const current = topicCounts.get(post.category) || 0;
      topicCounts.set(post.category, current + post.like_count);
    });

    // Convert to array and sort
    return Array.from(topicCounts.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 topics
  },

  async getInterestTopics(userId: string): Promise<{ topic: string; count: number }[]> {
    // Get user's liked posts
    const { data: likes, error } = await supabase
      .from('likes')
      .select('target_id')
      .eq('user_id', userId)
      .eq('target_type', 'post');

    if (error) throw error;

    if (!likes || likes.length === 0) {
      // Return popular topics if no likes
      return this.getPopularTopics();
    }

    // Get categories of liked posts
    const postIds = likes.map(like => like.target_id);
    const { data: posts } = await supabase
      .from('posts')
      .select('category')
      .in('id', postIds);

    // Count categories
    const categoryCounts = new Map<string, number>();
    (posts || []).forEach(post => {
      const current = categoryCounts.get(post.category) || 0;
      categoryCounts.set(post.category, current + 1);
    });

    return Array.from(categoryCounts.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  },
};