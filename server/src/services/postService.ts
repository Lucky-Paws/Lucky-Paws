import { Post } from '../models/Post';
import { Like } from '../models/Like';
import { Comment } from '../models/Comment';
import { AppError } from '../middleware/errorHandler';
import { IPost } from '../types';

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
      teacherLevel,
      category,
      isAnswered,
      sortBy = 'latest',
      page = 1,
      limit = 20,
    } = query;

    const filter: any = {};

    if (category) filter.category = category;
    if (isAnswered !== undefined) filter.isAnswered = isAnswered;

    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;
    const skip = (pageNum - 1) * limitNum;

    const sortOptions: any = {
      latest: { createdAt: -1 },
      popular: { likeCount: -1, commentCount: -1, viewCount: -1 },
    };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name avatar type teacherType')
        .sort(sortOptions[sortBy] || sortOptions.latest)
        .skip(skip)
        .limit(limitNum),
      Post.countDocuments(filter),
    ]);

    return {
      posts,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    };
  },

  async getPost(postId: string): Promise<IPost> {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('author', 'name avatar type teacherType bio isVerified');

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  },

  async createPost(data: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    authorId: string;
  }): Promise<IPost> {
    const post = await Post.create({
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags,
      author: data.authorId,
    });

    await post.populate('author', 'name avatar type teacherType');
    return post;
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
    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (post.author.toString() !== userId) {
      throw new AppError('You can only edit your own posts', 403);
    }

    Object.assign(post, data);
    await post.save();
    await post.populate('author', 'name avatar type teacherType');

    return post;
  },

  async deletePost(postId: string, userId: string): Promise<void> {
    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (post.author.toString() !== userId) {
      throw new AppError('You can only delete your own posts', 403);
    }

    await Promise.all([
      post.deleteOne(),
      Like.deleteMany({ targetId: postId, targetType: 'post' }),
      Comment.deleteMany({ postId }),
    ]);
  },

  async likePost(postId: string, userId: string): Promise<void> {
    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const existingLike = await Like.findOne({
      targetId: postId,
      targetType: 'post',
      userId,
    });

    if (existingLike) {
      throw new AppError('You have already liked this post', 400);
    }

    await Like.create({
      targetId: postId,
      targetType: 'post',
      userId,
    });

    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });
  },

  async unlikePost(postId: string, userId: string): Promise<void> {
    const like = await Like.findOneAndDelete({
      targetId: postId,
      targetType: 'post',
      userId,
    });

    if (!like) {
      throw new AppError('You have not liked this post', 400);
    }

    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
  },

  async searchPosts(query: string, params: PostQuery): Promise<PostListResponse> {
    const searchFilter = {
      $text: { $search: query },
      ...params,
    };

    const pageNum = typeof params.page === 'string' ? parseInt(params.page) : params.page || 1;
    const limitNum = typeof params.limit === 'string' ? parseInt(params.limit) : params.limit || 20;
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await Promise.all([
      Post.find(searchFilter)
        .populate('author', 'name avatar type teacherType')
        .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Post.countDocuments(searchFilter),
    ]);

    return {
      posts,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    };
  },
};