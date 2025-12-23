import { prisma } from "../config/database";
import bcrypt from "bcryptjs";
import { generateTempPassword } from "../utils/password.utils";
import { Role, AgentStatus } from "@prisma/client";

export const AgentService = {
  getAgents: async () => {
    return prisma.agent.findMany({
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });
  },

  getAgentById: async (id: string) => {
    return prisma.agent.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
        assignedCases: true,
      },
    });
  },

  createAgent: async (data: any) => {
    const { name, email, phone, location, password } = data;
    const isManualPassword = !!password;
    const finalPassword = password || generateTempPassword();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(finalPassword, salt);

    // Transaction to create User and Agent together
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Create User
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.AGENT,
        },
      });

      // 2. Create Agent
      const agent = await prisma.agent.create({
        data: {
          userId: user.id,
          name,
          email,
          phone,
          location,
          status: AgentStatus.OFFLINE,
        },
      });

      return { agent, finalPassword };
    });

    // Send email with credentials
    // We send finalPassword which is either the manual one or the temp one
    const { EmailService } = await import("./email.service"); // Dynamic import to avoid cycles or ensure loading
    await EmailService.sendWelcomeEmail(email, name, finalPassword);

    return result;
  },

  updateAgent: async (id: string, data: any) => {
    return prisma.agent.update({
      where: { id },
      data,
    });
  },

  deleteAgent: async (id: string) => {
    return prisma.agent.delete({
      where: { id },
    });
  },
};
