import { Router } from "express";
import { UploadController } from "../controllers/upload.controller.js";

const router = Router();
const uploadController = new UploadController();

router.post("/url", uploadController.getUploadUrl);

export default router;
