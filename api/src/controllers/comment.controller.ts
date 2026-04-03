import { Request, Response } from "express";
import { z } from "zod";
import { CommentService } from "../services/comment.service.js";

const addCommentSchema = z.object({
  content: z.string().min(1),
  parentId: z.string().optional(),
});

export class CommentController {
  constructor(private commentService: CommentService) {}

  addComment = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId as string;
      const { content, parentId } = addCommentSchema.parse(req.body);
      const userId = req.session.userId;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await this.commentService.addComment(content, userId, postId, parentId);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      res.status((result as any).status || 201).json((result as any).data);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  deleteComment = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const userId = req.session.userId;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await this.commentService.deleteComment(id, userId);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      res.json((result as any).data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getComments = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId as string;
      const result = await this.commentService.getComments(postId);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      res.json((result as any).data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
