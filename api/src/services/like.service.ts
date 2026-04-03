import { LikeRepository } from "../repositories/like.repository.js";
import { PostRepository } from "../repositories/post.repository.js";

export class LikeService {
  constructor(
    private likeRepo: LikeRepository,
    private postRepo: PostRepository
  ) {}

  async toggleLike(userId: string, postId: string) {
    const post = await this.postRepo.findById(postId);
    if (!post) return { error: "Post not found", status: 404 };

    const existingLike = await this.likeRepo.findLikeByUserAndPost(userId, postId);

    if (existingLike) {
      await this.likeRepo.deleteLike(existingLike.id);
      const likeCount = await this.likeRepo.countLikesByPost(postId);
      return { data: { message: "Unliked", isLiked: false, likeCount } };
    } else {
      await this.likeRepo.createLike(userId, postId);
      const likeCount = await this.likeRepo.countLikesByPost(postId);
      return { data: { message: "Liked", isLiked: true, likeCount } };
    }
  }
}
