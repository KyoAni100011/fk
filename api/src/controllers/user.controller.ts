import { Request, Response } from "express";
import { z } from "zod";
import { UserService } from "../services/user.service.js";

const updateUsernameSchema = z.object({
  username: z.string().min(1),
});

const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export class UserController {
  constructor(private userService: UserService) {}

  getCurrentUser = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.getCurrentUser(req.session.userId as string);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      res.json((result as any).data);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  updateUsername = async (req: Request, res: Response) => {
    try {
      const { username } = updateUsernameSchema.parse(req.body);
      const userId = req.session.userId;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await this.userService.updateUsername(userId, username);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      res.json((result as any).data);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  updatePassword = async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = updatePasswordSchema.parse(req.body);
      const userId = req.session.userId;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await this.userService.updatePassword(userId, oldPassword, newPassword);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      res.json((result as any).data);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
