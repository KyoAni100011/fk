import { prisma } from "../../lib/prisma.js";

export class LikeRepository {
  async findLikeByUserAndPost(userId: string, postId: string) {
    return prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
  }

  async deleteLike(id: string) {
    return prisma.like.delete({
      where: { id },
    });
  }

  async createLike(userId: string, postId: string) {
    return prisma.like.create({
      data: { userId, postId },
    });
  }

  async countLikesByPost(postId: string) {
    return prisma.like.count({ where: { postId } });
  }
}
