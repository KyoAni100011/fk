import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { AuthRepository } from "../repositories/auth.repository.js";

const router = Router();

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const authService = new AuthService(userRepository, authRepository);
const authController = new AuthController(authService);

router.post("/sign-up", authController.register);
router.post("/sign-in", authController.login);
router.post("/log-out", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);

export default router;
