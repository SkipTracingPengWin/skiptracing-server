import { prisma } from "../config/database";

export const getAlertsService = (agentId: string) => {
  return prisma.alert.findMany({
    where: { agentId },
    include: {
      admin: { select: { name: true, email: true } },
      borrower: { select: { name: true, phone: true } }
    },
    orderBy: { createdAt: "desc" },
  });
};

export const markAlertReadService = (id: string) => {
  return prisma.alert.update({
    where: { id },
    data: { read: true },
  });
};

interface CreateAlertData {
  adminId: string;
  agentId: string;
  borrowerId?: string;
  title: string;
  message: string;
  type: string;
}

export const createAlertService = async (data: CreateAlertData) => {
  let targetUserId = data.agentId;

  // Check if the provided ID is an Agent ID, and if so, resolve to User ID
  try {
    const agentRecord = await prisma.agent.findUnique({
      where: { id: data.agentId },
      select: { userId: true }
    });
    if (agentRecord) {
      targetUserId = agentRecord.userId;
    }
  } catch {
    // Ignore error, assume it might be a direct User ID or invalid format
  }

  return prisma.alert.create({
    data: {
      adminId: data.adminId,
      agentId: targetUserId,
      borrowerId: data.borrowerId,
      title: data.title,
      message: data.message,
      type: data.type,
    }
  });
};

export const deleteAlertService = (id: string) => {
  return prisma.alert.delete({
    where: { id },
  });
};
