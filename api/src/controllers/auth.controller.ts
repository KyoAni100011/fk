import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service.js";

const registerSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const verifyOTPSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6),
});

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = registerSchema.parse(req.body);
      
      const result = await this.authService.register(username, email, password);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      req.session.userId = (result as any).data.id;
      res.json((result as any).data);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const result = await this.authService.login(email, password);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      req.session.userId = (result as any).data.id;
      res.json((result as any).data);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      const result = await this.authService.forgotPassword(email);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      res.json((result as any).data);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const { email, code } = verifyOTPSchema.parse(req.body);

      const result = await this.authService.verifyOTP(email, code);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      req.session.resetEmail = email;
      res.json((result as any).data);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
      console.error("OTP verification error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { newPassword } = resetPasswordSchema.parse(req.body);

      if (!req.session.resetEmail) {
        return res.status(403).json({ message: "Session expired or not verified" });
      }

      const result = await this.authService.resetPassword(req.session.resetEmail, newPassword);
      if ("error" in result) return res.status((result as any).status || 500).json({ message: (result as any).error });

      delete req.session.resetEmail;
      res.json((result as any).data);
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
