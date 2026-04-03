import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository.js";

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async getCurrentUser(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) return { error: "User not found", status: 404 };
    return { data: { id: user.id, username: user.username } };
  }

  async updateUsername(id: string, username: string) {
    const user = await this.userRepo.update(id, { username });
    return { data: { id: user.id, username: user.username } };
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findById(id);
    if (!user) return { error: "User not found", status: 404 };

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) return { error: "Invalid old password", status: 400 };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(id, { password: hashedPassword });
    return { data: { message: "Password updated successfully" } };
  }
}
