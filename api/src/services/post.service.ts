import { PostRepository } from "../repositories/post.repository.js";

export class PostService {
  constructor(private postRepo: PostRepository) {}

  async createPost(title: string, content: string, userId: string) {
    return this.postRepo.create({ title, content, userId });
  }

  async getPosts(page: number, limit: number, userIdQuery?: string, currentUserId?: string) {
    const skip = (page - 1) * limit;
    const where = userIdQuery ? { userId: userIdQuery } : {};

    const posts = await this.postRepo.findMany(where, skip, limit);
    let postsWithLikes = posts.map(p => ({ ...p, isLikedByMe: false }));

    if (currentUserId && posts.length > 0) {
      const postIds = posts.map(p => p.id);
      const userLikes = await this.postRepo.getLikesByUserIdForPosts(currentUserId, postIds);
      const likedPostIds = new Set(userLikes.map(l => l.postId));
      
      postsWithLikes = posts.map(p => ({
        ...p,
        isLikedByMe: likedPostIds.has(p.id)
      }));
    }

    const total = await this.postRepo.count(where);

    return {
      data: postsWithLikes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPostById(id: string, currentUserId?: string) {
    const post = await this.postRepo.findById(id);
    if (!post) return { error: "Post not found", status: 404 };

    let isLikedByMe = false;
    if (currentUserId) {
      const like = await this.postRepo.getLikeByUserIdAndPostId(currentUserId, id);
      isLikedByMe = !!like;
    }

    return { data: { ...post, isLikedByMe } };
  }

  async updatePost(id: string, title: string | undefined, content: string | undefined, userId: string) {
    const post = await this.postRepo.findById(id);
    if (!post) return { error: "Post not found", status: 404 };
    if (post.userId !== userId) return { error: "Forbidden", status: 403 };

    const updated = await this.postRepo.update(id, { title, content });
    return { data: updated };
  }

  async deletePost(id: string, userId: string) {
    const post = await this.postRepo.findById(id);
    if (!post) return { error: "Post not found", status: 404 };
    if (post.userId !== userId) return { error: "Forbidden", status: 403 };

    await this.postRepo.delete(id);
    return { data: true };
  }
}
