import { prisma } from "../../lib/prisma.js";

export class AuthRepository {
  async createPasswordResetCode(email: string, code: string, expiresAt: Date) {
    return prisma.passwordResetCode.create({
      data: { email, code, expiresAt },
    });
  }

  async findValidResetCode(email: string, code: string) {
    return prisma.passwordResetCode.findFirst({
      where: { email, code, expiresAt: { gt: new Date() } },
    });
  }

  async deleteResetCode(id: string) {
    return prisma.passwordResetCode.delete({ where: { id } });
  }
}
