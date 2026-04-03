import { CommentRepository } from "../repositories/comment.repository.js";
import { PostRepository } from "../repositories/post.repository.js";

export class CommentService {
  constructor(
    private commentRepo: CommentRepository,
    private postRepo: PostRepository
  ) {}

  async addComment(content: string, userId: string, postId: string, parentId?: string) {
    const post = await this.postRepo.findById(postId);
    if (!post) return { error: "Post not found", status: 404 };

    if (parentId) {
      const parentComment = await this.commentRepo.findCommentById(parentId);
      if (!parentComment || parentComment.postId !== postId) {
        return { error: "Invalid parent comment", status: 400 };
      }
    }

    const comment = await this.commentRepo.createComment(content, userId, postId, parentId);
    return { data: comment, status: 201 };
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.commentRepo.findCommentById(id);
    if (!comment) return { error: "Comment not found", status: 404 };
    if (comment.userId !== userId) return { error: "Forbidden", status: 403 };

    await this.commentRepo.deleteComment(id);
    return { data: { message: "Comment deleted successfully" } };
  }

  async getComments(postId: string) {
    const comments = await this.commentRepo.findCommentsByPostId(postId);

    const commentMap = new Map();
    const roots: any[] = [];

    comments.forEach(c => {
      commentMap.set(c.id, { ...c, replies: [] });
    });

    comments.forEach(c => {
      if (c.parentId) {
        const parent = commentMap.get(c.parentId);
        if (parent) {
          parent.replies.push(commentMap.get(c.id));
        }
      } else {
        roots.push(commentMap.get(c.id));
      }
    });

    return { data: roots };
  }
}
