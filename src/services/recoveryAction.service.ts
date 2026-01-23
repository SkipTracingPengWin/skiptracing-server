import { RecoveryActionStatus } from "@prisma/client";
import { prisma } from "../config/database";
import { auditLogService } from "./auditLogService";

export const getRecoveryActionsService = async (user?: any) => {
  let where: any = {};

  if (user && user.role === "AGENT") {
    const agent = await prisma.agent.findUnique({
      where: { userId: user.id },
    });

    if (agent) {
      where = {
        borrower: {
          assignments: {
            some: {
              agentId: agent.id,
            },
          },
        },
      };
    } else {
      // If user is AGENT role but no Agent record found, return empty or handle gracefully
      // For safety, return empty list if they are an agent but not linked correctly
      return [];
    }
  }

  return await prisma.recoveryAction.findMany({
    where,
    include: {
      borrower: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createRecoveryActionService = async (data: any, user?: any) => {
  const recoveryAction = await prisma.recoveryAction.create({ data });

  const actorId = user ? user.id : (data.executedBy || "SYSTEM");
  const actorName = user ? user.name : "SYSTEM";
  const actorRole = user ? user.role : undefined;

  await auditLogService.createLog({
    borrowerId: recoveryAction.borrowerId,
    module: "RECOVERY",
    action: "CREATE",
    details: `Recovery action ${recoveryAction.type} initiated`,
    status: "SUCCESS",
    actorId,
    actorName,
    actorRole,
  });

  return recoveryAction;
};

export const updateRecoveryActionStatusService = async (
  id: string,
  status: RecoveryActionStatus,
  user?: any
) => {
  const updatedAction = await prisma.recoveryAction.update({
    where: { id }, // if id is string type in schema
    data: {
      status,
      executedAt: new Date(),
    },
  });

  const actorId = user ? user.id : (updatedAction.executedBy || "SYSTEM");
  const actorName = user ? user.name : "SYSTEM";
  const actorRole = user ? user.role : undefined;

  await auditLogService.createLog({
    borrowerId: updatedAction.borrowerId,
    module: "RECOVERY",
    action: "STATUS_CHANGE",
    details: `Recovery action ${updatedAction.type} status changed to ${status}`,
    status: "SUCCESS",
    actorId,
    actorName,
    actorRole,
  });

  return updatedAction;
};