import { prisma } from "../config/database";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export const AuthService = {
  register: async (data: any) => {
    const { name, email, password, role } = data;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) return null;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || Role.AGENT,
      },
    });

    // Auto-create agent profile
    if (user.role === Role.AGENT) {
      await prisma.agent.create({
        data: {
          userId: user.id,
          name: user.name!,
          email: user.email,
          status: "OFFLINE",
        },
      });
    }

    return user;
  },

  login: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return null;

    return user;
  },

  changePassword: async (userId: string, newPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,

      },
    });
  },

  getProfile: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },

  updateProfile: async (userId: string, data: { name?: string; email?: string }) => {
    const { name, email } = data;

    // specific check: if email is changing, ensure it's not taken by another user
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error("Email already in use");
      }
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  getUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },
};
