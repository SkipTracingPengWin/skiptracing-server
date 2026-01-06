import { RecoveryActionStatus } from "@prisma/client";
import { prisma } from "../config/database";
import { auditLogService } from "./auditLogService";

export const getRecoveryActionsService = async () => {
  return await prisma.recoveryAction.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const createRecoveryActionService = async (data: any) => {
  const recoveryAction = await prisma.recoveryAction.create({ data });

  await auditLogService.createLog({
    borrowerId: recoveryAction.borrowerId,
    module: "RECOVERY",
    action: "CREATE",
    details: `Recovery action ${recoveryAction.type} initiated`,
    status: "SUCCESS",
    actorId: data.executedBy || "SYSTEM",
  });

  return recoveryAction;
};

export const updateRecoveryActionStatusService = async (
  id: string,
  status: RecoveryActionStatus
) => {
  const updatedAction = await prisma.recoveryAction.update({
    where: { id }, // if id is string type in schema
    data: {
      status,
      executedAt: new Date(),
    },
  });

  await auditLogService.createLog({
    borrowerId: updatedAction.borrowerId,
    module: "RECOVERY",
    action: "STATUS_CHANGE",
    details: `Recovery action ${updatedAction.type} status changed to ${status}`,
    status: "SUCCESS",
    actorId: updatedAction.executedBy || "SYSTEM",
  });

  return updatedAction;
};