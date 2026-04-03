import { Router } from "express";
import { LikeController } from "../controllers/like.controller.js";
import { LikeService } from "../services/like.service.js";
import { LikeRepository } from "../repositories/like.repository.js";
import { PostRepository } from "../repositories/post.repository.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

const likeRepository = new LikeRepository();
const postRepository = new PostRepository();
const likeService = new LikeService(likeRepository, postRepository);
const likeController = new LikeController(likeService);

router.post("/:postId", isAuthenticated, likeController.toggleLike);

export default router;
