import { supabase } from '../config/supabase';
import { IPost } from '../types';
import { AppError } from '../middleware/errorHandler';

interface PostQuery {
  teacherLevel?: string;
  category?: string;
  isAnswered?: boolean;
  sortBy?: string;
  page?: string | number;
  limit?: string | number;
}

interface PostListResponse {
  posts: IPost[];
  total: number;
  page: number;
  totalPages: number;
}

export const postService = {
  async getPosts(query: PostQuery): Promise<PostListResponse> {
    const {
      category,
      isAnswered,
      sortBy = 'latest',
      page = 1,
      limit = 20,
    } = query;

    let supabaseQuery = supabase
      .from('posts')
      .select('*', { count: 'exact' });

    // 필터 적용
    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }
    if (isAnswered !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_answered', isAnswered);
    }

    // 정렬 적용
    if (sortBy === 'latest') {
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
    } else if (sortBy === 'popular') {
      supabaseQuery = supabaseQuery.order('like_count', { ascending: false });
    }

    // 페이지네이션
    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    supabaseQuery = supabaseQuery.range(from, to);

    const { data: posts, error, count } = await supabaseQuery;

    if (error) {
      throw new AppError('Failed to fetch posts', 500);
    }

    // 작성자 정보 가져오기
    const postsWithAuthors = await Promise.all(
      (posts || []).map(async (post) => {
        const { data: author } = await supabase
          .from('users')
          .select('name, avatar, type, teacher_type')
          .eq('id', post.author_id)
          .single();
        
        return {
          ...post,
          author: author || null,
        };
      })
    );

    return {
      posts: postsWithAuthors as IPost[],
      total: count || 0,
      page: pageNum,
      totalPages: Math.ceil((count || 0) / limitNum),
    };
  },

  async getPost(postId: string): Promise<IPost> {
    // 조회수 증가
    await supabase
      .from('posts')
      .update({ view_count: supabase.rpc('increment') })
      .eq('id', postId);

    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !post) {
      throw new AppError('Post not found', 404);
    }

    // 작성자 정보 가져오기
    const { data: author } = await supabase
      .from('users')
      .select('name, avatar, type, teacher_type, bio, is_verified')
      .eq('id', post.author_id)
      .single();

    return {
      ...post,
      author: author || null,
    } as IPost;
  },

  async createPost(data: {
    title: string;
    content: string;
    category: string;
    teacherLevel?: string;
    tags?: string[];
    authorId: string;
  }): Promise<IPost> {
    const { data: post, error } = await supabase
      .from('posts')
      .insert([{
        title: data.title,
        content: data.content,
        category: data.category,
        teacher_level: data.teacherLevel || '초등학교',
        tags: data.tags || [],
        author_id: data.authorId,
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        is_answered: false,
        is_hot: false,
        is_pinned: false,
        images: [],
      }])
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to create post', 500);
    }

    // 작성자 정보 가져오기
    const { data: author } = await supabase
      .from('users')
      .select('name, avatar, type, teacher_type')
      .eq('id', post.author_id)
      .single();

    return {
      ...post,
      author: author || null,
    } as IPost;
  },

  async updatePost(
    postId: string,
    userId: string,
    data: Partial<{
      title: string;
      content: string;
      category: string;
      tags: string[];
    }>
  ): Promise<IPost> {
    // 권한 확인
    const { data: existingPost } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (!existingPost) {
      throw new AppError('Post not found', 404);
    }

    if (existingPost.author_id !== userId) {
      throw new AppError('You can only edit your own posts', 403);
    }

    const { data: post, error } = await supabase
      .from('posts')
      .update(data)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to update post', 500);
    }

    // 작성자 정보 가져오기
    const { data: author } = await supabase
      .from('users')
      .select('name, avatar, type, teacher_type')
      .eq('id', post.author_id)
      .single();

    return {
      ...post,
      author: author || null,
    } as IPost;
  },

  async deletePost(postId: string, userId: string): Promise<void> {
    // 권한 확인
    const { data: existingPost } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (!existingPost) {
      throw new AppError('Post not found', 404);
    }

    if (existingPost.author_id !== userId) {
      throw new AppError('You can only delete your own posts', 403);
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      throw new AppError('Failed to delete post', 500);
    }
  },

  async likePost(postId: string, userId: string): Promise<void> {
    // 게시글 존재 확인
    const { data: post } = await supabase
      .from('posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // 이미 좋아요 했는지 확인
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('target_id', postId)
      .eq('target_type', 'post')
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      throw new AppError('You have already liked this post', 400);
    }

    // 좋아요 생성
    const { error: likeError } = await supabase
      .from('likes')
      .insert([{
        target_id: postId,
        target_type: 'post',
        user_id: userId,
      }]);

    if (likeError) {
      throw new AppError('Failed to like post', 500);
    }

    // 게시글 좋아요 수 증가
    await supabase
      .from('posts')
      .update({ like_count: supabase.rpc('increment') })
      .eq('id', postId);
  },

  async unlikePost(postId: string, userId: string): Promise<void> {
    // 게시글 존재 확인
    const { data: post } = await supabase
      .from('posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // 좋아요 삭제
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('target_id', postId)
      .eq('target_type', 'post')
      .eq('user_id', userId);

    if (error) {
      throw new AppError('Failed to unlike post', 500);
    }

    // 게시글 좋아요 수 감소
    await supabase
      .from('posts')
      .update({ like_count: supabase.rpc('decrement') })
      .eq('id', postId);
  },

  async searchPosts(query: string, params: PostQuery): Promise<PostListResponse> {
    const {
      category,
      isAnswered,
      sortBy = 'latest',
      page = 1,
      limit = 20,
    } = params;

    let supabaseQuery = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .textSearch('title', query);

    // 필터 적용
    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }
    if (isAnswered !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_answered', isAnswered);
    }

    // 정렬 적용
    if (sortBy === 'latest') {
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
    } else if (sortBy === 'popular') {
      supabaseQuery = supabaseQuery.order('like_count', { ascending: false });
    }

    // 페이지네이션
    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    supabaseQuery = supabaseQuery.range(from, to);

    const { data: posts, error, count } = await supabaseQuery;

    if (error) {
      throw new AppError('Failed to search posts', 500);
    }

    // 작성자 정보 가져오기
    const postsWithAuthors = await Promise.all(
      (posts || []).map(async (post) => {
        const { data: author } = await supabase
          .from('users')
          .select('name, avatar, type, teacher_type')
          .eq('id', post.author_id)
          .single();
        
        return {
          ...post,
          author: author || null,
        };
      })
    );

    return {
      posts: postsWithAuthors as IPost[],
      total: count || 0,
      page: pageNum,
      totalPages: Math.ceil((count || 0) / limitNum),
    };
  },
};