import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async updateByEmail(email: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { email }, data });
  }
}
