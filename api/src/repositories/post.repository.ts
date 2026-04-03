import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export class PostRepository {
  async create(data: Prisma.PostUncheckedCreateInput) {
    return prisma.post.create({
      data,
      include: { user: { select: { id: true, username: true } } },
    });
  }

  async findMany(where: any, skip: number, take: number) {
    return prisma.post.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
        _count: { select: { likes: true, comments: true } }, // Changed spacing
      },
    });
  }

  async getLikesByUserIdForPosts(userId: string, postIds: string[]) {
    return prisma.like.findMany({
      where: {
        userId,
        postId: { in: postIds },
      },
    });
  }

  async getLikeByUserIdAndPostId(userId: string, postId: string) {
    return prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
  }

  async count(where: any) {
    return prisma.post.count({ where });
  }

  async update(id: string, data: Prisma.PostUpdateInput) {
    return prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.post.delete({ where: { id } });
  }
}
