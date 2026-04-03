import { Request, Response } from "express";
import { z } from "zod";
import { getUploadSignature } from "../services/upload.service.js";

const getUploadSignatureSchema = z.object({
  folder: z.string().optional().default("temp"),
});

export class UploadController {
  getUploadUrl = async (req: Request, res: Response) => {
    try {
      const { folder } = getUploadSignatureSchema.parse(req.body);
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const completeFolder = `papana/users/${userId}/${folder}`;
      const { timestamp, signature } = getUploadSignature(completeFolder);

      res.status(200).json({ 
        signature, 
        timestamp, 
        cloudName: process.env.CLOUDINARY_CLOUD_NAME, 
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder: completeFolder 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.issues });
      }
      console.error("Upload error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
