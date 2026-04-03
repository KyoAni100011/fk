import { Request, Response } from "express";
import { z } from "zod";
import { PostService } from "../services/post.service.js";

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

export class PostController {
  constructor(private postService: PostService) {}

  createPost = async (req: Request, res: Response) => {
    try {
      const { title, content } = createPostSchema.parse(req.body);
      const userId = req.session.userId;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const post = await this.postService.createPost(title, content, userId);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getPosts = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userIdQuery = req.query.userId as string;
      const currentUserId = req.session.userId;

      const result = await this.postService.getPosts(page, limit, userIdQuery, currentUserId);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getPost = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const currentUserId = req.session.userId;

      const result = await this.postService.getPostById(id, currentUserId);
      if ("error" in result) {
        return res.status(result.status || 500).json({ message: result.error });
      }

      res.json(result.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  updatePost = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { title, content } = updatePostSchema.parse(req.body);
      const userId = req.session.userId;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await this.postService.updatePost(id, title, content, userId);
      if ("error" in result) {
        return res.status(result.status || 500).json({ message: result.error });
      }

      res.json(result.data);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  deletePost = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const userId = req.session.userId;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await this.postService.deletePost(id, userId);
      if ("error" in result) {
        return res.status(result.status || 500).json({ message: result.error });
      }

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
