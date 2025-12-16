import { RecoveryActionStatus } from "@prisma/client";
import {prisma} from "../config/database";

export const getRecoveryActionsService = async () => {
    return await prisma.recoveryAction.findMany({
        orderBy: { createdAt: "desc" },
    });
};

export const createRecoveryActionService = async (data: any) => {
    return await prisma.recoveryAction.create({ data });
};

export const updateRecoveryActionStatusService = async (
  id: string,
  status: RecoveryActionStatus
) => {
  return await prisma.recoveryAction.update({
    where: { id }, // if id is string type in schema
    data: {
      status,
      executedAt: new Date(),
    },
  });
};