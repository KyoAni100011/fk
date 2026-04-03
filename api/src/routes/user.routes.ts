import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { UserService } from "../services/user.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/", isAuthenticated, userController.getCurrentUser);
router.put("/username", isAuthenticated, userController.updateUsername);
router.put("/password", isAuthenticated, userController.updatePassword);
router.put("/avatar", isAuthenticated, userController.updateAvatar);

export default router;
