import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { sendEmail } from "./email.js";

export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private authRepo: AuthRepository
  ) {}

  async register(username: string, email: string, password: string) {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) return { error: "User already exists", status: 400 };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({
      username,
      email,
      password: hashedPassword,
    });
    return { data: { id: user.id, username: user.username } };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return { error: "Invalid credentials", status: 401 };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { error: "Invalid credentials", status: 401 };

    return { data: { id: user.id, username: user.username } };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return { error: "No user found with this email", status: 404 };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

    await this.authRepo.createPasswordResetCode(email, code, expiresAt);

    await sendEmail(
      email,
      "Password Reset Code",
      `Your verification code is: <strong>${code}</strong>. It will expire in 10 minutes.`
    );
    return { data: { message: "Verification code sent to email" } };
  }

  async verifyOTP(email: string, code: string) {
    const resetCode = await this.authRepo.findValidResetCode(email, code);
    if (!resetCode) return { error: "Invalid or expired code", status: 400 };

    await this.authRepo.deleteResetCode(resetCode.id);
    return { data: { message: "OTP verified correctly" } };
  }

  async resetPassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updateByEmail(email, { password: hashedPassword });
    return { data: { message: "Password updated successfully" } };
  }
}
