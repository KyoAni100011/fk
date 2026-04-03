import { Router } from "express";
import { CommentController } from "../controllers/comment.controller.js";
import { CommentService } from "../services/comment.service.js";
import { CommentRepository } from "../repositories/comment.repository.js";
import { PostRepository } from "../repositories/post.repository.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

const commentRepository = new CommentRepository();
const postRepository = new PostRepository();
const commentService = new CommentService(commentRepository, postRepository);
const commentController = new CommentController(commentService);

router.get("/:postId", commentController.getComments);
router.post("/:postId", isAuthenticated, commentController.addComment);
router.delete("/:id", isAuthenticated, commentController.deleteComment);

export default router;
