import { Router } from "express";
import { PostController } from "../controllers/post.controller.js";
import { PostService } from "../services/post.service.js";
import { PostRepository } from "../repositories/post.repository.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

// Manual Dependency Injection Wire-up
const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);
router.post("/", isAuthenticated, postController.createPost);
router.put("/:id", isAuthenticated, postController.updatePost);
router.delete("/:id", isAuthenticated, postController.deletePost);

export default router;
