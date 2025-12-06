import { AgentStatus } from "@prisma/client";
import { prisma } from "../config/database";

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
    return prisma.agent.create({
      data: {
        ...data,
        status: AgentStatus.OFFLINE,
      },
    });
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
