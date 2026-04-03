import { prisma } from "../../lib/prisma.js";

export class CommentRepository {
  async createComment(content: string, userId: string, postId: string, parentId?: string) {
    return prisma.comment.create({
      data: {
        content,
        userId,
        postId,
        parentId,
      },
      include: { user: { select: { id: true, username: true, avatarUrl: true } } },
    });
  }

  async findCommentById(id: string) {
    return prisma.comment.findUnique({ where: { id } });
  }

  async deleteComment(id: string) {
    return prisma.comment.delete({ where: { id } });
  }

  async findCommentsByPostId(postId: string) {
    return prisma.comment.findMany({
      where: { postId },
      include: { user: { select: { id: true, username: true, avatarUrl: true } } },
      orderBy: { createdAt: "asc" },
    });
  }
}
