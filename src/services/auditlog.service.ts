import {prisma} from "../config/database";

export const getAuditLogsService = () => {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
  });
};

export const createAuditLogService = (data: any, actorId: string) => {
  return prisma.auditLog.create({
    data: {
      ...data,
      actorId,
    },
  });
};
