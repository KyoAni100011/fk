import { Request, Response } from "express";
import { LikeService } from "../services/like.service.js";

export class LikeController {
  constructor(private likeService: LikeService) {}

  toggleLike = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId as string;
      const userId = req.session.userId;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await this.likeService.toggleLike(userId, postId);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      res.json((result as any).data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
